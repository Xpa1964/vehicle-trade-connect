
import { supabase } from '@/integrations/supabase/client';
import { VehicleFormData } from '@/types/vehicle';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  mapFormDataToVehicle, 
  mapMetadataToDatabase,
  mapTechnicalSpecsToDatabase,
  validateFormData 
} from '@/services/vehicleDataMapper';

/**
 * Hook for updating vehicle data - simplified image upload
 */
export const useVehicleUpdater = () => {
  const { t } = useLanguage();

  /**
   * Direct image upload - bypasses complex service layers that fail silently
   */
  const uploadImagesDirect = async (images: File[], vehicleId: string) => {
    const results = { successful: [] as string[], failed: 0, errors: [] as string[] };
    let thumbnailUrl: string | null = null;

    for (let index = 0; index < images.length; index++) {
      const file = images[index];
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${index}.${fileExt}`;
        const filePath = `${vehicleId}/${fileName}`;

        console.log(`🖼️ [uploadImagesDirect] Uploading ${index + 1}/${images.length}: ${file.name} (${(file.size/1024).toFixed(1)}KB)`);

        const { error: uploadError } = await supabase.storage
          .from('vehicles')
          .upload(filePath, file);

        if (uploadError) {
          console.error(`❌ [uploadImagesDirect] Storage upload failed:`, uploadError);
          results.failed++;
          results.errors.push(`${file.name}: ${uploadError.message}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('vehicles')
          .getPublicUrl(filePath);

        console.log(`✅ [uploadImagesDirect] Storage OK: ${publicUrl}`);

        if (index === 0) thumbnailUrl = publicUrl;

        const { error: dbError } = await supabase
          .from('vehicle_images')
          .insert({
            vehicle_id: vehicleId,
            image_url: publicUrl,
            is_primary: index === 0,
            display_order: index
          });

        if (dbError) {
          console.error(`❌ [uploadImagesDirect] DB insert failed:`, dbError);
          results.failed++;
          results.errors.push(`${file.name}: Error registro DB - ${dbError.message}`);
          continue;
        }

        results.successful.push(publicUrl);
        console.log(`✅ [uploadImagesDirect] Image ${index + 1} complete`);
      } catch (err) {
        console.error(`❌ [uploadImagesDirect] Exception:`, err);
        results.failed++;
        results.errors.push(`${file.name}: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      }
    }

    // Update thumbnail
    if (thumbnailUrl) {
      await supabase.from('vehicles').update({ thumbnailurl: thumbnailUrl }).eq('id', vehicleId);
    }

    return results;
  };

  const updateVehicle = async (id: string, formData: VehicleFormData) => {
    try {
      console.log('🚀 [useVehicleUpdater] Starting vehicle update for ID:', id);
      
      // Extract images FIRST before any processing
      let imagesToUpload: File[] = [];
      if (formData.images) {
        if (formData.images instanceof FileList) {
          imagesToUpload = Array.from(formData.images);
        } else if (Array.isArray(formData.images)) {
          imagesToUpload = formData.images.filter(f => f instanceof File);
        }
      }
      console.log(`📸 [useVehicleUpdater] Images to upload: ${imagesToUpload.length}`, 
        imagesToUpload.map(f => `${f.name} (${(f.size/1024).toFixed(1)}KB)`));
      
      // Validate form data
      if (!validateFormData(formData)) {
        throw new Error('Form validation failed');
      }
      
      // Map form data to vehicles table format
      const vehicleData = mapFormDataToVehicle(formData);
      
      // Update main vehicle record
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
      
      console.log('✅ [useVehicleUpdater] Vehicle record updated');
      
      // Update metadata
      const metadataPayload = mapMetadataToDatabase(formData, id);
      const { error: metadataError } = await supabase
        .from('vehicle_metadata')
        .upsert(metadataPayload);
      if (metadataError) console.warn('⚠️ Metadata update error:', metadataError);
      
      // Update technical specs
      const technicalSpecs = mapTechnicalSpecsToDatabase(formData);
      if (Object.keys(technicalSpecs).length > 0 || formData.description) {
        const { error: infoError } = await supabase
          .from('vehicle_information')
          .upsert({
            vehicle_id: id,
            technical_specs: technicalSpecs,
            additional_notes: formData.description || null
          });
        if (infoError) console.warn('⚠️ Vehicle info update error:', infoError);
      }
      
      // Update equipment
      if (formData.equipment) {
        await supabase.from('vehicle_equipment').delete().eq('vehicle_id', id);
        if (formData.equipment.length > 0) {
          const equipmentItems = formData.equipment.map(optionKey => ({
            vehicle_id: id,
            name: optionKey,
          }));
          const { error: equipmentError } = await supabase
            .from('vehicle_equipment')
            .insert(equipmentItems);
          if (equipmentError) console.warn('⚠️ Equipment update error:', equipmentError);
        }
      }
      
      // Handle damages
      if (formData.damages && formData.damages.length > 0) {
        // Delete existing damage images first
        const { data: existingDamages } = await supabase
          .from('vehicle_damages')
          .select('id')
          .eq('vehicle_id', id);
        
        if (existingDamages && existingDamages.length > 0) {
          for (const d of existingDamages) {
            await supabase.from('vehicle_damage_images').delete().eq('damage_id', d.id);
          }
        }
        
        await supabase.from('vehicle_damages').delete().eq('vehicle_id', id);
        
        for (const damage of formData.damages) {
          const damageData = {
            vehicle_id: id,
            damage_type: damage.damage_type || damage.title || 'other',
            description: damage.description || null,
            severity: damage.severity || 'minor',
            location: damage.location || null,
            repair_cost: damage.estimated_cost || null
          };
          
          const { data: insertedDamage, error: damageError } = await supabase
            .from('vehicle_damages')
            .insert(damageData)
            .select()
            .single();
          
          if (damageError) {
            console.warn('⚠️ Damages insert error:', damageError);
            continue;
          }
          
          // Upload damage images
          if (damage.images && damage.images.length > 0) {
            for (let i = 0; i < damage.images.length; i++) {
              const file = damage.images[i];
              const fileExt = file.name.split('.').pop() || 'jpg';
              const fileName = `damage-${Date.now()}-${i}.${fileExt}`;
              const filePath = `${id}/damages/${fileName}`;
              
              const { error: uploadError } = await supabase.storage
                .from('vehicles')
                .upload(filePath, file);
              
              if (uploadError) {
                console.error('❌ Damage image upload error:', uploadError);
                continue;
              }
              
              const { data: { publicUrl } } = supabase.storage
                .from('vehicles')
                .getPublicUrl(filePath);
              
              await supabase.from('vehicle_damage_images').insert({
                damage_id: insertedDamage.id,
                image_url: publicUrl,
                display_order: i,
                description: file.name
              });
              
              // Set first image as main image_url
              if (i === 0) {
                await supabase.from('vehicle_damages')
                  .update({ image_url: publicUrl })
                  .eq('id', insertedDamage.id);
              }
            }
          }
        }
        console.log('✅ Damages updated with images');
      }
      
      // DIRECT IMAGE UPLOAD - simple path, no complex service layers
      if (imagesToUpload.length > 0) {
        console.log('🖼️ [useVehicleUpdater] Starting DIRECT image upload...');
        const uploadResult = await uploadImagesDirect(imagesToUpload, id);
        
        console.log(`🖼️ [useVehicleUpdater] Upload result: ${uploadResult.successful.length} OK, ${uploadResult.failed} failed`);
        
        if (uploadResult.failed > 0) {
          uploadResult.errors.forEach(err => toast.error(err));
        }
        
        if (uploadResult.successful.length > 0) {
          toast.success(`${uploadResult.successful.length} imagen(es) subida(s) correctamente`);
        } else {
          toast.error('No se pudo subir ninguna imagen');
        }
      } else {
        console.log('ℹ️ [useVehicleUpdater] No images to upload');
      }
      
      console.log('🎉 [useVehicleUpdater] Vehicle update completed');
      return updatedVehicle;
      
    } catch (error) {
      console.error('❌ [useVehicleUpdater] Critical error:', error);
      toast.error(t('vehicles.updateError', { fallback: 'Error updating vehicle' }));
      throw error;
    }
  };

  return { updateVehicle };
};
