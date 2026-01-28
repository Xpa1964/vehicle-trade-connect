/**
 * Sistema centralizado de validación de uploads
 * Proporciona validación estricta de tipo MIME y tamaño para seguridad frontend
 */

export interface UploadValidationConfig {
  maxSizeBytes: number;
  maxFilesPerUpload: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  category: 'image' | 'video' | 'document' | 'audio' | 'mixed';
}

export interface UploadValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validFiles: File[];
  invalidFiles: File[];
}

// WHITELIST MIME - Tipos permitidos por categoría
export const MIME_WHITELISTS = {
  images: {
    types: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ],
    extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 25
  },
  videos: {
    types: [
      'video/mp4',
      'video/webm',
      'video/quicktime', // MOV
      'video/x-msvideo' // AVI
    ],
    extensions: ['mp4', 'webm', 'mov', 'avi'],
    maxSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 5
  },
  documents: {
    types: [
      'application/pdf',
      'application/msword', // DOC
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/vnd.ms-excel', // XLS
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
      'text/csv'
    ],
    extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'],
    maxSize: 20 * 1024 * 1024, // 20MB
    maxFiles: 10
  },
  audio: {
    types: [
      'audio/mpeg', // MP3
      'audio/wav',
      'audio/ogg',
      'audio/mp4' // M4A
    ],
    extensions: ['mp3', 'wav', 'ogg', 'm4a'],
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 5
  }
} as const;

export class UploadValidator {
  private config: UploadValidationConfig;

  constructor(config: Partial<UploadValidationConfig> = {}) {
    // Default config para imágenes (caso más común)
    this.config = {
      maxSizeBytes: MIME_WHITELISTS.images.maxSize,
      maxFilesPerUpload: MIME_WHITELISTS.images.maxFiles,
      allowedMimeTypes: [...MIME_WHITELISTS.images.types],
      allowedExtensions: [...MIME_WHITELISTS.images.extensions],
      category: 'image',
      ...config
    };
  }

  /**
   * Validación estricta de un archivo individual
   */
  validateFile(file: File): UploadValidationResult {
    const result: UploadValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      validFiles: [],
      invalidFiles: []
    };

    // 1. Validar extensión (primera línea de defensa)
    const extension = this.getFileExtension(file.name);
    if (!extension || !this.config.allowedExtensions.includes(extension)) {
      result.isValid = false;
      result.errors.push(
        `Extensión no permitida: .${extension}. Permitidas: ${this.config.allowedExtensions.join(', ')}`
      );
      result.invalidFiles.push(file);
      return result;
    }

    // 2. Validar tipo MIME (whitelist estricta)
    if (!this.config.allowedMimeTypes.includes(file.type)) {
      result.isValid = false;
      result.errors.push(
        `Tipo MIME no permitido: ${file.type}. Archivo: ${file.name}`
      );
      result.invalidFiles.push(file);
      return result;
    }

    // 3. Validar coherencia MIME-extensión
    const mimeExtensionValid = this.validateMimeExtensionMatch(file);
    if (!mimeExtensionValid) {
      result.isValid = false;
      result.errors.push(
        `Inconsistencia entre extensión (.${extension}) y tipo MIME (${file.type}). Posible archivo malicioso.`
      );
      result.invalidFiles.push(file);
      return result;
    }

    // 4. Validar tamaño
    if (file.size > this.config.maxSizeBytes) {
      result.isValid = false;
      result.errors.push(
        `Archivo demasiado grande: ${this.formatFileSize(file.size)}. Máximo: ${this.formatFileSize(this.config.maxSizeBytes)}`
      );
      result.invalidFiles.push(file);
      return result;
    }

    // 5. Advertencias para archivos grandes pero válidos
    const warningThreshold = this.config.maxSizeBytes * 0.7;
    if (file.size > warningThreshold) {
      result.warnings.push(
        `Archivo grande (${this.formatFileSize(file.size)}). Considera optimizar.`
      );
    }

    result.validFiles.push(file);
    return result;
  }

  /**
   * Validar múltiples archivos
   */
  validateFiles(files: FileList | File[]): UploadValidationResult {
    const result: UploadValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      validFiles: [],
      invalidFiles: []
    };

    const fileArray = Array.from(files);

    // Validar límite de archivos
    if (fileArray.length > this.config.maxFilesPerUpload) {
      result.isValid = false;
      result.errors.push(
        `Demasiados archivos. Máximo: ${this.config.maxFilesPerUpload}, recibidos: ${fileArray.length}`
      );
      return result;
    }

    // Validar cada archivo
    fileArray.forEach((file, index) => {
      const fileResult = this.validateFile(file);
      
      if (!fileResult.isValid) {
        result.isValid = false;
        fileResult.errors.forEach(error => {
          result.errors.push(`Archivo ${index + 1} (${file.name}): ${error}`);
        });
        result.invalidFiles.push(file);
      } else {
        result.validFiles.push(file);
      }

      fileResult.warnings.forEach(warning => {
        result.warnings.push(`Archivo ${index + 1} (${file.name}): ${warning}`);
      });
    });

    // Validar nombres duplicados
    const fileNames = fileArray.map(f => f.name);
    const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      result.warnings.push(`Archivos duplicados detectados: ${[...new Set(duplicates)].join(', ')}`);
    }

    return result;
  }

  /**
   * Validar coherencia entre MIME type y extensión
   */
  private validateMimeExtensionMatch(file: File): boolean {
    const extension = this.getFileExtension(file.name);
    if (!extension) return false;

    // Mapeo de extensiones a MIME types esperados
    const mimeExtensionMap: Record<string, string[]> = {
      'jpg': ['image/jpeg', 'image/jpg'],
      'jpeg': ['image/jpeg', 'image/jpg'],
      'png': ['image/png'],
      'webp': ['image/webp'],
      'gif': ['image/gif'],
      'mp4': ['video/mp4', 'audio/mp4'],
      'webm': ['video/webm'],
      'mov': ['video/quicktime'],
      'avi': ['video/x-msvideo'],
      'pdf': ['application/pdf'],
      'doc': ['application/msword'],
      'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      'xls': ['application/vnd.ms-excel'],
      'xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      'csv': ['text/csv', 'application/vnd.ms-excel'],
      'mp3': ['audio/mpeg'],
      'wav': ['audio/wav'],
      'ogg': ['audio/ogg'],
      'm4a': ['audio/mp4', 'audio/x-m4a']
    };

    const expectedMimes = mimeExtensionMap[extension.toLowerCase()];
    return expectedMimes ? expectedMimes.includes(file.type) : false;
  }

  /**
   * Obtener extensión de archivo
   */
  private getFileExtension(fileName: string): string | null {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : null;
  }

  /**
   * Formatear tamaño de archivo
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig: Partial<UploadValidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Obtener configuración actual
   */
  getConfig(): UploadValidationConfig {
    return { ...this.config };
  }
}

// Factory functions para crear validadores por categoría
export const createImageValidator = (): UploadValidator => {
  return new UploadValidator({
    category: 'image',
    maxSizeBytes: MIME_WHITELISTS.images.maxSize,
    maxFilesPerUpload: MIME_WHITELISTS.images.maxFiles,
    allowedMimeTypes: [...MIME_WHITELISTS.images.types],
    allowedExtensions: [...MIME_WHITELISTS.images.extensions]
  });
};

export const createVideoValidator = (): UploadValidator => {
  return new UploadValidator({
    category: 'video',
    maxSizeBytes: MIME_WHITELISTS.videos.maxSize,
    maxFilesPerUpload: MIME_WHITELISTS.videos.maxFiles,
    allowedMimeTypes: [...MIME_WHITELISTS.videos.types],
    allowedExtensions: [...MIME_WHITELISTS.videos.extensions]
  });
};

export const createDocumentValidator = (): UploadValidator => {
  return new UploadValidator({
    category: 'document',
    maxSizeBytes: MIME_WHITELISTS.documents.maxSize,
    maxFilesPerUpload: MIME_WHITELISTS.documents.maxFiles,
    allowedMimeTypes: [...MIME_WHITELISTS.documents.types],
    allowedExtensions: [...MIME_WHITELISTS.documents.extensions]
  });
};

export const createAudioValidator = (): UploadValidator => {
  return new UploadValidator({
    category: 'audio',
    maxSizeBytes: MIME_WHITELISTS.audio.maxSize,
    maxFilesPerUpload: MIME_WHITELISTS.audio.maxFiles,
    allowedMimeTypes: [...MIME_WHITELISTS.audio.types],
    allowedExtensions: [...MIME_WHITELISTS.audio.extensions]
  });
};

// Singleton instances
export const imageUploadValidator = createImageValidator();
export const videoUploadValidator = createVideoValidator();
export const documentUploadValidator = createDocumentValidator();
export const audioUploadValidator = createAudioValidator();
