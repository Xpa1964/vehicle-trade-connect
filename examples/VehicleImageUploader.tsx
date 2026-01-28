/**
 * Ejemplo completo de implementación del sistema de imágenes mejorado
 * Demuestra cómo usar todas las nuevas funcionalidades manteniendo compatibilidad
 */

import React, { useState, useCallback } from 'react';
import { Upload, Image, CheckCircle, AlertTriangle } from 'lucide-react';
import { useVehicleImageUpload } from '@/hooks/useVehicleImageUpload';
import { useImageUploadState } from '@/hooks/useImageUploadState';
import { UploadProgress, BatchUploadProgress } from '@/components/ui/UploadProgress';
import { imageValidator } from '@/utils/imageValidation';
import { imageMetadataExtractor } from '@/utils/imageMetadataExtractor';
import { formatFileSize, formatResolution } from '@/utils/formatUtils';
import { toast } from 'sonner';

interface VehicleImageUploaderProps {
  vehicleId: string;
  onImagesUploaded?: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

export const VehicleImageUploader: React.FC<VehicleImageUploaderProps> = ({
  vehicleId,
  onImagesUploaded,
  maxImages = 25,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false);
  
  // Hooks principales (siguen funcionando exactamente igual)
  const { uploadImage, isUploading } = useVehicleImageUpload(vehicleId);
  
  // Nuevo hook para gestión avanzada de estados
  const {
    uploadState,
    initializeFiles,
    updateFileStatus,
    validateFile,
    clearFiles,
    getUploadStats
  } = useImageUploadState();

  /**
   * Maneja la selección de archivos (método básico - sin cambios)
   */
  const handleBasicUpload = async (files: FileList) => {
    const uploadedUrls: string[] = [];
    
    for (const file of Array.from(files)) {
      try {
        // ✅ Tu código existente sigue funcionando EXACTAMENTE igual
        const imageUrl = await uploadImage(file, false);
        if (imageUrl) {
          uploadedUrls.push(imageUrl);
        }
      } catch (error) {
        console.error('Error uploading:', error);
        toast.error(`Error subiendo ${file.name}`);
      }
    }
    
    onImagesUploaded?.(uploadedUrls);
  };

  /**
   * Maneja la selección con todas las nuevas funcionalidades
   */
  const handleAdvancedUpload = async (files: FileList) => {
    // Inicializar archivos para tracking
    const fileEntries = initializeFiles(files);
    const uploadedUrls: string[] = [];

    for (const fileEntry of fileEntries) {
      try {
        // 1. Validación previa con feedback
        updateFileStatus(fileEntry.id, { status: 'validating', progress: 10 });
        const analysis = await validateFile(fileEntry.id);
        
        if (!analysis) continue;

        // 2. Mostrar información de análisis si está habilitado
        if (showAdvancedInfo) {
          const info = [
            `Resolución: ${formatResolution(analysis.metadata.width, analysis.metadata.height)}`,
            `Tamaño: ${formatFileSize(fileEntry.file.size)}`,
            `Calidad: ${analysis.metadata.estimatedQuality}`,
            `Megapíxeles: ${analysis.metadata.megapixels.toFixed(1)}MP`
          ];
          toast.info(`${fileEntry.file.name}\n${info.join('\n')}`, { duration: 3000 });
        }

        // 3. Subida con tracking de progreso
        updateFileStatus(fileEntry.id, { status: 'uploading', progress: 50 });
        
        const imageUrl = await uploadImage(fileEntry.file, false);
        
        if (imageUrl) {
          uploadedUrls.push(imageUrl);
          updateFileStatus(fileEntry.id, { 
            status: 'success', 
            progress: 100 
          });
        } else {
          throw new Error('No se pudo obtener URL de imagen');
        }

      } catch (error) {
        console.error('Error uploading:', error);
        updateFileStatus(fileEntry.id, { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    }

    // Mostrar estadísticas finales
    const stats = getUploadStats();
    if (stats.optimizedFilesCount > 0) {
      toast.success(
        `${uploadedUrls.length} imágenes subidas. ${stats.optimizedFilesCount} optimizadas. ` +
        `Espacio ahorrado: ${formatFileSize(stats.totalOptimizationSavings)}`
      );
    }

    onImagesUploaded?.(uploadedUrls);
  };

  /**
   * Validación previa antes de procesar archivos
   */
  const validateFilesBeforeUpload = async (files: FileList): Promise<boolean> => {
    try {
      // Validación rápida con el validador
      const validation = await imageValidator.validateForUpload(files, vehicleId, 0);
      
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        return false;
      }

      // Mostrar advertencias si las hay
      validation.warnings.forEach(warning => toast.warning(warning));

      return true;
    } catch (error) {
      toast.error('Error validando archivos');
      return false;
    }
  };

  /**
   * Maneja la selección de archivos desde input o drag & drop
   */
  const handleFileSelection = async (files: FileList) => {
    if (!files.length) return;

    // Validación previa
    const isValid = await validateFilesBeforeUpload(files);
    if (!isValid) return;

    // Elegir método de upload basado en configuración
    if (showAdvancedInfo) {
      await handleAdvancedUpload(files);
    } else {
      await handleBasicUpload(files);
    }
  };

  /**
   * Handlers para drag & drop
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.length) {
      await handleFileSelection(files);
    }
  }, [vehicleId, showAdvancedInfo]);

  /**
   * Handler para input de archivos
   */
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      await handleFileSelection(files);
    }
    // Limpiar input para permitir seleccionar los mismos archivos de nuevo
    e.target.value = '';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Configuración de funcionalidades */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Subir Imágenes</h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showAdvancedInfo}
              onChange={(e) => setShowAdvancedInfo(e.target.checked)}
              className="rounded border-gray-300"
            />
            Información detallada
          </label>
        </div>
      </div>

      {/* Zona de drop */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            {dragActive ? (
              <Upload className="h-12 w-12 text-primary animate-bounce" />
            ) : (
              <Image className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium">
              {dragActive 
                ? '¡Suelta las imágenes aquí!' 
                : 'Arrastra imágenes aquí o haz clic para seleccionar'
              }
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Máximo {maxImages} imágenes. Formatos: JPEG, PNG, WebP
            </p>
          </div>

          {/* Información adicional */}
          {showAdvancedInfo && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Validación automática habilitada
              </div>
              <div className="flex items-center justify-center gap-2">
                <Image className="h-3 w-3 text-blue-500" />
                Optimización automática para archivos >1MB
              </div>
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="h-3 w-3 text-orange-500" />
                Análisis de metadatos incluido
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progreso de upload - solo si hay archivos en progreso */}
      {uploadState.files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Progreso de Subida</h4>
            <button
              onClick={clearFiles}
              className="text-sm text-muted-foreground hover:text-foreground"
              disabled={uploadState.isUploading}
            >
              Limpiar
            </button>
          </div>

          <BatchUploadProgress
            files={uploadState.files.map(f => ({
              id: f.id,
              name: f.file.name,
              size: f.file.size,
              status: f.status,
              progress: f.progress,
              error: f.error,
              optimizationInfo: f.optimizationInfo
            }))}
            overallProgress={uploadState.overallProgress}
          />
        </div>
      )}

      {/* Estado de carga simple para modo básico */}
      {isUploading && uploadState.files.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Upload className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Subiendo imágenes...</span>
        </div>
      )}
    </div>
  );
};