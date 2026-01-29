
import { supabase } from '@/integrations/supabase/client';
import { VehicleFormData } from '@/types/vehicle';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVehicleImageHandler } from './useVehicleImageHandler';
import { 
  mapFormDataToVehicle, 
  mapMetadataToDatabase,
  mapTechnicalSpecsToDatabase,
  validateFormData 
} from '@/services/vehicleDataMapper';

/**
 * Hook for updating vehicle data with improved mapping
 */
export const useVehicleUpdater = () => {
  const { t } = useLanguage();
  const { handleImageUploads } = useVehicleImageHandler();

  const updateVehicle = async (id: string, formData: VehicleFormData) => {
    try {
      console.log('🚀 [useVehicleUpdater] Starting vehicle update for ID:', id);
      console.log('📋 [useVehicleUpdater] COMPLETE form data received:', formData);
      
      // Validate form data
      if (!validateFormData(formData)) {
        throw new Error('Form validation failed');
      }
      
      // Map form data to vehicles table format
      const vehicleData = mapFormDataToVehicle(formData);
      console.log('🎯 [useVehicleUpdater] Vehicle table update payload:', vehicleData);
      
      // Update main vehicle record
      console.log('💾 [useVehicleUpdater] Updating main vehicle record...');
      const { error: vehicleError, data: updatedVehicle } = await (supabase as any)
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)
        .select()
        .single();
      
      if (vehicleError) {
        console.error('❌ [useVehicleUpdater] Error updating vehicle:', vehicleError);
        throw vehicleError;
      }
      
      console.log('✅ [useVehicleUpdater] Vehicle record updated successfully:', updatedVehicle);
      
      // Update or insert metadata
      const metadataPayload = mapMetadataToDatabase(formData, id);
      console.log('💾 [useVehicleUpdater] Updating metadata with payload:', metadataPayload);
      
      const { error: metadataError } = await supabase
        .from('vehicle_metadata')
        .upsert(metadataPayload);
        
      if (metadataError) {
        console.error('⚠️ [useVehicleUpdater] Error updating metadata (non-critical):', metadataError);
      } else {
        console.log('✅ [useVehicleUpdater] Metadata updated successfully');
      }
      
      // Update vehicle information (technical specs)
      const technicalSpecs = mapTechnicalSpecsToDatabase(formData);
      console.log('📋 [useVehicleUpdater] Technical specs to update:', technicalSpecs);
      
      if (Object.keys(technicalSpecs).length > 0 || formData.description) {
        const { error: infoError } = await supabase
          .from('vehicle_information')
          .upsert({
            vehicle_id: id,
            technical_specs: technicalSpecs,
            additional_notes: formData.description || null
          });
        
        if (infoError) {
          console.error('⚠️ [useVehicleUpdater] Error updating vehicle information (non-critical):', infoError);
        } else {
          console.log('✅ [useVehicleUpdater] Vehicle information updated successfully');
        }
      }
      
      // Update equipment if provided
      if (formData.equipment && formData.equipment.length > 0) {
        console.log('🔧 [useVehicleUpdater] Updating equipment:', formData.equipment);
        
        // Remove existing equipment
        await supabase
          .from('vehicle_equipment')
          .delete()
          .eq('vehicle_id', id);
        
        // Add new equipment
        const equipmentItems = formData.equipment.map(equipmentId => ({
          vehicle_id: id,
          equipment_id: equipmentId,
          name: equipmentId // Required field
        }));
        
        const { error: equipmentError } = await supabase
          .from('vehicle_equipment')
          .insert(equipmentItems);
        
        if (equipmentError) {
          console.error('⚠️ [useVehicleUpdater] Error updating equipment (non-critical):', equipmentError);
        } else {
          console.log('✅ [useVehicleUpdater] Equipment updated successfully');
        }
      }
      
      // Handle damages if provided
      if (formData.damages && formData.damages.length > 0) {
        console.log('🔧 [useVehicleUpdater] Updating vehicle damages...');
        
        // Remove existing damages
        await supabase
          .from('vehicle_damages')
          .delete()
          .eq('vehicle_id', id);
        
        // Add new damages
        const damageItems = formData.damages.map(damage => ({
          vehicle_id: id,
          damage_type: damage.damage_type,
          title: damage.title,
          description: damage.description || null,
          severity: damage.severity,
          location: damage.location || null,
          estimated_cost: damage.estimated_cost || null
        }));
        
        const { error: damageError } = await supabase
          .from('vehicle_damages')
          .insert(damageItems);
        
        if (damageError) {
          console.error('⚠️ [useVehicleUpdater] Error updating damages (non-critical):', damageError);
        } else {
          console.log('✅ [useVehicleUpdater] Vehicle damages updated successfully');
        }
      }
      
      // Handle image uploads if available
      if (formData.images && formData.images.length > 0) {
        console.log('🖼️ [useVehicleUpdater] Processing image uploads...');
        const { data: existingImages } = await supabase
          .from('vehicle_images')
          .select('*')
          .eq('vehicle_id', id);
        
        await handleImageUploads(formData.images, id, existingImages?.length || 0);
        console.log('✅ [useVehicleUpdater] Images processed successfully');
      }
      
      // Handle additional files if available
      if (formData.additionalFiles && formData.additionalFiles.length > 0) {
        console.log('📎 [useVehicleUpdater] Additional files detected (implementation needed)');
      }
      
      console.log('🎉 [useVehicleUpdater] Vehicle update completed successfully');
      
      // Verificar que los datos se guardaron correctamente
      console.log('🔍 [useVehicleUpdater] Verifying saved data...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (verifyError) {
        console.error('❌ [useVehicleUpdater] Error verifying saved data:', verifyError);
      } else {
        console.log('✅ [useVehicleUpdater] Verified saved data:', verifyData);
      }
      
      return updatedVehicle;
      
    } catch (error) {
      console.error('❌ [useVehicleUpdater] Critical error in updateVehicle:', error);
      toast.error(t('vehicles.updateError', { fallback: 'Error updating vehicle' }));
      throw error;
    }
  };

  return { updateVehicle };
};
