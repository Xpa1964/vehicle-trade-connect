/**
 * Utilidades de validación para imágenes de vehículos
 */

export interface ImageValidationConfig {
  maxSizeBytes: number;
  maxImagesPerVehicle: number;
  allowedTypes: string[];
  allowedExtensions: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ImageValidator {
  private config: ImageValidationConfig = {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    maxImagesPerVehicle: 25,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp']
  };

  /**
   * Valida un archivo individual
   */
  validateFile(file: File): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validar tamaño
    if (file.size > this.config.maxSizeBytes) {
      result.isValid = false;
      result.errors.push(
        `Archivo demasiado grande: ${this.formatFileSize(file.size)}. Máximo permitido: ${this.formatFileSize(this.config.maxSizeBytes)}`
      );
    }

    // Validar tipo MIME
    if (!this.config.allowedTypes.includes(file.type)) {
      result.isValid = false;
      result.errors.push(`Tipo de archivo no permitido: ${file.type}. Tipos permitidos: ${this.config.allowedTypes.join(', ')}`);
    }

    // Validar extensión
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !this.config.allowedExtensions.includes(extension)) {
      result.isValid = false;
      result.errors.push(`Extensión no permitida: ${extension}. Extensiones permitidas: ${this.config.allowedExtensions.join(', ')}`);
    }

    // Advertencias para archivos grandes pero válidos
    if (file.size > 5 * 1024 * 1024 && file.size <= this.config.maxSizeBytes) {
      result.warnings.push(`Archivo grande (${this.formatFileSize(file.size)}). Considera optimizar la imagen para mejor rendimiento.`);
    }

    return result;
  }

  /**
   * Valida múltiples archivos
   */
  validateFiles(files: FileList, currentImageCount: number = 0): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validar límite total de imágenes
    if (currentImageCount + files.length > this.config.maxImagesPerVehicle) {
      result.isValid = false;
      result.errors.push(
        `Límite de imágenes excedido. Máximo ${this.config.maxImagesPerVehicle} imágenes por vehículo. Actualmente: ${currentImageCount}, intentando agregar: ${files.length}`
      );
    }

    // Validar cada archivo individualmente
    Array.from(files).forEach((file, index) => {
      const fileResult = this.validateFile(file);
      if (!fileResult.isValid) {
        result.isValid = false;
        fileResult.errors.forEach(error => {
          result.errors.push(`Archivo ${index + 1} (${file.name}): ${error}`);
        });
      }
      fileResult.warnings.forEach(warning => {
        result.warnings.push(`Archivo ${index + 1} (${file.name}): ${warning}`);
      });
    });

    // Validar nombres duplicados
    const fileNames = Array.from(files).map(f => f.name);
    const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      result.warnings.push(`Archivos con nombres duplicados detectados: ${duplicates.join(', ')}`);
    }

    return result;
  }

  /**
   * Valida antes de subir (incluyendo verificaciones de red)
   */
  async validateForUpload(files: FileList, vehicleId: string, currentImageCount: number): Promise<ValidationResult> {
    const result = this.validateFiles(files, currentImageCount);

    // Validar vehicleId
    if (!vehicleId || vehicleId.trim() === '') {
      result.isValid = false;
      result.errors.push('ID de vehículo requerido');
    }

    // Validar que el vehicleId sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (vehicleId && !uuidRegex.test(vehicleId)) {
      result.isValid = false;
      result.errors.push('ID de vehículo inválido');
    }

    return result;
  }

  /**
   * Formatea el tamaño de archivo para mostrar
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Obtiene configuración actual
   */
  getConfig(): ImageValidationConfig {
    return { ...this.config };
  }

  /**
   * Actualiza configuración (para casos especiales)
   */
  updateConfig(newConfig: Partial<ImageValidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Instancia singleton
export const imageValidator = new ImageValidator();