
import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import {
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useVehicleImages } from '@/hooks/useVehicleImages';
import { Image, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FastImage from '@/components/shared/FastImage';
import ZoomableImage from '@/components/shared/ZoomableImage';
import StatusOverlay from '@/components/shared/StatusOverlay';
import { toast } from 'sonner';

interface VehicleGalleryProps {
  brandModel: string;
  thumbnailUrl: string;
  vehicleId?: string;
  vehicleStatus?: 'sold' | 'reserved' | 'available';
  vehicleImages?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
  canManage?: boolean;
}

const VehicleGallery: React.FC<VehicleGalleryProps> = memo(({ 
  brandModel, 
  thumbnailUrl, 
  vehicleId, 
  vehicleStatus,
  vehicleImages,
  canManage = false
}) => {
  // Always use hook when canManage is true (need deleteImage), otherwise only as fallback
  const useHookId = canManage ? vehicleId : (vehicleImages && vehicleImages.length > 0 ? undefined : vehicleId);
  const { images: hookImages, isLoading, deleteImage } = useVehicleImages(useHookId);
  
  // Prefer vehicleImages prop over hook data (unless managing, where hook data is fresher)
  const images = canManage && hookImages.length > 0 ? hookImages : (vehicleImages && vehicleImages.length > 0 ? vehicleImages : hookImages);
  
  const [selectedImage, setSelectedImage] = useState(thumbnailUrl);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // ALWAYS ensure we have at least the thumbnail image
  const allImages = useMemo(() => {
    if (images && images.length > 0) {
      return images.map(img => img.image_url);
    }
    // Always return thumbnail or placeholder - NEVER an empty array
    return thumbnailUrl ? [thumbnailUrl] : ['/placeholder.svg'];
  }, [images, thumbnailUrl]);

  // Track loaded images for progressive enhancement
  const handleImageLoad = useCallback(() => {
    setImagesLoaded(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (images && images.length > 0) {
      const primaryImage = images.find(img => img.is_primary);
      const newSelectedImage = primaryImage ? primaryImage.image_url : images[0].image_url;
      setSelectedImage(newSelectedImage);
      setCurrentImageIndex(allImages.findIndex(img => img === newSelectedImage));
    } else {
      // Always set the thumbnail or placeholder as selected image
      const fallbackImage = thumbnailUrl || '/placeholder.svg';
      setSelectedImage(fallbackImage);
      setCurrentImageIndex(0);
    }
    
    // Reset loaded counter when images change
    setImagesLoaded(0);
  }, [images, thumbnailUrl, vehicleId, allImages]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  }, [currentImageIndex, allImages]);

  const goToNext = useCallback(() => {
    const newIndex = currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  }, [currentImageIndex, allImages]);

  const handleThumbnailClick = useCallback((imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
  }, []);

  const handleDeleteImage = useCallback(async (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteImage(imageId);
      toast.success('Imagen eliminada');
    } catch (error) {
      toast.error('Error al eliminar imagen');
    }
  }, [deleteImage]);

  // Show loading only when we don't have images from props and hook is loading
  const shouldShowLoading = isLoading && (!vehicleImages || vehicleImages.length === 0);

  return (
    <div className="space-y-4">
      {/* Main image display - ALWAYS shown */}
      <div className="relative rounded-lg overflow-hidden bg-secondary border border-border">
        <AspectRatio ratio={16/9} className="bg-secondary">
          {shouldShowLoading ? (
            <Skeleton className="w-full h-full bg-secondary" />
          ) : (
            <>
              <ZoomableImage
                src={selectedImage}
                alt={brandModel}
                className="w-full h-full object-cover"
                zoomLevel={3}
                magnifierSize={180}
              />
              
              {/* Status overlay for sold/reserved vehicles */}
              {(vehicleStatus === 'sold' || vehicleStatus === 'reserved') && (
                <StatusOverlay 
                  status={vehicleStatus} 
                  position="top-right" 
                  size="lg" 
                />
              )}
              
              {/* Navigation arrows - ALWAYS show if more than 1 image */}
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border-border text-foreground z-50"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border-border text-foreground z-50"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-sm z-50">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </>
          )}
        </AspectRatio>
      </div>

      {/* Thumbnail carousel - ALWAYS show if more than 1 image available */}
      {!shouldShowLoading && allImages.length > 1 && (
        <div className="relative px-8">
          <Carousel className="w-full">
            <CarouselContent>
              {allImages.map((imageUrl, index) => {
                const imageRecord = images?.find(img => img.image_url === imageUrl);
                return (
                <CarouselItem key={`thumb-${index}`} className="basis-1/4 sm:basis-1/5 md:basis-1/6">
                  <div className="relative group">
                    <button
                      onClick={() => handleThumbnailClick(imageUrl, index)}
                      className={cn(
                        "w-full aspect-square rounded-md overflow-hidden border-2 transition-colors duration-200",
                        selectedImage === imageUrl ? "border-primary opacity-100" : "border-border opacity-70 hover:opacity-100 hover:border-primary/50"
                      )}
                    >
                      <div className="relative w-full h-full">
                        <FastImage
                          src={imageUrl}
                          alt={`${brandModel} - ${index + 1}`}
                          className="w-full h-full object-cover"
                          priority={index < 4}
                          showLoadingState={true}
                        />
                        {imageRecord?.is_primary && (
                          <div className="absolute top-0 left-0 m-1 bg-background/80 text-foreground text-xs px-1 py-0.5 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    </button>
                    {canManage && imageRecord && !imageRecord.id.startsWith('temp-') && (
                      <button
                        onClick={(e) => handleDeleteImage(imageRecord.id, e)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Eliminar imagen"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </CarouselItem>
                );
              })}
            </CarouselContent>
            {/* Show navigation only if we have more than 4 thumbnails */}
            {allImages.length > 4 && (
              <>
                <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2" />
              </>
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
});

VehicleGallery.displayName = 'VehicleGallery';

export default VehicleGallery;
