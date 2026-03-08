import React, { useCallback, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  FolderOpen,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageUploadZoneProps {
  onImagesSelected: (files: File[]) => void;
  maxImages?: number;
  maxSizePerImage?: number; // en MB
  acceptedFormats?: string[];
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImagesSelected,
  maxImages = 25,
  maxSizePerImage = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Validar formato
    if (!acceptedFormats.includes(file.type)) {
      return {
        valid: false,
        error: `${file.name}: formato no aceptado. Use ${acceptedFormats.join(', ')}`,
      };
    }

    // Validar tamaño
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizePerImage) {
      return {
        valid: false,
        error: `${file.name}: tamaño ${sizeInMB.toFixed(2)}MB excede el máximo de ${maxSizePerImage}MB`,
      };
    }

    return { valid: true };
  }, [acceptedFormats, maxSizePerImage]);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else if (validation.error) {
        errors.push(validation.error);
      }
    }

    // Verificar límite total
    if (selectedFiles.length + validFiles.length > maxImages) {
      toast.error(
        t('vehicles.maxImagesExceeded', {
          fallback: `Solo se pueden subir hasta ${maxImages} imágenes en total`,
        })
      );
      const remaining = maxImages - selectedFiles.length;
      validFiles.splice(remaining);
    }

    // Mostrar errores
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newFiles);
      onImagesSelected(newFiles);

      // Generar previews
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);

      toast.success(
        t('vehicles.imagesAdded', {
          fallback: `${validFiles.length} imagen(es) añadida(s)`,
        })
      );
    }
  }, [selectedFiles, maxImages, t, validateFile, onImagesSelected]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const handleRemoveFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onImagesSelected(newFiles);

    // Liberar URL del preview
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));

    toast.success(t('vehicles.imageRemoved', { fallback: 'Imagen eliminada' }));
  }, [selectedFiles, previewUrls, t, onImagesSelected]);

  const handleClearAll = useCallback(() => {
    setSelectedFiles([]);
    onImagesSelected([]);
    
    // Liberar todas las URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);

    toast.success(t('vehicles.allImagesCleared', { fallback: 'Todas las imágenes eliminadas' }));
  }, [previewUrls, t, onImagesSelected]);

  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {t('vehicles.uploadImages', { fallback: 'Subir Imágenes' })}
        </CardTitle>
        <CardDescription>
          {t('vehicles.dragDropOrSelect', {
            fallback: 'Arrastra y suelta imágenes o selecciona desde tu dispositivo',
          })}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Zona de drag & drop */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
            isDragging
              ? 'border-primary bg-primary/10 scale-105'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={cn('h-12 w-12 mx-auto mb-4', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          <p className="text-lg font-medium mb-2">
            {isDragging
              ? t('vehicles.dropHere', { fallback: '¡Suelta aquí!' })
              : t('vehicles.clickOrDrag', { fallback: 'Haz clic o arrastra imágenes aquí' })}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('vehicles.imageFormats', {
              fallback: `Formatos: JPG, PNG, GIF, WEBP | Máx: ${maxSizePerImage}MB por imagen`,
            })}
          </p>
        </div>

        {/* Inputs ocultos */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={folderInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple
          // @ts-ignore - webkitdirectory no está en tipos oficiales pero es soportado
          webkitdirectory=""
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" />
            {t('vehicles.selectFiles', { fallback: 'Seleccionar Archivos' })}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => folderInputRef.current?.click()}
            className="flex-1"
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            {t('vehicles.selectFolder', { fallback: 'Seleccionar Carpeta' })}
          </Button>
        </div>

        {/* Información de archivos seleccionados */}
        {selectedFiles.length > 0 && (
          <>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm font-medium">
                    {selectedFiles.length} {t('vehicles.imagesSelected', { fallback: 'imagen(es) seleccionada(s)' })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('vehicles.totalSize', { fallback: 'Tamaño total' })}: {totalSizeMB} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
              >
                <X className="mr-2 h-4 w-4" />
                {t('common.clearAll', { fallback: 'Limpiar Todo' })}
              </Button>
            </div>

            {/* Barra de progreso del límite */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('vehicles.imagesLimit', { fallback: 'Límite de imágenes' })}</span>
                <span>{selectedFiles.length} / {maxImages}</span>
              </div>
              <Progress value={(selectedFiles.length / maxImages) * 100} className="h-2" />
            </div>

            {/* Grid de previews */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-60 overflow-y-auto p-2 bg-muted/30 rounded-lg">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded border border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Badge
                    variant="secondary"
                    className="absolute bottom-1 left-1 text-[10px] px-1 py-0"
                  >
                    {index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Advertencia si se acerca al límite */}
        {selectedFiles.length > maxImages * 0.8 && (
          <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-sm text-warning">
              {t('vehicles.approachingLimit', {
                fallback: `Estás cerca del límite de ${maxImages} imágenes`,
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
