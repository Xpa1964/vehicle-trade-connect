
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const deleteVehicleWithRelatedRecords = async (
  vehicleId: string,
  userId: string | undefined,
  onSuccess?: () => void
) => {
  try {
    console.log(`Starting deletion process for vehicle ${vehicleId} by user ${userId}`);
    
    if (!userId) {
      console.error('User ID is required for deletion');
      toast.error('Error: Se requiere autenticación para eliminar el vehículo');
      return false;
    }

    // Verificar que el usuario es el propietario del vehículo
    const { data: vehicleData, error: vehicleCheckError } = await supabase
      .from('vehicles')
      .select('user_id')
      .eq('id', vehicleId)
      .single();
    
    if (vehicleCheckError) {
      console.error('Error checking vehicle ownership:', vehicleCheckError);
      toast.error('Error: No se pudo verificar la propiedad del vehículo');
      return false;
    }
    
    if (vehicleData.user_id !== userId) {
      console.error('User is not the owner of the vehicle');
      toast.error('Error: No tienes permisos para eliminar este vehículo');
      return false;
    }

    // 1. Obtener y eliminar imágenes
    console.log('Fetching vehicle images...');
    const { data: vehicleImages, error: imagesError } = await supabase
      .from('vehicle_images')
      .select('id, image_url')
      .eq('vehicle_id', vehicleId);
    
    if (imagesError) {
      console.error('Error fetching vehicle images:', imagesError);
    }
    
    if (vehicleImages && vehicleImages.length > 0) {
      console.log(`Deleting ${vehicleImages.length} image records`);
      
      // Eliminar registros de la base de datos
      const { error: deleteImagesError } = await supabase
        .from('vehicle_images')
        .delete()
        .eq('vehicle_id', vehicleId);
      
      if (deleteImagesError) {
        console.error('Error deleting image records:', deleteImagesError);
      }
      
      // Eliminar archivos del storage
      try {
        const imagePaths = vehicleImages.map(img => {
          const url = img.image_url;
          const pathMatch = url.match(/vehicles\/([^\/]+\/[^\/]+)$/);
          return pathMatch ? pathMatch[1] : null;
        }).filter(path => path !== null) as string[];
        
        if (imagePaths.length > 0) {
          console.log(`Deleting ${imagePaths.length} files from storage:`, imagePaths);
          const { error: storageError } = await supabase.storage
            .from('vehicles')
            .remove(imagePaths);
          
          if (storageError) {
            console.error('Error deleting files from storage:', storageError);
          }
        }
      } catch (storageError) {
        console.error('Error processing storage deletion:', storageError);
      }
    }
    
    // 2. Eliminar equipamiento
    console.log('Deleting vehicle equipment...');
    const { error: equipmentError } = await supabase
      .from('vehicle_equipment')
      .delete()
      .eq('vehicle_id', vehicleId);
    
    if (equipmentError) {
      console.error('Error deleting equipment records:', equipmentError);
    }
    
    // 3. Eliminar información del vehículo
    console.log('Deleting vehicle information...');
    const { error: infoError } = await supabase
      .from('vehicle_information')
      .delete()
      .eq('vehicle_id', vehicleId);
    
    if (infoError) {
      console.error('Error deleting vehicle information:', infoError);
    }
    
    // 4. Eliminar metadatos del vehículo
    console.log('Deleting vehicle metadata...');
    const { error: metadataError } = await supabase
      .from('vehicle_metadata')
      .delete()
      .eq('vehicle_id', vehicleId);
    
    if (metadataError) {
      console.error('Error deleting vehicle metadata:', metadataError);
    }
    
    // 5. Eliminar daños del vehículo
    console.log('Deleting vehicle damages...');
    const { error: damagesError } = await supabase
      .from('vehicle_damages')
      .delete()
      .eq('vehicle_id', vehicleId);
    
    if (damagesError) {
      console.error('Error deleting vehicle damages:', damagesError);
    }
    
    // 6. Eliminar documentos del vehículo
    console.log('Deleting vehicle documents...');
    const { error: documentsError } = await supabase
      .from('vehicle_documents')
      .delete()
      .eq('vehicle_id', vehicleId);
    
    if (documentsError) {
      console.error('Error deleting vehicle documents:', documentsError);
    }
    
    // 7. Finalmente eliminar el vehículo
    console.log(`Deleting vehicle record ${vehicleId}`);
    const { error: vehicleError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId)
      .eq('user_id', userId);
    
    if (vehicleError) {
      console.error('Error deleting vehicle:', vehicleError);
      toast.error('Error al eliminar el vehículo');
      return false;
    }
    
    console.log('Vehicle deletion completed successfully');
    toast.success('Vehículo eliminado correctamente');
    
    if (onSuccess) {
      onSuccess();
    }
    
    return true;
  } catch (error) {
    console.error('Error in cascade deletion process:', error);
    toast.error('Error durante el proceso de eliminación');
    return false;
  }
};
