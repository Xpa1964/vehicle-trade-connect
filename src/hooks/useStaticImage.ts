/**
 * useStaticImage Hook
 * 
 * Retrieves product/UI images from the STATIC_IMAGE_REGISTRY.
 * Provides automatic fallback and path validation.
 * 
 * ⚠️ PRODUCT IMAGES ONLY - Never use for user-generated content
 * 
 * @example
 * const { src, isValid, entry } = useStaticImage('home.hero');
 * <img src={src} alt={entry?.purpose} />
 */

import { useMemo } from 'react';
import {
  STATIC_IMAGE_REGISTRY,
  StaticImageEntry,
  getImageById,
  isProductImagePath,
  validateRegistry
} from '@/config/staticImageRegistry';

const FALLBACK_IMAGE = '/placeholder.svg';

export interface UseStaticImageResult {
  /** The resolved image path (currentPath or fallback) */
  src: string;
  /** Whether the image entry exists in the registry */
  isValid: boolean;
  /** Whether the path passed validation (is product image) */
  isProductPath: boolean;
  /** The full registry entry (null if not found) */
  entry: StaticImageEntry | null;
  /** Fallback path if main image fails */
  fallback: string;
  /** Whether this image is marked as critical */
  isCritical: boolean;
  /** Whether this image can be AI-edited */
  isAIEditable: boolean;
}

/**
 * Hook to retrieve a static image from the registry
 * @param imageId The image ID (e.g., 'home.hero', 'services.showroom')
 * @returns Image data with src, validation status, and metadata
 */
export const useStaticImage = (imageId: string): UseStaticImageResult => {
  return useMemo(() => {
    const entry = getImageById(imageId);
    
    if (!entry) {
      console.warn(`[useStaticImage] Image not found in registry: ${imageId}`);
      return {
        src: FALLBACK_IMAGE,
        isValid: false,
        isProductPath: false,
        entry: null,
        fallback: FALLBACK_IMAGE,
        isCritical: false,
        isAIEditable: false
      };
    }
    
    // Validate that this is a product image path
    const isProductPath = isProductImagePath(entry.currentPath);
    
    if (!isProductPath) {
      console.error(`[useStaticImage] WARNING: Image "${imageId}" has user-content path: ${entry.currentPath}`);
    }
    
    // Resolve the correct src path
    // Handle src/assets paths vs public paths
    let resolvedSrc = entry.currentPath;
    if (entry.currentPath.startsWith('src/assets/')) {
      // For ES6 imports, we need to handle differently
      // These should be imported directly, not via URL
      // Return the path as-is for now, components can handle import
      resolvedSrc = `/${entry.currentPath}`;
    }
    
    const fallback = entry.fallback || FALLBACK_IMAGE;
    
    return {
      src: resolvedSrc,
      isValid: true,
      isProductPath,
      entry,
      fallback,
      isCritical: entry.critical,
      isAIEditable: entry.aiEditable
    };
  }, [imageId]);
};

/**
 * Get static image by registry key (not ID)
 * @param registryKey The key in STATIC_IMAGE_REGISTRY (e.g., 'HOME_HERO')
 */
export const useStaticImageByKey = (registryKey: string): UseStaticImageResult => {
  return useMemo(() => {
    const entry = STATIC_IMAGE_REGISTRY[registryKey];
    
    if (!entry) {
      console.warn(`[useStaticImageByKey] Key not found: ${registryKey}`);
      return {
        src: FALLBACK_IMAGE,
        isValid: false,
        isProductPath: false,
        entry: null,
        fallback: FALLBACK_IMAGE,
        isCritical: false,
        isAIEditable: false
      };
    }
    
    // Use the same logic as useStaticImage
    const isProductPath = isProductImagePath(entry.currentPath);
    
    let resolvedSrc = entry.currentPath;
    if (entry.currentPath.startsWith('src/assets/')) {
      resolvedSrc = `/${entry.currentPath}`;
    }
    
    const fallback = entry.fallback || FALLBACK_IMAGE;
    
    return {
      src: resolvedSrc,
      isValid: true,
      isProductPath,
      entry,
      fallback,
      isCritical: entry.critical,
      isAIEditable: entry.aiEditable
    };
  }, [registryKey]);
};

/**
 * Get multiple static images at once
 * @param imageIds Array of image IDs
 */
export const useStaticImages = (imageIds: string[]): Record<string, UseStaticImageResult> => {
  return useMemo(() => {
    const results: Record<string, UseStaticImageResult> = {};
    
    for (const imageId of imageIds) {
      const entry = getImageById(imageId);
      
      if (!entry) {
        results[imageId] = {
          src: FALLBACK_IMAGE,
          isValid: false,
          isProductPath: false,
          entry: null,
          fallback: FALLBACK_IMAGE,
          isCritical: false,
          isAIEditable: false
        };
        continue;
      }
      
      const isProductPath = isProductImagePath(entry.currentPath);
      let resolvedSrc = entry.currentPath;
      if (entry.currentPath.startsWith('src/assets/')) {
        resolvedSrc = `/${entry.currentPath}`;
      }
      
      const fallback = entry.fallback || FALLBACK_IMAGE;
      
      results[imageId] = {
        src: resolvedSrc,
        isValid: true,
        isProductPath,
        entry,
        fallback,
        isCritical: entry.critical,
        isAIEditable: entry.aiEditable
      };
    }
    
    return results;
  }, [imageIds.join(',')]);
};

/**
 * Helper to get image path directly (non-hook version for data files)
 * @param imageId The image ID
 * @returns The resolved image path
 */
export const getStaticImagePath = (imageId: string): string => {
  const entry = getImageById(imageId);
  
  if (!entry) {
    console.warn(`[getStaticImagePath] Image not found: ${imageId}`);
    return FALLBACK_IMAGE;
  }
  
  if (!isProductImagePath(entry.currentPath)) {
    console.error(`[getStaticImagePath] User-content path detected: ${imageId}`);
  }
  
  return entry.currentPath;
};

/**
 * Get static image entry with full metadata (non-hook version)
 */
export const getStaticImageEntry = (imageId: string): StaticImageEntry | null => {
  return getImageById(imageId) || null;
};

export default useStaticImage;
