/**
 * RegistryImage Component
 * 
 * Renders an image from the STATIC_IMAGE_REGISTRY with automatic fallback.
 * Use this component instead of hardcoded image paths.
 * 
 * ⚠️ PRODUCT IMAGES ONLY - Never use for user-generated content
 */

import React, { useState } from 'react';
import { useStaticImage } from '@/hooks/useStaticImage';

interface RegistryImageProps {
  /** The image ID from the registry (e.g., 'home.hero') */
  imageId: string;
  /** Alt text for accessibility */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Loading strategy */
  loading?: 'eager' | 'lazy';
  /** Width for layout hints */
  width?: number;
  /** Height for layout hints */
  height?: number;
  /** Custom fallback if registry fallback fails */
  customFallback?: string;
  /** Callback when image loads successfully */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: (error: React.SyntheticEvent<HTMLImageElement>) => void;
}

const RegistryImage: React.FC<RegistryImageProps> = ({
  imageId,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
  customFallback,
  onLoad,
  onError
}) => {
  const { src, fallback, isValid, entry } = useStaticImage(imageId);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!hasError) {
      setHasError(true);
      // Try fallback from registry
      if (fallback && currentSrc !== fallback) {
        setCurrentSrc(fallback);
      } else if (customFallback && currentSrc !== customFallback) {
        setCurrentSrc(customFallback);
      } else {
        setCurrentSrc('/placeholder.svg');
      }
    }
    onError?.(e);
  };

  const handleLoad = () => {
    onLoad?.();
  };

  if (!isValid) {
    console.warn(`[RegistryImage] Image "${imageId}" not found in registry`);
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      width={width}
      height={height}
      onError={handleError}
      onLoad={handleLoad}
      data-registry-id={imageId}
      data-registry-valid={isValid}
    />
  );
};

export default RegistryImage;
