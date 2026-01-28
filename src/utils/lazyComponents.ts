import { lazy, ComponentType } from 'react';

/**
 * Enhanced lazy loading utility with error handling and retry logic
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries = 3,
  interval = 1000
): ReturnType<typeof lazy<T>> {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (retriesLeft: number) => {
        importFunc()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error);
              return;
            }
            
            console.warn(
              `Failed to load component. Retrying... (${retriesLeft} attempts left)`
            );
            
            setTimeout(() => {
              attemptImport(retriesLeft - 1);
            }, interval);
          });
      };
      
      attemptImport(retries);
    });
  });
}

/**
 * Preload a lazy component
 */
export function preloadComponent<T extends ComponentType<any>>(
  lazyComponent: ReturnType<typeof lazy<T>>
): void {
  // Access the internal _payload to trigger preload
  const component = lazyComponent as any;
  if (component._payload && component._payload._status === -1) {
    component._payload._result();
  }
}
