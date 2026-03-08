
import { supabase } from '@/integrations/supabase/client';
import { VehicleImage } from '@/types/vehicleImage';
import { imageValidator } from '@/utils/imageValidation';
import { imageOptimizer } from '@/utils/imageOptimization';
import { vehicleImageCache } from '@/utils/vehicleImageCache';
import { uploadFileSecurely } from '@/utils/secureUpload';

/**
 * Servicio central consolidado para manejo de imágenes de vehículos
 * Mantiene compatibilidad total con servicios existentes
 * Ahora incluye validación, optimización y cache para mejor rendimiento
 */
export class VehicleImageServiceCore {
  private bucketName = 'vehicles';

  /**
   * Bucket already exists in Supabase storage - no need to check/create
   */
  private async ensureBucketExists(): Promise<void> {
    // The 'vehicles' bucket is pre-configured in Supabase storage.
    // Attempting getBucket/createBucket with anon key causes RLS errors.
    // Simply proceed - upload will fail with a clear error if bucket is missing.
    return;
  }

  /**
   * Sube una imagen al storage de Supabase
   */
  async uploadToStorage(file: File, vehicleId: string): Promise<string | null> {
    try {
      const { publicUrl, error } = await uploadFileSecurely(
        file,
        this.bucketName,
        vehicleId
      );

      if (error || !publicUrl) {
        console.error('Error uploading to storage via secure endpoint:', error);
        return null;
      }

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadToStorage:', error);
      return null;
    }
  }

  /**
   * Crea un registro de imagen en la base de datos
   */
  async createImageRecord(
    vehicleId: string,
    imageUrl: string,
    isPrimary: boolean,
    displayOrder: number
  ): Promise<VehicleImage | null> {
    try {
      const { error, data } = await supabase
        .from('vehicle_images')
        .insert({
          vehicle_id: vehicleId,
          image_url: imageUrl,
          is_primary: isPrimary,
          display_order: displayOrder
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating image record:', error);
      return null;
    }
  }

  /**
   * Actualiza el thumbnail del vehículo
   */
  async updateVehicleThumbnail(vehicleId: string, imageUrl: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ thumbnailurl: imageUrl })
        .eq('id', vehicleId);

      if (error) {
        console.error('Error updating vehicle thumbnail:', error);
      }
    } catch (error) {
      console.error('Error in updateVehicleThumbnail:', error);
    }
  }

  /**
   * Elimina el estado primario de todas las imágenes de un vehículo
   */
  async clearPrimaryStatus(vehicleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vehicle_images')
        .update({ is_primary: false })
        .eq('vehicle_id', vehicleId);

      if (error) {
        console.error('Error clearing primary status:', error);
      }
    } catch (error) {
      console.error('Error in clearPrimaryStatus:', error);
    }
  }

  /**
   * Obtiene el conteo actual de imágenes para un vehículo (con cache)
   */
  async getImageCount(vehicleId: string): Promise<number> {
    try {
      // Intentar obtener desde cache primero
      const cachedCount = vehicleImageCache.getImageCount(vehicleId);
      if (cachedCount !== null) {
        return cachedCount;
      }

      // Si no está en cache, consultar DB
      const { count } = await supabase
        .from('vehicle_images')
        .select('*', { count: 'exact', head: true })
        .eq('vehicle_id', vehicleId);

      const imageCount = count || 0;
      
      // Guardar en cache por 5 minutos
      vehicleImageCache.setImageCount(vehicleId, imageCount);
      
      return imageCount;
    } catch (error) {
      console.error('Error getting image count:', error);
      return 0;
    }
  }

  /**
   * Elimina un registro de imagen
   */
  async deleteImageRecord(imageId: string): Promise<VehicleImage | null> {
    try {
      const { error, data } = await supabase
        .from('vehicle_images')
        .delete()
        .eq('id', imageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting image:', error);
      return null;
    }
  }

  /**
   * Sube múltiples imágenes con validación, optimización y manejo de errores mejorado
   */
  async uploadMultipleImages(
    images: FileList | File[],
    vehicleId: string,
    startIndex: number = 0
  ): Promise<{
    successful: string[];
    failed: number;
    total: number;
    errors: string[];
    warnings: string[];
    optimizationSummary?: {
      totalSavings: number;
      optimizedCount: number;
    };
  }> {
    const results = {
      successful: [] as string[],
      failed: 0,
      total: images.length,
      errors: [] as string[],
      warnings: [] as string[]
    };

    try {
      // Asegurar que el bucket existe antes de procesar imágenes
      await this.ensureBucketExists();
    } catch (error) {
      results.failed = images.length;
      results.errors.push(`Error ensuring bucket exists: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return results;
    }

    // Validación previa
    const currentCount = await this.getImageCount(vehicleId);
    const validation = await imageValidator.validateForUpload(images, vehicleId, currentCount);
    
    if (!validation.isValid) {
      results.failed = images.length;
      results.errors = validation.errors;
      results.warnings = validation.warnings;
      console.error('Validation failed:', validation.errors);
      return results;
    }

    // Agregar advertencias si las hay
    results.warnings = validation.warnings;

    // Optimización de imágenes si es necesario
    let filesToUpload = Array.from(images);
    let optimizationSummary = { totalSavings: 0, optimizedCount: 0 };

    // Verificar si alguna imagen necesita optimización
    const needsOptimization = filesToUpload.some(file => imageOptimizer.shouldOptimize(file));
    
    if (needsOptimization) {
      console.log('Optimizing images for better performance...');
      
      const optimizedFiles = await Promise.all(
        filesToUpload.map(async (file) => {
          if (imageOptimizer.shouldOptimize(file)) {
            try {
              const optimization = await imageOptimizer.optimizeImage(file);
              if (optimization) {
                optimizationSummary.totalSavings += (file.size - optimization.optimizedSize);
                optimizationSummary.optimizedCount++;
                results.warnings.push(
                  `${file.name}: Optimizada (${(optimization.compressionRatio).toFixed(1)}% reducción)`
                );
                return optimization.optimizedFile;
              }
            } catch (optError) {
              console.warn(`Optimization failed for ${file.name}, using original:`, optError);
            }
          }
          return file;
        })
      );
      
      filesToUpload = optimizedFiles;
    }

    const imagePromises = filesToUpload.map(async (file, index) => {
      try {
        // Validar archivo individual (por seguridad)
        const fileValidation = imageValidator.validateFile(file);
        if (!fileValidation.isValid) {
          results.failed++;
          results.errors.push(`${file.name}: ${fileValidation.errors.join(', ')}`);
          return null;
        }

        // Subir al storage
        const publicUrl = await this.uploadToStorage(file, vehicleId);
        if (!publicUrl) {
          results.failed++;
          results.errors.push(`${file.name}: Error al subir al storage`);
          return null;
        }

        // Crear registro en DB
        const imageRecord = await this.createImageRecord(
          vehicleId,
          publicUrl,
          index === 0 && startIndex === 0, // Solo la primera imagen es primaria si no hay imágenes existentes
          startIndex + index
        );

        if (!imageRecord) {
          results.failed++;
          results.errors.push(`${file.name}: Error al crear registro en base de datos`);
          return null;
        }

        // Si es la primera imagen, actualizar thumbnail
        if (index === 0 && startIndex === 0) {
          await this.updateVehicleThumbnail(vehicleId, publicUrl);
        }

        results.successful.push(publicUrl);
        return publicUrl;
      } catch (error) {
        console.error(`Error processing image ${index}:`, error);
        results.failed++;
        results.errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        return null;
      }
    });

    await Promise.all(imagePromises);
    
    // Invalidar cache después de subir
    vehicleImageCache.invalidateVehicle(vehicleId);
    
    // Añadir resumen de optimización si hubo optimizaciones
    if (optimizationSummary.optimizedCount > 0) {
      (results as any).optimizationSummary = optimizationSummary;
    }
    
    return results;
  }

  /**
   * Sube una sola imagen con validación completa
   */
  async uploadSingleImageWithValidation(
    file: File,
    vehicleId: string,
    isPrimary: boolean = false
  ): Promise<{
    success: boolean;
    imageUrl?: string;
    error?: string;
    warnings: string[];
  }> {
    const result = {
      success: false,
      warnings: [] as string[]
    };

    try {
      // Asegurar que el bucket existe
      await this.ensureBucketExists();

      // Validar archivo
      const validation = imageValidator.validateFile(file);
      if (!validation.isValid) {
        return {
          ...result,
          error: validation.errors.join(', '),
          warnings: validation.warnings
        };
      }

      result.warnings = validation.warnings;

      // Verificar límite de imágenes
      const currentCount = await this.getImageCount(vehicleId);
      const config = imageValidator.getConfig();
      
      if (currentCount >= config.maxImagesPerVehicle) {
        return {
          ...result,
          error: `Límite máximo de ${config.maxImagesPerVehicle} imágenes alcanzado`
        };
      }

      // Limpiar estado primario si es necesario
      if (isPrimary) {
        await this.clearPrimaryStatus(vehicleId);
      }

      // Subir imagen
      const imageUrl = await this.uploadToStorage(file, vehicleId);
      if (!imageUrl) {
        return {
          ...result,
          error: 'Error al subir imagen al storage'
        };
      }

      // Crear registro
      const imageRecord = await this.createImageRecord(
        vehicleId,
        imageUrl,
        isPrimary,
        currentCount
      );

      if (!imageRecord) {
        return {
          ...result,
          error: 'Error al crear registro en base de datos'
        };
      }

      // Actualizar thumbnail si es primaria
      if (isPrimary) {
        await this.updateVehicleThumbnail(vehicleId, imageUrl);
      }

      return {
        success: true,
        imageUrl,
        warnings: result.warnings
      };

    } catch (error) {
      console.error('Error in uploadSingleImageWithValidation:', error);
      return {
        ...result,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

// Instancia singleton para reutilizar
export const vehicleImageServiceCore = new VehicleImageServiceCore();
