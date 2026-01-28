/**
 * Hook para gestión de estados de UI relacionados con imágenes
 */

import { useState, useCallback, useRef } from 'react';
import { imageMetadataExtractor } from '@/utils/imageMetadataExtractor';
import { formatFileSize, formatResolution } from '@/utils/formatUtils';
import { toast } from 'sonner';

export interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'validating' | 'optimizing' | 'uploading' | 'success' | 'error';
  error?: string;
  metadata?: any;
  optimizationInfo?: {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
  };
}

export interface UploadState {
  files: FileWithProgress[];
  overallProgress: number;
  isUploading: boolean;
  completedCount: number;
  errorCount: number;
}

export const useImageUploadState = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    files: [],
    overallProgress: 0,
    isUploading: false,
    completedCount: 0,
    errorCount: 0
  });

  const fileIdCounter = useRef(0);

  /**
   * Inicializa archivos para upload
   */
  const initializeFiles = useCallback((fileList: FileList) => {
    const newFiles: FileWithProgress[] = Array.from(fileList).map(file => ({
      id: `file_${++fileIdCounter.current}`,
      file,
      progress: 0,
      status: 'pending' as const
    }));

    setUploadState({
      files: newFiles,
      overallProgress: 0,
      isUploading: false,
      completedCount: 0,
      errorCount: 0
    });

    return newFiles;
  }, []);

  /**
   * Actualiza el estado de un archivo específico
   */
  const updateFileStatus = useCallback((
    fileId: string, 
    updates: Partial<Pick<FileWithProgress, 'status' | 'progress' | 'error' | 'metadata' | 'optimizationInfo'>>
  ) => {
    setUploadState(prev => {
      const newFiles = prev.files.map(file => 
        file.id === fileId ? { ...file, ...updates } : file
      );

      const completedCount = newFiles.filter(f => f.status === 'success').length;
      const errorCount = newFiles.filter(f => f.status === 'error').length;
      const totalProgress = newFiles.reduce((sum, file) => sum + file.progress, 0);
      const overallProgress = newFiles.length > 0 ? totalProgress / newFiles.length : 0;

      return {
        ...prev,
        files: newFiles,
        completedCount,
        errorCount,
        overallProgress,
        isUploading: completedCount + errorCount < newFiles.length
      };
    });
  }, []);

  /**
   * Inicia el proceso de upload
   */
  const startUpload = useCallback(() => {
    setUploadState(prev => ({ ...prev, isUploading: true }));
  }, []);

  /**
   * Finaliza el proceso de upload
   */
  const finishUpload = useCallback(() => {
    setUploadState(prev => ({ ...prev, isUploading: false }));
  }, []);

  /**
   * Valida un archivo y extrae metadatos
   */
  const validateFile = useCallback(async (fileId: string) => {
    const file = uploadState.files.find(f => f.id === fileId)?.file;
    if (!file) return;

    updateFileStatus(fileId, { status: 'validating', progress: 10 });

    try {
      const analysis = await imageMetadataExtractor.analyzeImage(file);
      
      updateFileStatus(fileId, { 
        status: 'pending', 
        progress: 20,
        metadata: analysis 
      });

      // Mostrar advertencias si las hay
      if (analysis.warnings.length > 0) {
        analysis.warnings.forEach(warning => {
          toast.warning(`${file.name}: ${warning}`);
        });
      }

      // Mostrar recomendaciones
      if (analysis.recommendations.length > 0) {
        console.log(`Recommendations for ${file.name}:`, analysis.recommendations);
      }

      return analysis;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de validación';
      updateFileStatus(fileId, { 
        status: 'error', 
        error: errorMessage 
      });
      throw error;
    }
  }, [uploadState.files, updateFileStatus]);

  /**
   * Muestra información de un archivo
   */
  const showFileInfo = useCallback((fileId: string) => {
    const fileData = uploadState.files.find(f => f.id === fileId);
    if (!fileData) return;

    const { file, metadata } = fileData;
    
    const info = [
      `Nombre: ${file.name}`,
      `Tamaño: ${formatFileSize(file.size)}`,
      `Tipo: ${file.type}`
    ];

    if (metadata?.metadata) {
      info.push(
        `Resolución: ${formatResolution(metadata.metadata.width, metadata.metadata.height)}`,
        `Calidad estimada: ${metadata.metadata.estimatedQuality}`
      );
    }

    toast.info(info.join('\n'), { duration: 5000 });
  }, [uploadState.files]);

  /**
   * Remueve un archivo de la lista
   */
  const removeFile = useCallback((fileId: string) => {
    setUploadState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  }, []);

  /**
   * Limpia todos los archivos
   */
  const clearFiles = useCallback(() => {
    setUploadState({
      files: [],
      overallProgress: 0,
      isUploading: false,
      completedCount: 0,
      errorCount: 0
    });
  }, []);

  /**
   * Reintenta archivos fallidos
   */
  const retryFailedFiles = useCallback(() => {
    setUploadState(prev => ({
      ...prev,
      files: prev.files.map(file => 
        file.status === 'error' 
          ? { ...file, status: 'pending' as const, progress: 0, error: undefined }
          : file
      )
    }));
  }, []);

  /**
   * Obtiene estadísticas del upload
   */
  const getUploadStats = useCallback(() => {
    const { files } = uploadState;
    const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);
    const uploadedSize = files
      .filter(f => f.status === 'success')
      .reduce((sum, f) => sum + f.file.size, 0);
    
    const totalOptimizationSavings = files
      .filter(f => f.optimizationInfo)
      .reduce((sum, f) => sum + (f.optimizationInfo!.originalSize - f.optimizationInfo!.optimizedSize), 0);

    return {
      totalFiles: files.length,
      totalSize,
      uploadedSize,
      uploadedPercentage: totalSize > 0 ? (uploadedSize / totalSize) * 100 : 0,
      totalOptimizationSavings,
      optimizedFilesCount: files.filter(f => f.optimizationInfo).length
    };
  }, [uploadState]);

  return {
    uploadState,
    initializeFiles,
    updateFileStatus,
    startUpload,
    finishUpload,
    validateFile,
    showFileInfo,
    removeFile,
    clearFiles,
    retryFailedFiles,
    getUploadStats
  };
};