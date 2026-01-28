/**
 * Utilidades para metadatos de imágenes y análisis
 */

export interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  type: string;
  aspectRatio: number;
  isLandscape: boolean;
  isPortrait: boolean;
  isSquare: boolean;
  megapixels: number;
  estimatedQuality: 'low' | 'medium' | 'high' | 'very_high';
}

export interface ImageAnalysisResult {
  metadata: ImageMetadata;
  recommendations: string[];
  warnings: string[];
  suitability: 'excellent' | 'good' | 'fair' | 'poor';
}

export class ImageMetadataExtractor {
  /**
   * Extrae metadatos completos de una imagen
   */
  async extractMetadata(file: File): Promise<ImageMetadata> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const metadata: ImageMetadata = {
          width: img.width,
          height: img.height,
          size: file.size,
          type: file.type,
          aspectRatio: img.width / img.height,
          isLandscape: img.width > img.height,
          isPortrait: img.height > img.width,
          isSquare: Math.abs(img.width - img.height) < 10,
          megapixels: (img.width * img.height) / 1000000,
          estimatedQuality: this.estimateQuality(img.width, img.height, file.size)
        };
        resolve(metadata);
      };

      img.onerror = () => reject(new Error('Failed to load image for metadata extraction'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Analiza una imagen y proporciona recomendaciones
   */
  async analyzeImage(file: File): Promise<ImageAnalysisResult> {
    const metadata = await this.extractMetadata(file);
    const analysis: ImageAnalysisResult = {
      metadata,
      recommendations: [],
      warnings: [],
      suitability: 'good'
    };

    // Análisis de resolución
    if (metadata.width < 800 || metadata.height < 600) {
      analysis.warnings.push('Resolución baja. Considera usar imágenes de al menos 800x600px');
      analysis.suitability = 'fair';
    }

    if (metadata.width > 4000 || metadata.height > 4000) {
      analysis.recommendations.push('Imagen de muy alta resolución. Se optimizará automáticamente para web');
    }

    // Análisis de tamaño de archivo
    if (metadata.size > 5 * 1024 * 1024) { // 5MB
      analysis.warnings.push('Archivo muy grande. Se comprimirá automáticamente');
    }

    if (metadata.size < 50 * 1024) { // 50KB
      analysis.warnings.push('Archivo muy pequeño. Podría indicar baja calidad');
      analysis.suitability = 'fair';
    }

    // Análisis de aspect ratio
    if (metadata.isSquare) {
      analysis.recommendations.push('Imagen cuadrada. Ideal para thumbnails y previews');
      analysis.suitability = 'excellent';
    } else if (metadata.aspectRatio >= 1.3 && metadata.aspectRatio <= 1.8) {
      analysis.recommendations.push('Aspect ratio ideal para galería de vehículos');
      analysis.suitability = 'excellent';
    } else if (metadata.aspectRatio > 3 || metadata.aspectRatio < 0.5) {
      analysis.warnings.push('Aspect ratio extremo. Podría no verse bien en la galería');
      analysis.suitability = 'poor';
    }

    // Análisis de calidad estimada
    if (metadata.estimatedQuality === 'low') {
      analysis.warnings.push('Calidad de imagen estimada como baja');
      analysis.suitability = 'poor';
    } else if (metadata.estimatedQuality === 'very_high') {
      analysis.recommendations.push('Imagen de excelente calidad detectada');
    }

    return analysis;
  }

  /**
   * Estima la calidad de imagen basada en resolución y tamaño
   */
  private estimateQuality(width: number, height: number, fileSize: number): 'low' | 'medium' | 'high' | 'very_high' {
    const pixels = width * height;
    const bytesPerPixel = fileSize / pixels;

    if (bytesPerPixel < 0.5) return 'low';
    if (bytesPerPixel < 2) return 'medium';
    if (bytesPerPixel < 4) return 'high';
    return 'very_high';
  }

  /**
   * Determina si una imagen es adecuada como imagen principal
   */
  async isGoodPrimaryImage(file: File): Promise<{ suitable: boolean; reasons: string[] }> {
    const analysis = await this.analyzeImage(file);
    const reasons: string[] = [];

    const suitable = analysis.suitability === 'excellent' || analysis.suitability === 'good';

    if (!suitable) {
      reasons.push(...analysis.warnings);
    } else {
      reasons.push('Imagen adecuada para usar como principal');
    }

    return { suitable, reasons };
  }

  /**
   * Genera sugerencias de optimización
   */
  generateOptimizationSuggestions(metadata: ImageMetadata): string[] {
    const suggestions: string[] = [];

    if (metadata.width > 1920 || metadata.height > 1080) {
      suggestions.push('Redimensionar a 1920x1080 máximo para web');
    }

    if (metadata.size > 2 * 1024 * 1024) {
      suggestions.push('Comprimir para reducir tamaño de archivo');
    }

    if (metadata.type === 'image/png' && metadata.megapixels > 2) {
      suggestions.push('Convertir a JPEG o WebP para mejor compresión');
    }

    if (metadata.estimatedQuality === 'very_high' && metadata.size > 5 * 1024 * 1024) {
      suggestions.push('Reducir calidad ligeramente para optimizar carga web');
    }

    return suggestions;
  }
}

// Instancia singleton
export const imageMetadataExtractor = new ImageMetadataExtractor();