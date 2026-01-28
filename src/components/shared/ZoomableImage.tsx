import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  zoomLevel?: number;
  magnifierSize?: number;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  className,
  zoomLevel = 2.5,
  magnifierSize = 150
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;

    const element = imageRef.current;
    const { top, left, width, height } = element.getBoundingClientRect();
    
    // Posición del mouse relativa a la imagen
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Posición del magnifier
    setMagnifierPosition({ x, y });
    
    // Calcular la posición del background correctamente
    // El background debe mostrarse ampliado por el zoomLevel
    const backgroundX = -((x * zoomLevel) - (magnifierSize / 2));
    const backgroundY = -((y * zoomLevel) - (magnifierSize / 2));
    setBackgroundPosition({ x: backgroundX, y: backgroundY });
  }, [zoomLevel, magnifierSize]);

  const handleMouseEnter = useCallback(() => {
    setShowMagnifier(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowMagnifier(false);
  }, []);

  return (
    <div className="relative inline-block">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={cn('w-full h-full object-cover cursor-crosshair', className)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {showMagnifier && (
        <div
          className="absolute pointer-events-none border-2 border-white shadow-lg rounded-full z-50"
          style={{
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            left: `${magnifierPosition.x - magnifierSize / 2}px`,
            top: `${magnifierPosition.y - magnifierSize / 2}px`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imageRef.current ? imageRef.current.offsetWidth * zoomLevel : zoomLevel * 100}px ${imageRef.current ? imageRef.current.offsetHeight * zoomLevel : zoomLevel * 100}px`,
            backgroundPosition: `${backgroundPosition.x}px ${backgroundPosition.y}px`,
          }}
        />
      )}
    </div>
  );
};

export default ZoomableImage;