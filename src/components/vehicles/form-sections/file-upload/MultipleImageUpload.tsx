
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Images } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface MultipleImageUploadProps {
  onImagesUpload: (files: File[]) => void;
  maxImages?: number;
  currentImageCount?: number;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({ 
  onImagesUpload,
  maxImages = 25,
  currentImageCount = 0
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Check total image limit
    if (currentImageCount + files.length > maxImages) {
      toast.error(t('vehicles.maxImagesExceeded', { 
        max: maxImages, 
        fallback: `Máximo ${maxImages} imágenes permitidas` 
      }));
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast.error(t('vehicles.invalidFileType', { 
        fallback: 'Solo se permiten archivos de imagen' 
      }));
      return;
    }

    // Check file sizes (max 10MB per image)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(t('vehicles.fileSizeExceeded', { 
        fallback: 'Cada imagen debe ser menor a 10MB' 
      }));
      return;
    }

    onImagesUpload(files);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      const event = {
        target: { files }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const remainingSlots = Math.max(0, maxImages - currentImageCount);

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <Images className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-foreground mb-2">
          {t('vehicles.dragDropImages', { fallback: 'Arrastra y suelta imágenes aquí' })}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {t('vehicles.orClickToSelect', { fallback: 'o haz clic para seleccionar archivos' })}
        </p>
        <Button type="button" variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          {t('vehicles.selectImages', { fallback: 'Seleccionar Imágenes' })}
        </Button>
        
        {remainingSlots < maxImages && (
          <p className="text-xs text-muted-foreground mt-2">
            {t('vehicles.remainingSlots', { 
              count: remainingSlots, 
              fallback: `${remainingSlots} imágenes restantes` 
            })}
          </p>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Upload tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• {t('vehicles.uploadTip1', { fallback: 'Formatos permitidos: JPG, PNG, WebP' })}</p>
        <p>• {t('vehicles.uploadTip2', { fallback: 'Tamaño máximo por imagen: 10MB' })}</p>
        <p>• {t('vehicles.uploadTip3', { fallback: 'Máximo 25 imágenes por vehículo' })}</p>
        <p>• {t('vehicles.uploadTip4', { fallback: 'La primera imagen será la principal' })}</p>
      </div>
    </div>
  );
};
