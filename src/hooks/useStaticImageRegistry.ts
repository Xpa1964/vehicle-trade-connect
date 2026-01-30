/**
 * Hook for managing static image registry operations
 * Provides filtering, validation, and version management
 */

import { useState, useMemo, useCallback } from 'react';
import {
  STATIC_IMAGE_REGISTRY,
  StaticImageEntry,
  ImageVersion,
  GlobalStyleConfig,
  getImagesByCategory,
  getCriticalImages,
  getAIEditableImages,
  getImageById,
  getRegistryStats,
  getAllCategories,
  validateRegistry
} from '@/config/staticImageRegistry';

export interface ImageFilters {
  category: StaticImageEntry['category'] | 'all';
  critical: boolean | null;
  aiEditable: boolean | null;
  searchQuery: string;
}

const DEFAULT_FILTERS: ImageFilters = {
  category: 'all',
  critical: null,
  aiEditable: null,
  searchQuery: ''
};

const DEFAULT_GLOBAL_STYLE: GlobalStyleConfig = {
  prompt: 'Dark, cinematic automotive marketplace style, premium lighting, high contrast, modern UI-friendly compositions, professional product photography aesthetic.',
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system'
};

// Local storage keys - UNIFIED with ImageControlCenter
const GLOBAL_STYLE_KEY = 'imageControlCenter_globalStyle';
const IMAGE_VERSIONS_KEY = 'staticImageRegistry_versions';

export const useStaticImageRegistry = () => {
  const [filters, setFilters] = useState<ImageFilters>(DEFAULT_FILTERS);
  const [selectedImage, setSelectedImage] = useState<StaticImageEntry | null>(null);
  
  // Load global style from localStorage
  const [globalStyle, setGlobalStyleState] = useState<GlobalStyleConfig>(() => {
    try {
      const stored = localStorage.getItem(GLOBAL_STYLE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_GLOBAL_STYLE;
    } catch {
      return DEFAULT_GLOBAL_STYLE;
    }
  });
  
  // Load image versions from localStorage
  const [imageVersions, setImageVersionsState] = useState<ImageVersion[]>(() => {
    try {
      const stored = localStorage.getItem(IMAGE_VERSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Get all images as array
  const allImages = useMemo(() => Object.values(STATIC_IMAGE_REGISTRY), []);
  
  // Get filtered images
  const filteredImages = useMemo(() => {
    let result = allImages;
    
    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(img => img.category === filters.category);
    }
    
    // Filter by critical
    if (filters.critical !== null) {
      result = result.filter(img => img.critical === filters.critical);
    }
    
    // Filter by AI editable
    if (filters.aiEditable !== null) {
      result = result.filter(img => img.aiEditable === filters.aiEditable);
    }
    
    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(img => 
        img.id.toLowerCase().includes(query) ||
        img.purpose.toLowerCase().includes(query) ||
        img.usage.toLowerCase().includes(query) ||
        img.currentPath.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [allImages, filters]);

  // Statistics
  const stats = useMemo(() => getRegistryStats(), []);
  
  // Validation
  const validation = useMemo(() => validateRegistry(), []);

  // Categories
  const categories = useMemo(() => getAllCategories(), []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ImageFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Update global style
  const setGlobalStyle = useCallback((prompt: string, updatedBy: string) => {
    const newStyle: GlobalStyleConfig = {
      prompt,
      lastUpdated: new Date().toISOString(),
      updatedBy
    };
    setGlobalStyleState(newStyle);
    localStorage.setItem(GLOBAL_STYLE_KEY, JSON.stringify(newStyle));
  }, []);

  // Add image version
  const addImageVersion = useCallback((
    imageId: string,
    path: string,
    prompt: string,
    createdBy: string
  ): ImageVersion => {
    const version: ImageVersion = {
      id: `${imageId}-${Date.now()}`,
      imageId,
      path,
      prompt,
      globalStylePrompt: globalStyle.prompt,
      createdAt: new Date().toISOString(),
      createdBy,
      isActive: false
    };
    
    const newVersions = [...imageVersions, version];
    setImageVersionsState(newVersions);
    localStorage.setItem(IMAGE_VERSIONS_KEY, JSON.stringify(newVersions));
    
    return version;
  }, [imageVersions, globalStyle.prompt]);

  // Get versions for an image
  const getVersionsForImage = useCallback((imageId: string): ImageVersion[] => {
    return imageVersions.filter(v => v.imageId === imageId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [imageVersions]);

  // Activate a version
  const activateVersion = useCallback((versionId: string) => {
    const version = imageVersions.find(v => v.id === versionId);
    if (!version) return null;
    
    // Deactivate all versions for this image, activate the selected one
    const newVersions = imageVersions.map(v => ({
      ...v,
      isActive: v.imageId === version.imageId ? v.id === versionId : v.isActive
    }));
    
    setImageVersionsState(newVersions);
    localStorage.setItem(IMAGE_VERSIONS_KEY, JSON.stringify(newVersions));
    
    return version;
  }, [imageVersions]);

  // Compose final prompt (global + local)
  const composeFinalPrompt = useCallback((localPrompt: string): string => {
    return `${globalStyle.prompt}\n\n${localPrompt}`;
  }, [globalStyle.prompt]);

  return {
    // Data
    allImages,
    filteredImages,
    selectedImage,
    stats,
    validation,
    categories,
    globalStyle,
    imageVersions,
    
    // Filters
    filters,
    updateFilters,
    resetFilters,
    
    // Selection
    setSelectedImage,
    
    // Global style
    setGlobalStyle,
    
    // Versions
    addImageVersion,
    getVersionsForImage,
    activateVersion,
    
    // Utilities
    composeFinalPrompt,
    getImageById,
    getImagesByCategory,
    getCriticalImages,
    getAIEditableImages
  };
};
