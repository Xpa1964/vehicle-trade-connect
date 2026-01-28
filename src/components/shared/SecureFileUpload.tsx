
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { useAnnouncementFileUpload } from '@/hooks/useAnnouncementFileUpload';

interface SecureFileUploadProps {
  bucket: 'vehicle-documents' | 'announcement_attachments';
  folder?: string;
  onUploadComplete?: (path: string, fullPath: string) => void;
  acceptedTypes?: string;
  maxFiles?: number;
  className?: string;
}

interface UploadedFile {
  name: string;
  path: string;
  fullPath: string;
  size: number;
}

const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  bucket,
  folder,
  onUploadComplete,
  acceptedTypes = '.xlsx,.xls,.docx,.doc,.pdf,.jpg,.jpeg,.png',
  maxFiles = 5,
  className = ''
}) => {
  const { uploading, uploadFile } = useAnnouncementFileUpload();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (uploadedFiles.length + filesArray.length > maxFiles) {
      alert(`Solo puedes subir un máximo de ${maxFiles} archivos`);
      return;
    }

    for (const file of filesArray) {
        const result = await uploadFile(file, folder || 'general');
        
        if (result.success && result.attachment) {
          const newFile: UploadedFile = {
            name: file.name,
            path: result.attachment.storage_path,
            fullPath: result.attachment.storage_path,
            size: file.size
          };
          
          setUploadedFiles(prev => [...prev, newFile]);
          onUploadComplete?.(result.attachment.storage_path, result.attachment.storage_path);
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
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
        } ${uploading ? 'opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Formatos admitidos: Excel (.xlsx, .xls), Word (.docx, .doc), PDF (.pdf), Imágenes (.jpg, .png)
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Tamaño máximo: 20MB para documentos, 10MB para imágenes
            </p>
            
            <input
              type="file"
              multiple
              accept={acceptedTypes}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
              disabled={uploading || uploadedFiles.length >= maxFiles}
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={uploading || uploadedFiles.length >= maxFiles}
            >
              {uploading ? 'Subiendo...' : 'Seleccionar Archivos'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Archivos subidos ({uploadedFiles.length}/{maxFiles})</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
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

export default SecureFileUpload;
