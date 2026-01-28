/**
 * Utilidades para generación de nombres únicos y manejo de archivos
 */

export interface FileNameConfig {
  prefix?: string;
  suffix?: string;
  includeTimestamp: boolean;
  includeRandomId: boolean;
  maxLength: number;
  sanitize: boolean;
}

export class FileNameGenerator {
  private config: FileNameConfig = {
    includeTimestamp: true,
    includeRandomId: true,
    maxLength: 100,
    sanitize: true
  };

  /**
   * Genera un nombre único para archivo
   */
  generateUniqueFileName(originalName: string, vehicleId?: string): string {
    const extension = this.extractExtension(originalName);
    const baseName = this.extractBaseName(originalName);
    const cleanBaseName = this.config.sanitize ? this.sanitizeFileName(baseName) : baseName;

    let parts: string[] = [];

    // Agregar prefijo si existe
    if (this.config.prefix) {
      parts.push(this.config.prefix);
    }

    // Agregar ID de vehículo si se proporciona
    if (vehicleId) {
      parts.push(vehicleId.substring(0, 8)); // Primeros 8 caracteres del UUID
    }

    // Agregar nombre base
    parts.push(cleanBaseName);

    // Agregar timestamp si está habilitado
    if (this.config.includeTimestamp) {
      parts.push(Date.now().toString());
    }

    // Agregar ID aleatorio si está habilitado
    if (this.config.includeRandomId) {
      parts.push(this.generateRandomId());
    }

    // Agregar sufijo si existe
    if (this.config.suffix) {
      parts.push(this.config.suffix);
    }

    // Unir partes y agregar extensión
    let fileName = parts.join('_') + (extension ? `.${extension}` : '');

    // Truncar si excede la longitud máxima
    if (fileName.length > this.config.maxLength) {
      const extensionLength = extension ? extension.length + 1 : 0;
      const maxBaseLength = this.config.maxLength - extensionLength;
      const baseFileName = fileName.substring(0, maxBaseLength);
      fileName = baseFileName + (extension ? `.${extension}` : '');
    }

    return fileName;
  }

  /**
   * Genera un path completo para storage
   */
  generateStoragePath(fileName: string, vehicleId: string, folder?: string): string {
    const basePath = folder ? `${folder}/${vehicleId}` : vehicleId;
    return `${basePath}/${fileName}`;
  }

  /**
   * Extrae la extensión del archivo
   */
  private extractExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
      return '';
    }
    return fileName.substring(lastDotIndex + 1).toLowerCase();
  }

  /**
   * Extrae el nombre base sin extensión
   */
  private extractBaseName(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return fileName;
    }
    return fileName.substring(0, lastDotIndex);
  }

  /**
   * Sanitiza el nombre del archivo
   */
  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9\-_]/g, '-') // Reemplazar caracteres especiales
      .replace(/-+/g, '-') // Eliminar guiones múltiples
      .replace(/^-|-$/g, '') // Eliminar guiones al inicio y final
      .substring(0, 50); // Limitar longitud
  }

  /**
   * Genera un ID aleatorio
   */
  private generateRandomId(length: number = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Actualiza configuración
   */
  updateConfig(newConfig: Partial<FileNameConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Obtiene configuración actual
   */
  getConfig(): FileNameConfig {
    return { ...this.config };
  }
}

// Instancia singleton
export const fileNameGenerator = new FileNameGenerator();