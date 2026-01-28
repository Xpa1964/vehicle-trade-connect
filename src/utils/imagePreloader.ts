
/**
 * Enhanced image preloader for mobile optimization
 * Prioritizes critical images and implements smart preloading
 */

import { CRITICAL_IMAGES } from '@/constants/imageAssets';

interface PreloadConfig {
  priority: 'high' | 'low';
  isMobile: boolean;
  connectionSpeed: 'slow' | 'fast';
}

/**
 * Detect connection speed based on navigator.connection
 */
const getConnectionSpeed = (): 'slow' | 'fast' => {
  const connection = (navigator as any).connection;
  if (!connection) return 'fast';
  
  const effectiveType = connection.effectiveType;
  return effectiveType === 'slow-2g' || effectiveType === '2g' ? 'slow' : 'fast';
};

/**
 * Detect if device is mobile
 */
const isMobileDevice = (): boolean => {
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Advanced image preloader with connection awareness
 */
const preloadImageAdvanced = (src: string, priority: 'high' | 'low' = 'low'): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Use link preload for high priority images (faster than Image constructor)
    if (priority === 'high') {
      const existingPreload = document.querySelector(`link[rel="preload"][href="${src}"]`);
      if (!existingPreload) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to preload: ${src}`));
        document.head.appendChild(link);
      } else {
        resolve();
      }
    } else {
      // Use Image constructor for low priority
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    }
  });
};

/**
 * Preload critical images with mobile optimization
 */
export const preloadCriticalImages = (): void => {
  const config: PreloadConfig = {
    priority: 'high',
    isMobile: isMobileDevice(),
    connectionSpeed: getConnectionSpeed()
  };

  console.log('🚀 [Preloader] Starting critical image preload:', config);

  // Skip preloading on slow mobile connections to save bandwidth
  if (config.isMobile && config.connectionSpeed === 'slow') {
    console.log('⚠️ [Preloader] Skipping preload on slow mobile connection');
    return;
  }

  // Preload critical images
  CRITICAL_IMAGES.forEach(src => {
    preloadImageAdvanced(src, 'high').catch(error => {
      console.warn(`[Preloader] Failed to preload critical image: ${src}`, error);
    });
  });
};

/**
 * Preload vehicle thumbnails intelligently
 */
export const preloadVehicleThumbnails = async (thumbnails: string[], maxConcurrent: number = 3): Promise<void> => {
  const config: PreloadConfig = {
    priority: 'low',
    isMobile: isMobileDevice(),
    connectionSpeed: getConnectionSpeed()
  };

  // Limit concurrent downloads on mobile
  const concurrent = config.isMobile ? Math.min(maxConcurrent, 2) : maxConcurrent;
  
  console.log(`🔄 [Preloader] Preloading ${thumbnails.length} thumbnails with ${concurrent} concurrent downloads`);

  // Process in batches
  for (let i = 0; i < thumbnails.length; i += concurrent) {
    const batch = thumbnails.slice(i, i + concurrent);
    const promises = batch.map(src => 
      preloadImageAdvanced(src, 'low').catch(error => {
        console.warn(`[Preloader] Failed to preload thumbnail: ${src}`, error);
      })
    );
    
    await Promise.allSettled(promises);
    
    // Small delay between batches on slow connections
    if (config.connectionSpeed === 'slow') {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};

/**
 * Legacy function kept for compatibility
 */
export const preloadLogo = async (): Promise<void> => {
  try {
    await preloadImageAdvanced('/lovable-uploads/a645acd2-f5c2-4f99-be3b-9d089c634c3c.png', 'high');
  } catch (error) {
    console.warn('[Preloader] Failed to preload logo:', error);
  }
};

/**
 * Preload images in viewport using Intersection Observer
 */
export const setupIntersectionPreloader = (): void => {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src && !img.src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px 0px', // Start loading 50px before entering viewport
      threshold: 0.1
    }
  );

  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
  });
};
