
import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FastImageProps {
  src: string | string[];
  alt: string;
  className?: string;
  priority?: boolean;
  showLoadingState?: boolean;
  showCarousel?: boolean;
}

const FastImage: React.FC<FastImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  showLoadingState = false,
  showCarousel = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = Array.isArray(src) ? src : [src];
  const hasMultipleImages = images.length > 1;

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const goToPrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  }, [images.length]);

  const goToNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  }, [images.length]);

  const currentSrc = images[currentImageIndex] || '/placeholder-vehicle.jpg';

  return (
    <div className="relative w-full h-full group">
      {/* Imagen principal */}
      <img
        src={hasError ? '/placeholder-vehicle.jpg' : currentSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-200',
          isLoading && showLoadingState ? 'opacity-0' : 'opacity-100',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Loading state */}
      {isLoading && showLoadingState && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* Controles del carrusel - Solo mostrar si hay múltiples imágenes y está habilitado */}
      {hasMultipleImages && showCarousel && (
        <>
          {/* Botón anterior */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 hover:bg-white/90 backdrop-blur-sm z-30 h-8 w-8"
            onClick={goToPrevious}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Botón siguiente */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 hover:bg-white/90 backdrop-blur-sm z-30 h-8 w-8"
            onClick={goToNext}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Indicadores de posición */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-30">
            {images.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors duration-200',
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FastImage;
