
import { useState } from 'react';
import { queryClient } from '@/lib/react-query';
import { vehicleImageServiceCore } from '@/services/vehicleImageServiceCore';

export const useVehicleImageUpload = (vehicleId?: string) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File, isPrimary: boolean = false) => {
    if (!vehicleId) {
      console.error('No vehicle ID provided');
      throw new Error('No vehicle ID provided');
    }

    setIsUploading(true);
    try {
      // Usar el nuevo método con validación
      const result = await vehicleImageServiceCore.uploadSingleImageWithValidation(
        file, 
        vehicleId, 
        isPrimary
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload image');
      }

      // Mostrar advertencias si las hay
      if (result.warnings.length > 0) {
        console.warn('Upload warnings:', result.warnings);
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['vehicle-images', vehicleId] });
      
      return result.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading
  };
};
