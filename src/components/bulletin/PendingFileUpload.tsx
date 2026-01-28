import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, Clock } from 'lucide-react';

interface PendingFile {
  file: File;
  id: string;
}

interface PendingFileUploadProps {
  onFilesChange?: (files: File[]) => void;
  acceptedTypes?: string;
  maxFiles?: number;
  className?: string;
}

const PendingFileUpload: React.FC<PendingFileUploadProps> = ({
  onFilesChange,
  acceptedTypes = '.xlsx,.xls,.docx,.doc,.pdf,.jpg,.jpeg,.png,.gif,.webp',
  maxFiles = 5,
  className = ''
}) => {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (pendingFiles.length + filesArray.length > maxFiles) {
      alert(`Solo puedes seleccionar un máximo de ${maxFiles} archivos`);
      return;
    }

    const newPendingFiles = filesArray.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9)
    }));

    const updatedFiles = [...pendingFiles, ...newPendingFiles];
    setPendingFiles(updatedFiles);
    
    // Notify parent component
    onFilesChange?.(updatedFiles.map(pf => pf.file));
  };

  const removeFile = (id: string) => {
    const updatedFiles = pendingFiles.filter(pf => pf.id !== id);
    setPendingFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map(pf => pf.file));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              Selecciona archivos para adjuntar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Los archivos se subirán después de crear el anuncio
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Formatos: Excel, Word, PDF, Imágenes (máx. 10MB cada uno)
            </p>
            
            <input
              type="file"
              multiple
              accept={acceptedTypes}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="pending-file-upload"
              disabled={pendingFiles.length >= maxFiles}
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('pending-file-upload')?.click()}
              disabled={pendingFiles.length >= maxFiles}
            >
              Seleccionar Archivos
            </Button>
          </div>
        </CardContent>
      </Card>

      {pendingFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-500" />
              Archivos pendientes de subir ({pendingFiles.length}/{maxFiles})
            </h4>
            <div className="space-y-2">
              {pendingFiles.map((pendingFile) => (
                <div key={pendingFile.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{pendingFile.file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(pendingFile.file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-orange-600">Pendiente</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(pendingFile.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PendingFileUpload;