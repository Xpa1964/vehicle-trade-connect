/**
 * PWA Utilities
 * Helper functions for Progressive Web App features
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const SW_VERSION = 'v4';
const PWA_CLEANUP_KEY = `pwa-cleanup-${SW_VERSION}`;

/**
 * Initialize PWA features
 */
export function initializePWA(): void {
  if (import.meta.env.DEV) {
    void cleanupServiceWorkersAndCaches();
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      void registerServiceWorker();
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    console.log('[PWA] Install prompt captured');
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredPrompt = null;
  });
}

async function cleanupServiceWorkersAndCaches(): Promise<void> {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((registration) => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }
  } catch (error) {
    console.warn('[PWA] Failed to clear old service workers/caches', error);
  }
}

/**
 * Register service worker
 */
async function registerServiceWorker(): Promise<void> {
  try {
    if (localStorage.getItem(PWA_CLEANUP_KEY) !== 'done') {
      await cleanupServiceWorkersAndCaches();
      localStorage.setItem(PWA_CLEANUP_KEY, 'done');
    }

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    const registration = await navigator.serviceWorker.register(`/sw.js?${SW_VERSION}`, {
      scope: '/',
    });

    console.log('[PWA] Service Worker registered:', registration);

    await registration.update();

    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    setInterval(() => {
      void registration.update();
    }, 60 * 60 * 1000);

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('[PWA] New version available, activating automatically');
          newWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
  }
}

/**
 * Prompt user to install PWA
 */
export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt not available');
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log('[PWA] User response:', outcome);
    deferredPrompt = null;
    
    return outcome === 'accepted';
  } catch (error) {
    console.error('[PWA] Install prompt error:', error);
    return false;
  }
}

/**
 * Check if app is installed
 */
export function isInstalled(): boolean {
  // Check if running in standalone mode (PWA installed)
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if install prompt is available
 */
export function canInstall(): boolean {
  return deferredPrompt !== null;
}

/**
 * Clear all caches (useful for debugging)
 */
export async function clearAllCaches(): Promise<void> {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
  }

  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('[PWA] All caches cleared');
  }
}

/**
 * Get cache size
 */
export async function getCacheSize(): Promise<number> {
  if (!('caches' in window)) return 0;

  const cacheNames = await caches.keys();
  let totalSize = 0;

  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  return totalSize;
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
