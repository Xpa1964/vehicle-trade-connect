
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VehicleImage } from '@/types/vehicleImage';
import { deleteImageRecord, updateVehicleThumbnail, deletePrimaryStatus } from '@/services/vehicleImageService';

export const useVehicleImages = (vehicleId?: string) => {
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['vehicle-images', vehicleId],
    queryFn: async () => {
      if (!vehicleId) {
        console.log('No vehicle ID provided');
        return [];
      }

      console.log(`Fetching images for vehicle: ${vehicleId}`);

      const { data, error } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('display_order');

      if (error) {
        console.error('Error fetching vehicle images:', error);
        toast.error('Error loading images');
        return [];
      }

      console.log(`Found ${data?.length || 0} images for vehicle ${vehicleId}`);
      if (data && data.length > 0) {
        data.forEach((img, i) => console.log(`Image ${i+1}: ${img.image_url} Primary: ${img.is_primary}`));
        return data as VehicleImage[];
      }
      
      // If no images found, try to get the thumbnailurl from vehicles table
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('thumbnailurl')
        .eq('id', vehicleId)
        .single();
      
      if (!vehicleError && vehicleData?.thumbnailurl) {
        console.log('Found thumbnailurl:', vehicleData.thumbnailurl);
        return [{
          id: `temp-${Date.now()}`,
          vehicle_id: vehicleId,
          image_url: vehicleData.thumbnailurl,
          is_primary: true,
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }];
      }

      return [];
    },
    enabled: !!vehicleId
  });

  const deleteImage = async (imageId: string) => {
    try {
      const deletedImage = await deleteImageRecord(imageId);
      
      if (deletedImage) {
        console.log('Image deleted successfully:', deletedImage);
        queryClient.invalidateQueries({ queryKey: ['vehicle-images', vehicleId] });
        
        // If primary image was deleted, set a new primary
        if (deletedImage.is_primary && vehicleId) {
          console.log('Primary image was deleted, setting new primary image');
          const { data: remainingImages } = await supabase
            .from('vehicle_images')
            .select('*')
            .eq('vehicle_id', vehicleId)
            .order('display_order')
            .limit(1);
            
          if (remainingImages && remainingImages.length > 0) {
            await setPrimaryImage(remainingImages[0].id);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  const setPrimaryImage = async (imageId: string) => {
    try {
      console.log(`Setting image ${imageId} as primary`);
      
      if (!vehicleId) return;

      // Remove primary status from all images
      await deletePrimaryStatus(vehicleId);

      // Set the selected image as primary
      const { error, data } = await supabase
        .from('vehicle_images')
        .update({ is_primary: true })
        .eq('id', imageId)
        .select()
        .single();

      if (error) throw error;

      // Update vehicle thumbnailurl
      if (data) {
        await updateVehicleThumbnail(vehicleId, data.image_url);
        queryClient.invalidateQueries({ queryKey: ['vehicle-images', vehicleId] });
      }
    } catch (error) {
      console.error('Error setting primary image:', error);
      throw error;
    }
  };

  return {
    images,
    isLoading,
    deleteImage,
    setPrimaryImage
  };
};
