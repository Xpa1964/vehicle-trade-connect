import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // Para imágenes LCP
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  style?: React.CSSProperties;
  fallbackSources?: string[]; // Array de fuentes de respaldo
  loading?: 'lazy' | 'eager'; // Compatibilidad con API antigua
}

/**
 * Componente de imagen optimizada con soporte WebP y lazy loading
 * - Convierte automáticamente PNG/JPG a WebP cuando está disponible
 * - Implementa lazy loading para imágenes no críticas
 * - Preload para imágenes LCP (priority=true)
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  objectFit = 'cover',
  objectPosition,
  style,
  fallbackSources = [],
  loading
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(0);
  const [isWebPSupported, setIsWebPSupported] = useState<boolean | null>(null);
  
  // Override priority con loading prop si se proporciona
  const effectivePriority = loading === 'eager' ? true : (loading === 'lazy' ? false : priority);

  // Detectar soporte WebP
  useEffect(() => {
    const checkWebPSupport = () => {
      const elem = document.createElement('canvas');
      if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    };

    setIsWebPSupported(checkWebPSupport());
  }, []);

  // Convertir extensión a WebP si está soportado
  useEffect(() => {
    if (isWebPSupported && (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg'))) {
      const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      setImageSrc(webpSrc);
    } else {
      setImageSrc(src);
    }
  }, [src, isWebPSupported]);

  // Manejar error de carga con fallbacks
  const handleImageError = () => {
    if (fallbackSources && fallbackSources.length > currentFallbackIndex) {
      setImageSrc(fallbackSources[currentFallbackIndex]);
      setCurrentFallbackIndex(currentFallbackIndex + 1);
    } else {
      // Si no hay más fallbacks, usar src original
      setImageSrc(src);
    }
  };

  const imgStyle: React.CSSProperties = {
    objectFit,
    objectPosition,
    ...style
  };

  return (
    <picture>
      {/* WebP source si está soportado */}
      {isWebPSupported && (
        <source
          srcSet={imageSrc}
          type="image/webp"
        />
      )}
      
      {/* Fallback original */}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={effectivePriority ? 'eager' : 'lazy'}
        decoding={effectivePriority ? 'sync' : 'async'}
        fetchPriority={effectivePriority ? 'high' : 'auto'}
        style={imgStyle}
        onError={handleImageError}
      />
    </picture>
  );
};

export default OptimizedImage;
