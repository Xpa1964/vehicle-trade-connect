/**
 * SafeImage Component (Production-Grade)
 * 
 * Ultra-reliable image component that NEVER shows broken image icons.
 * Features:
 * - Automatic retry on failure
 * - Registry fallback support
 * - Silent in production (no console spam)
 * - LCP preload support for critical images
 * 
 * ⚠️ PRODUCT IMAGES ONLY - Never use for user-generated content
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useStaticImage, UseStaticImageResult } from '@/hooks/useStaticImage';

const isDev = import.meta.env.DEV;

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'onLoad'> {
  /** The image ID from the static registry (e.g., 'home.hero') */
  imageId?: string;
  /** Direct src - only use if not using imageId */
  src?: string;
  /** Alt text for accessibility */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom fallback URL */
  customFallback?: string;
  /** Whether to preload for LCP optimization */
  preload?: boolean;
  /** Loading priority */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Callback when image successfully loads */
  onImageLoad?: () => void;
  /** Callback when all fallbacks exhausted */
  onAllFailed?: () => void;
}

const GLOBAL_FALLBACK = '/placeholder.svg';
const MAX_RETRIES = 1;

const SafeImage: React.FC<SafeImageProps> = ({
  imageId,
  src: directSrc,
  alt,
  className,
  customFallback,
  preload = false,
  fetchPriority,
  onImageLoad,
  onAllFailed,
  loading,
  ...props
}) => {
  // Get registry data if using imageId
  const registryData: UseStaticImageResult | null = imageId 
    ? useStaticImage(imageId) 
    : null;

  // Determine the source chain
  const primarySrc = registryData?.src || directSrc || '';
  const registryFallback = registryData?.fallback;
  
  // Build fallback chain
  const fallbackChain = [
    registryFallback,
    customFallback,
    GLOBAL_FALLBACK
  ].filter((f): f is string => Boolean(f) && f !== primarySrc);

  // State
  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  const [retryCount, setRetryCount] = useState(0);
  const [fallbackIndex, setFallbackIndex] = useState(-1);
  const [isLoaded, setIsLoaded] = useState(false);
  const mountedRef = useRef(true);

  // Reset on primarySrc change
  useEffect(() => {
    setCurrentSrc(primarySrc);
    setRetryCount(0);
    setFallbackIndex(-1);
    setIsLoaded(false);
  }, [primarySrc]);

  // Cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Preload critical images
  useEffect(() => {
    if (!preload || !primarySrc) return;

    const existingPreload = document.querySelector(
      `link[rel="preload"][href="${primarySrc}"]`
    );

    if (!existingPreload) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = primarySrc;
      if (fetchPriority === 'high') {
        link.setAttribute('fetchpriority', 'high');
      }
      document.head.appendChild(link);
    }
  }, [preload, primarySrc, fetchPriority]);

  const handleError = useCallback(() => {
    if (!mountedRef.current) return;

    // Log only in dev
    if (isDev && retryCount === 0 && fallbackIndex === -1) {
      console.warn(`[SafeImage] Primary load failed: ${currentSrc}`);
    }

    // Retry once first
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      // Force reload by adding cache-bust
      const separator = currentSrc.includes('?') ? '&' : '?';
      setCurrentSrc(`${primarySrc}${separator}_retry=${Date.now()}`);
      return;
    }

    // Try next fallback
    const nextFallbackIndex = fallbackIndex + 1;
    if (nextFallbackIndex < fallbackChain.length) {
      setFallbackIndex(nextFallbackIndex);
      setCurrentSrc(fallbackChain[nextFallbackIndex]);
      setRetryCount(0);
      
      if (isDev) {
        console.log(`[SafeImage] Trying fallback ${nextFallbackIndex + 1}/${fallbackChain.length}: ${fallbackChain[nextFallbackIndex]}`);
      }
    } else {
      // All fallbacks exhausted - set to global fallback silently
      if (currentSrc !== GLOBAL_FALLBACK) {
        setCurrentSrc(GLOBAL_FALLBACK);
      }
      onAllFailed?.();
      
      if (isDev) {
        console.error(`[SafeImage] All fallbacks exhausted for imageId: ${imageId || 'direct-src'}`);
      }
    }
  }, [currentSrc, retryCount, fallbackIndex, fallbackChain, primarySrc, imageId, onAllFailed]);

  const handleLoad = useCallback(() => {
    if (!mountedRef.current) return;
    setIsLoaded(true);
    onImageLoad?.();
  }, [onImageLoad]);

  // Determine if this is a critical image that needs eager loading
  const isCritical = registryData?.isCritical || preload;
  const effectiveLoading = loading || (isCritical ? 'eager' : 'lazy');
  const effectiveFetchPriority = fetchPriority || (isCritical ? 'high' : 'auto');

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-200',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      loading={effectiveLoading}
      fetchPriority={effectiveFetchPriority}
      onError={handleError}
      onLoad={handleLoad}
      data-registry-id={imageId}
      data-loaded={isLoaded}
      {...props}
    />
  );
};

export default SafeImage;
