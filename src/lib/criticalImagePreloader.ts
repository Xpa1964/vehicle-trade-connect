/**
 * Critical Image Auto-Preloader
 * 
 * PLATFORM PRIMITIVE: Automatically preloads all images marked critical: true
 * Zero developer decision required - infrastructure thinks for them.
 * 
 * This runs on app boot and ensures LCP-critical images are loaded ASAP.
 */

import { getCriticalImages, StaticImageEntry } from '@/config/staticImageRegistry';

interface PreloadResult {
  success: string[];
  failed: string[];
  skipped: string[];
}

const isDev = import.meta.env.DEV;

/**
 * Detect connection speed for adaptive preloading
 */
const getConnectionType = (): 'slow' | 'fast' => {
  const connection = (navigator as any).connection;
  if (!connection) return 'fast';
  
  const effectiveType = connection.effectiveType;
  return effectiveType === 'slow-2g' || effectiveType === '2g' ? 'slow' : 'fast';
};

/**
 * Detect if device is mobile
 */
const isMobile = (): boolean => {
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * Preload a single image using link preload (fastest method)
 */
const preloadImage = (entry: StaticImageEntry): Promise<string> => {
  return new Promise((resolve, reject) => {
    const path = entry.currentPath;
    
    // Skip src/assets paths - these are bundled and handled by Vite
    if (path.startsWith('src/assets/')) {
      resolve(path); // Consider bundled assets as pre-handled
      return;
    }

    // Check if already preloaded
    const existingPreload = document.querySelector(`link[rel="preload"][href="${path}"]`);
    if (existingPreload) {
      resolve(path);
      return;
    }

    // Create preload link
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    link.setAttribute('fetchpriority', 'high');
    
    link.onload = () => resolve(path);
    link.onerror = () => reject(new Error(`Failed to preload: ${path}`));
    
    document.head.appendChild(link);
  });
};

/**
 * Initialize critical image preloading
 * Call once in main.tsx - runs automatically on boot
 */
export const initCriticalImagePreload = async (): Promise<PreloadResult> => {
  const result: PreloadResult = {
    success: [],
    failed: [],
    skipped: [],
  };

  const connectionType = getConnectionType();
  const mobile = isMobile();

  // Skip preloading on slow mobile connections to save bandwidth
  if (mobile && connectionType === 'slow') {
    if (isDev) {
      console.log('[CriticalPreloader] Skipped: slow mobile connection detected');
    }
    return result;
  }

  const criticalImages = getCriticalImages();
  
  if (isDev) {
    console.log(`[CriticalPreloader] Preloading ${criticalImages.length} critical images...`);
  }

  // Prioritize: home/hero images first, then layout, then others
  const prioritized = [...criticalImages].sort((a, b) => {
    const priorityOrder = ['home', 'layout', 'services', 'dashboard', 'marketing', 'messaging', 'legal', 'auth'];
    const aIndex = priorityOrder.indexOf(a.category);
    const bIndex = priorityOrder.indexOf(b.category);
    return aIndex - bIndex;
  });

  // Preload in batches to avoid overwhelming the browser
  const batchSize = mobile ? 2 : 4;
  
  for (let i = 0; i < prioritized.length; i += batchSize) {
    const batch = prioritized.slice(i, i + batchSize);
    
    const promises = batch.map(async (entry) => {
      try {
        await preloadImage(entry);
        result.success.push(entry.currentPath);
      } catch (error) {
        result.failed.push(entry.currentPath);
        if (isDev) {
          console.warn(`[CriticalPreloader] Failed: ${entry.currentPath}`);
        }
      }
    });

    await Promise.allSettled(promises);
  }

  if (isDev) {
    console.log(
      `[CriticalPreloader] Complete: ${result.success.length} loaded, ${result.failed.length} failed`
    );
  }

  return result;
};

/**
 * Get preload status for a specific image
 */
export const isImagePreloaded = (path: string): boolean => {
  return !!document.querySelector(`link[rel="preload"][href="${path}"]`);
};

/**
 * Manually preload additional images (for route-based preloading)
 */
export const preloadImages = async (paths: string[]): Promise<PreloadResult> => {
  const result: PreloadResult = { success: [], failed: [], skipped: [] };

  for (const path of paths) {
    if (isImagePreloaded(path)) {
      result.skipped.push(path);
      continue;
    }

    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = path;
      document.head.appendChild(link);
      result.success.push(path);
    } catch {
      result.failed.push(path);
    }
  }

  return result;
};
