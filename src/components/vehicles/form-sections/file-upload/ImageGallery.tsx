
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImagePreview {
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface ImageGalleryProps {
  images: ImagePreview[];
  onRemoveImage: (index: number) => void;
  onSetPrimary: (index: number) => void;
}

export const ImageGallery = ({ 
  images, 
  onRemoveImage, 
  onSetPrimary 
}: ImageGalleryProps) => {
  const { t } = useLanguage();

  if (images.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm font-medium">
        {t('vehicles.selectedImages', { count: images.length })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((image, index) => (
          <div key={index} className="relative border rounded-md overflow-hidden group">
            <div className="aspect-square">
              <img 
                src={image.preview} 
                alt={`Vehicle image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-0 right-0 m-1">
              <Button 
                type="button"
                variant="destructive"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemoveImage(index)}
              >
                <X size={14} />
              </Button>
            </div>
            <div className="absolute left-0 bottom-0 right-0 bg-black bg-opacity-60 p-1">
              <div className="flex items-center justify-between">
                <span className="text-white text-xs">{index + 1}</span>
                {image.isPrimary ? (
                  <Badge variant="primary" className="text-xs py-0 px-1">
                    {t('vehicles.primary', {})}
                  </Badge>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1 py-0 text-xs text-white hover:text-white hover:bg-black hover:bg-opacity-50"
                    onClick={() => onSetPrimary(index)}
                  >
                    {t('vehicles.setPrimary', {})}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
