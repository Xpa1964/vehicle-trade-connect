/**
 * Utilidades de optimización de imágenes
 */

export interface ImageOptimizationConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: 'webp' | 'jpeg' | 'png';
  enableOptimization: boolean;
}

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  optimizedFile: File;
}

export class ImageOptimizer {
  private config: ImageOptimizationConfig = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    format: 'webp',
    enableOptimization: true
  };

  /**
   * Optimiza una imagen manteniendo calidad aceptable
   */
  async optimizeImage(file: File): Promise<OptimizationResult | null> {
    if (!this.config.enableOptimization) {
      return null;
    }

    try {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          try {
            // Calcular nuevas dimensiones manteniendo aspect ratio
            const { width: newWidth, height: newHeight } = this.calculateOptimalDimensions(
              img.width,
              img.height
            );

            canvas.width = newWidth;
            canvas.height = newHeight;

            // Dibujar imagen redimensionada
            ctx?.drawImage(img, 0, 0, newWidth, newHeight);

            // Convertir a blob optimizado
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to optimize image'));
                  return;
                }

                const optimizedFile = new File([blob], this.generateOptimizedFileName(file.name), {
                  type: blob.type,
                  lastModified: Date.now()
                });

                resolve({
                  originalSize: file.size,
                  optimizedSize: optimizedFile.size,
                  compressionRatio: (1 - optimizedFile.size / file.size) * 100,
                  optimizedFile
                });
              },
              this.getMimeType(),
              this.config.quality
            );
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error('Error optimizing image:', error);
      return null;
    }
  }

  /**
   * Optimiza múltiples imágenes en paralelo
   */
  async optimizeMultipleImages(files: FileList): Promise<{
    optimized: Array<{ original: File; result: OptimizationResult }>;
    failed: Array<{ file: File; error: string }>;
    totalSavings: number;
  }> {
    const results = {
      optimized: [] as Array<{ original: File; result: OptimizationResult }>,
      failed: [] as Array<{ file: File; error: string }>,
      totalSavings: 0
    };

    const promises = Array.from(files).map(async (file) => {
      try {
        // Solo optimizar imágenes
        if (!file.type.startsWith('image/')) {
          return { original: file, result: null };
        }

        const optimizationResult = await this.optimizeImage(file);
        if (optimizationResult) {
          results.optimized.push({ original: file, result: optimizationResult });
          results.totalSavings += (file.size - optimizationResult.optimizedSize);
        }
        
        return { original: file, result: optimizationResult };
      } catch (error) {
        results.failed.push({
          file,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        return { original: file, result: null };
      }
    });

    await Promise.all(promises);
    return results;
  }

  /**
   * Calcula dimensiones óptimas manteniendo aspect ratio
   */
  private calculateOptimalDimensions(originalWidth: number, originalHeight: number): {
    width: number;
    height: number;
  } {
    const { maxWidth, maxHeight } = this.config;

    // Si la imagen ya es más pequeña, no redimensionar
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    const aspectRatio = originalWidth / originalHeight;

    let newWidth = originalWidth;
    let newHeight = originalHeight;

    // Redimensionar basado en el límite más restrictivo
    if (originalWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = newWidth / aspectRatio;
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * aspectRatio;
    }

    return {
      width: Math.round(newWidth),
      height: Math.round(newHeight)
    };
  }

  /**
   * Genera nombre de archivo optimizado
   */
  private generateOptimizedFileName(originalName: string): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const extension = this.getFileExtension();
    return `${nameWithoutExt}_optimized.${extension}`;
  }

  /**
   * Obtiene el tipo MIME según la configuración
   */
  private getMimeType(): string {
    const mimeTypes = {
      webp: 'image/webp',
      jpeg: 'image/jpeg',
      png: 'image/png'
    };
    return mimeTypes[this.config.format];
  }

  /**
   * Obtiene la extensión de archivo según la configuración
   */
  private getFileExtension(): string {
    return this.config.format === 'jpeg' ? 'jpg' : this.config.format;
  }

  /**
   * Verifica si la optimización resultará en ahorro significativo
   */
  shouldOptimize(file: File): boolean {
    if (!this.config.enableOptimization) return false;
    if (!file.type.startsWith('image/')) return false;

    // Optimizar si el archivo es mayor a 1MB
    return file.size > 1024 * 1024;
  }

  /**
   * Actualiza configuración de optimización
   */
  updateConfig(newConfig: Partial<ImageOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Obtiene configuración actual
   */
  getConfig(): ImageOptimizationConfig {
    return { ...this.config };
  }
}

// Instancia singleton
export const imageOptimizer = new ImageOptimizer();