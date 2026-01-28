import { useEffect } from 'react';

interface PreloadImageOptions {
  priority?: boolean;
  as?: 'image' | 'fetch';
  type?: string;
}

/**
 * Hook para precargar imágenes críticas (LCP)
 * Añade <link rel="preload"> al <head> para mejorar LCP
 */
export const useImagePreload = (
  images: string[],
  options: PreloadImageOptions = {}
) => {
  const { priority = true, as = 'image', type } = options;

  useEffect(() => {
    if (!priority || images.length === 0) return;

    const preloadLinks: HTMLLinkElement[] = [];

    images.forEach((src) => {
      // Verificar si ya existe un preload para esta imagen
      const existingLink = document.querySelector(
        `link[rel="preload"][href="${src}"]`
      );

      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = as;
        link.href = src;
        
        if (type) {
          link.type = type;
        }

        // Añadir fetchpriority para imágenes críticas
        if (priority) {
          link.setAttribute('fetchpriority', 'high');
        }

        document.head.appendChild(link);
        preloadLinks.push(link);
      }
    });

    // Cleanup: remover preload links al desmontar
    return () => {
      preloadLinks.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [images, priority, as, type]);
};

/**
 * Hook para precargar una sola imagen crítica
 */
export const useImagePreloadSingle = (
  src: string,
  options: PreloadImageOptions = {}
) => {
  useImagePreload([src], options);
};
