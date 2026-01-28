/**
 * Componente de feedback para estados de carga de imágenes
 */

import React from 'react';
import { Loader2, Upload, CheckCircle, XCircle, AlertTriangle, Image } from 'lucide-react';
import { formatFileSize, formatCompressionRatio } from '@/utils/formatUtils';

export interface UploadProgressProps {
  status: 'idle' | 'validating' | 'optimizing' | 'uploading' | 'success' | 'error';
  progress?: number;
  fileName?: string;
  fileSize?: number;
  error?: string;
  optimizationInfo?: {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
  };
  className?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  status,
  progress = 0,
  fileName,
  fileSize,
  error,
  optimizationInfo,
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'validating':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'optimizing':
        return <Image className="h-4 w-4 text-primary animate-pulse" />;
      case 'uploading':
        return <Upload className="h-4 w-4 text-primary" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'validating':
        return 'Validando archivo...';
      case 'optimizing':
        return 'Optimizando imagen...';
      case 'uploading':
        return 'Subiendo archivo...';
      case 'success':
        return 'Subida completada';
      case 'error':
        return error || 'Error en la subida';
      default:
        return 'Preparando...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'validating':
      case 'optimizing':
      case 'uploading':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`bg-card rounded-lg border p-4 space-y-3 animate-fade-in ${className}`}>
      {/* Header con estado */}
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div className="flex-1">
          <div className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          {fileName && (
            <div className="text-sm text-muted-foreground truncate">
              {fileName}
            </div>
          )}
        </div>
        {fileSize && (
          <div className="text-sm text-muted-foreground">
            {formatFileSize(fileSize)}
          </div>
        )}
      </div>

      {/* Barra de progreso */}
      {(status === 'uploading' || status === 'optimizing') && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Información de optimización */}
      {optimizationInfo && status === 'success' && (
        <div className="bg-muted/50 rounded p-3 space-y-1">
          <div className="text-xs font-medium text-muted-foreground">
            Imagen optimizada
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Original:</span>
              <span className="ml-1">{formatFileSize(optimizationInfo.originalSize)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Optimizada:</span>
              <span className="ml-1">{formatFileSize(optimizationInfo.optimizedSize)}</span>
            </div>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Reducción:</span>
            <span className="ml-1 text-green-600 font-medium">
              {formatCompressionRatio(optimizationInfo.compressionRatio)}
            </span>
          </div>
        </div>
      )}

      {/* Error details */}
      {status === 'error' && error && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <div className="text-sm text-red-600">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export interface BatchUploadProgressProps {
  files: Array<{
    id: string;
    name: string;
    size: number;
    status: UploadProgressProps['status'];
    progress?: number;
    error?: string;
    optimizationInfo?: UploadProgressProps['optimizationInfo'];
  }>;
  overallProgress: number;
  className?: string;
}

export const BatchUploadProgress: React.FC<BatchUploadProgressProps> = ({
  files,
  overallProgress,
  className = ''
}) => {
  const completedFiles = files.filter(f => f.status === 'success').length;
  const failedFiles = files.filter(f => f.status === 'error').length;
  const activeFiles = files.filter(f => 
    ['validating', 'optimizing', 'uploading'].includes(f.status)
  ).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Resumen general */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Subiendo imágenes</h3>
          <div className="text-sm text-muted-foreground">
            {completedFiles + failedFiles}/{files.length}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso general</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 mt-3 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">{completedFiles}</div>
            <div className="text-xs text-muted-foreground">Completadas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">{activeFiles}</div>
            <div className="text-xs text-muted-foreground">En progreso</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">{failedFiles}</div>
            <div className="text-xs text-muted-foreground">Fallidas</div>
          </div>
        </div>
      </div>

      {/* Lista de archivos individuales */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {files.map((file) => (
          <UploadProgress
            key={file.id}
            status={file.status}
            progress={file.progress}
            fileName={file.name}
            fileSize={file.size}
            error={file.error}
            optimizationInfo={file.optimizationInfo}
            className="text-sm"
          />
        ))}
      </div>
    </div>
  );
};