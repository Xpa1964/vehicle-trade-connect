
import { vehicleImageServiceCore } from '@/services/vehicleImageServiceCore';

/**
 * Hook para manejo de imágenes de vehículos
 * Ahora usa el servicio central consolidado
 */
export const useVehicleImageHandler = () => {
  /**
   * Upload multiple images for a vehicle
   */
  const handleImageUploads = async (images: FileList, vehicleId: string, startIndex: number = 0) => {
    const result = await vehicleImageServiceCore.uploadMultipleImages(images, vehicleId, startIndex);
    
    console.log(`Upload completed: ${result.successful.length}/${result.total} successful`);
    
    if (result.failed > 0) {
      console.warn(`${result.failed} images failed to upload`);
    }
    
    return result;
  };

  /**
   * Update vehicle thumbnail image
   */
  const updateVehicleThumbnail = async (vehicleId: string, imageUrl: string) => {
    await vehicleImageServiceCore.updateVehicleThumbnail(vehicleId, imageUrl);
  };

  return {
    handleImageUploads,
    updateVehicleThumbnail
  };
};
