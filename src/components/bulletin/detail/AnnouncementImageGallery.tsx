import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnnouncementImage {
  id: string;
  file_name: string;
  storage_path: string;
}

interface AnnouncementImageGalleryProps {
  images: AnnouncementImage[];
}

const AnnouncementImageGallery: React.FC<AnnouncementImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const getImageUrl = (image: AnnouncementImage) => {
    return supabase.storage.from('announcement_attachments').getPublicUrl(image.storage_path).data.publicUrl;
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
    }
  };

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative group">
        <img
          src={getImageUrl(images[0])}
          alt={`Imagen del anuncio - ${images[0].file_name}`}
          className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => openLightbox(0)}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => openLightbox(0)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Dialog open={selectedImage === 0} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-4xl p-0">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-50 bg-black/50 text-white hover:bg-black/70"
              onClick={closeLightbox}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={getImageUrl(images[0])}
              alt={`Vista ampliada - ${images[0].file_name}`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative group">
        <img
          src={getImageUrl(images[0])}
          alt={`Imagen principal del anuncio - ${images[0].file_name}`}
          className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => openLightbox(0)}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => openLightbox(0)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            1 / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {images.slice(1).map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={getImageUrl(image)}
                alt={`Miniatura ${index + 2} del anuncio - ${image.file_name}`}
                className="w-full h-16 md:h-20 object-cover rounded cursor-pointer transition-transform hover:scale-105"
                onClick={() => openLightbox(index + 1)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center">
                <ZoomIn className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-6xl p-0">
          {selectedImage !== null && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-50 bg-black/50 text-white hover:bg-black/70"
                onClick={closeLightbox}
              >
                <X className="h-4 w-4" />
              </Button>
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              <img
                src={getImageUrl(images[selectedImage])}
                alt={`Vista ampliada imagen ${selectedImage + 1} - ${images[selectedImage].file_name}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementImageGallery;