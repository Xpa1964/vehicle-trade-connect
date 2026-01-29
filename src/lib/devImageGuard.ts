/**
 * Development Runtime Guard for Unregistered Images
 * 
 * PLATFORM ENFORCEMENT: Detects images that bypass the registry at runtime.
 * Logs a single grouped warning - no console spam.
 * 
 * ⚠️ DEVELOPMENT ONLY - Silent in production.
 * 
 * Usage: Call initDevImageGuard() once in main.tsx
 */

import { STATIC_IMAGE_REGISTRY } from '@/config/staticImageRegistry';

const isDev = import.meta.env.DEV;

// Paths that are allowed without registry (user content, external, etc.)
const ALLOWED_PATTERNS = [
  /^data:/, // Data URLs
  /^blob:/, // Blob URLs
  /^https?:\/\//, // External URLs
  /placeholder\.svg$/, // Global fallback
  /^\/placeholder/, // Placeholder variants
];

// Path patterns that indicate user-generated content (allowed to bypass)
const USER_CONTENT_PATTERNS = [
  /\/vehicles?\//i,
  /\/auctions?\//i,
  /\/uploads?\//i,
  /\/user-content\//i,
  /\/attachments?\//i,
  /\/avatars?\//i,
  /\/documents?\//i,
  /supabase.*storage/i,
  /storage\.googleapis/i,
];

// Get all registered paths for validation
const getRegisteredPaths = (): Set<string> => {
  const paths = new Set<string>();
  Object.values(STATIC_IMAGE_REGISTRY).forEach(entry => {
    paths.add(entry.currentPath);
    if (entry.fallback) {
      paths.add(entry.fallback);
    }
  });
  return paths;
};

// Check if a path is registered or allowed
const isPathAllowed = (src: string, registeredPaths: Set<string>): boolean => {
  // Empty or undefined
  if (!src) return true;
  
  // Allowed patterns (data URLs, external, etc.)
  if (ALLOWED_PATTERNS.some(p => p.test(src))) return true;
  
  // User content patterns (allowed to bypass)
  if (USER_CONTENT_PATTERNS.some(p => p.test(src))) return true;
  
  // Registered in the registry
  if (registeredPaths.has(src)) return true;
  
  // Handle src/assets paths that become /src/assets after resolution
  const normalizedSrc = src.replace(/^\//, '');
  if (registeredPaths.has(normalizedSrc) || registeredPaths.has(`/${normalizedSrc}`)) {
    return true;
  }
  
  return false;
};

// Track detected violations to avoid duplicates
const detectedViolations = new Set<string>();

// Detect unregistered images in the DOM
const detectUnregisteredImages = (registeredPaths: Set<string>): void => {
  const images = document.querySelectorAll('img');
  const newViolations: string[] = [];

  images.forEach(img => {
    const src = img.src || img.getAttribute('src') || '';
    
    // Skip if already detected
    if (detectedViolations.has(src)) return;
    
    // Skip if has registry data attribute (means it came from SafeImage/RegistryImage)
    if (img.hasAttribute('data-registry-id')) return;
    
    // Check if path is allowed
    if (!isPathAllowed(src, registeredPaths)) {
      detectedViolations.add(src);
      newViolations.push(src);
    }
  });

  // Log grouped warning if new violations found
  if (newViolations.length > 0) {
    console.groupCollapsed(
      `%c⚠️ [StaticImagePlatform] ${newViolations.length} unregistered image(s) detected`,
      'color: #f59e0b; font-weight: bold;'
    );
    console.warn('Images rendered without going through the Static Image Registry:');
    newViolations.forEach((src, i) => {
      console.warn(`  ${i + 1}. ${src}`);
    });
    console.warn('\n📚 How to fix:');
    console.warn('  1. Add image to src/config/staticImageRegistry.ts');
    console.warn('  2. Use <SafeImage imageId="your.image.id" /> or useStaticImage() hook');
    console.warn('  3. See /docs/STATIC_IMAGE_PLATFORM.md for details');
    console.groupEnd();
  }
};

// Mutation observer to detect dynamically added images
let observer: MutationObserver | null = null;

/**
 * Initialize the development image guard
 * Call once in main.tsx
 */
export const initDevImageGuard = (): void => {
  if (!isDev) return;
  
  const registeredPaths = getRegisteredPaths();
  
  // Initial check after DOM is ready
  const runInitialCheck = () => {
    setTimeout(() => detectUnregisteredImages(registeredPaths), 2000);
  };

  if (document.readyState === 'complete') {
    runInitialCheck();
  } else {
    window.addEventListener('load', runInitialCheck);
  }

  // Observe DOM mutations for dynamically added images
  observer = new MutationObserver((mutations) => {
    let hasNewImages = false;
    
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node instanceof HTMLImageElement) {
          hasNewImages = true;
        }
        if (node instanceof HTMLElement && node.querySelector('img')) {
          hasNewImages = true;
        }
      });
    });

    if (hasNewImages) {
      // Debounce to avoid excessive checks
      setTimeout(() => detectUnregisteredImages(registeredPaths), 500);
    }
  });

  // Start observing when DOM is ready
  const startObserver = () => {
    if (document.body) {
      observer?.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  };

  if (document.body) {
    startObserver();
  } else {
    document.addEventListener('DOMContentLoaded', startObserver);
  }
};

/**
 * Stop the development image guard
 */
export const stopDevImageGuard = (): void => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  detectedViolations.clear();
};

/**
 * Get current violation count (for testing)
 */
export const getViolationCount = (): number => {
  return detectedViolations.size;
};
