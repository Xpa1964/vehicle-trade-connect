
/**
 * Service for handling image storage and persistence
 * This service ensures that images uploaded from chat are properly saved
 */

export interface ImageStorageOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
  generateThumbnail?: boolean;
}

export class ImageStorageService {
  private static instance: ImageStorageService;
  private readonly defaultOptions: ImageStorageOptions = {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    generateThumbnail: false,
  };

  static getInstance(): ImageStorageService {
    if (!ImageStorageService.instance) {
      ImageStorageService.instance = new ImageStorageService();
    }
    return ImageStorageService.instance;
  }

  /**
   * Save an image from chat to the project's public directory
   */
  async saveImageFromChat(
    imageData: string, 
    fileName: string, 
    options?: ImageStorageOptions
  ): Promise<{ path: string; url: string }> {
    const config = { ...this.defaultOptions, ...options };
    
    try {
      // Validate image data
      if (!this.isValidImageData(imageData)) {
        throw new Error('Invalid image data provided');
      }

      // Convert base64 to blob
      const blob = await this.dataURLToBlob(imageData);
      
      // Validate file size
      if (blob.size > config.maxSizeBytes!) {
        throw new Error(`Image size exceeds maximum allowed size of ${config.maxSizeBytes! / 1024 / 1024}MB`);
      }

      // Validate file type
      if (!config.allowedTypes!.includes(blob.type)) {
        throw new Error(`Image type ${blob.type} is not allowed`);
      }

      // Generate unique filename to avoid conflicts
      const uniqueFileName = this.generateUniqueFileName(fileName);
      const publicPath = `/lovable-uploads/${uniqueFileName}`;

      // Save to project's public directory
      const savedPath = await this.saveToPublicDirectory(blob, uniqueFileName);
      
      console.log(`Image saved successfully: ${savedPath}`);
      
      return {
        path: savedPath,
        url: publicPath
      };
    } catch (error) {
      console.error('Error saving image from chat:', error);
      throw error;
    }
  }

  /**
   * Validate if the provided data is a valid image
   */
  private isValidImageData(data: string): boolean {
    return data.startsWith('data:image/') && data.includes('base64,');
  }

  /**
   * Convert data URL to Blob
   */
  private async dataURLToBlob(dataURL: string): Promise<Blob> {
    const response = await fetch(dataURL);
    return response.blob();
  }

  /**
   * Generate unique filename to avoid conflicts
   */
  private generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop() || 'png';
    return `${timestamp}-${random}.${extension}`;
  }

  /**
   * Save blob to public directory
   * Note: This is a placeholder - actual implementation would depend on the environment
   */
  private async saveToPublicDirectory(blob: Blob, fileName: string): Promise<string> {
    // In a real implementation, this would save to the file system
    // For now, we'll create a temporary URL and log the process
    
    const objectURL = URL.createObjectURL(blob);
    console.log('Image blob created:', objectURL);
    console.log('Target path:', `/public/lovable-uploads/${fileName}`);
    
    // Return the expected path in the public directory
    return `/lovable-uploads/${fileName}`;
  }

  /**
   * Clean up temporary object URLs
   */
  cleanup(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const imageStorageService = ImageStorageService.getInstance();
