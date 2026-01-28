
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { VehicleFormData } from '@/types/vehicle';

export const useVehicleSubmit = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleVehicleSubmit = async (data: VehicleFormData) => {
    console.log('🚀 [useVehicleSubmit] Starting vehicle submission with data:', data);
    
    if (!user) {
      console.error('❌ [useVehicleSubmit] No user authenticated');
      toast.error(t('auth.notAuthenticated', { fallback: 'You must be logged in' }));
      return null;
    }

    setLoading(true);
    
    try {
      const vehicleId = uuidv4();
      console.log('🆔 [useVehicleSubmit] Generated vehicle ID:', vehicleId);
      
      // Prepare vehicle data with proper date formatting
      const vehicleData = {
        id: vehicleId,
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        mileage: data.mileage,
        location: `${data.location}, ${data.country}`,
        country: data.country,
        country_code: data.countryCode,
        status: data.status || 'available',
        type: data.fuel,
        condition: 'used', // Default value
        description: data.description || '',
        user_id: user.id,
        
        // Campos adicionales
        fuel: data.fuel,
        transmission: data.transmission,
        vin: data.vin,
        license_plate: data.licensePlate,
        registration_date: data.registrationDate ? data.registrationDate.toISOString().split('T')[0] : null,
        vehicle_type: data.vehicleType,
        transaction_type: data.transactionType,
        accepts_exchange: data.acceptsExchange || false,
        engine_size: data.engineSize,
        engine_power: data.enginePower,
        color: data.color,
        doors: data.doors,
      };

      console.log('📝 [useVehicleSubmit] Vehicle data to insert:', vehicleData);

      // Insert vehicle data
      const { data: insertedVehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select()
        .single();
        
      if (vehicleError) {
        console.error('❌ [useVehicleSubmit] Error inserting vehicle:', vehicleError);
        throw vehicleError;
      }
      
      console.log('✅ [useVehicleSubmit] Vehicle inserted successfully:', insertedVehicle);
      
      // Insert metadata
      const metadataData = {
        vehicle_id: vehicleId,
        mileage_unit: data.mileageUnit,
        units: data.units,
        iva_status: data.ivaStatus,
        coc_status: data.cocStatus
      };
      
      console.log('📝 [useVehicleSubmit] Metadata to insert:', metadataData);
      
      const { error: metadataError } = await supabase
        .from('vehicle_metadata')
        .insert(metadataData);
        
      if (metadataError) {
        console.error('⚠️ [useVehicleSubmit] Error inserting vehicle metadata:', metadataError);
      } else {
        console.log('✅ [useVehicleSubmit] Metadata inserted successfully');
      }
      
      // Handle equipment if provided
      if (data.equipment && data.equipment.length > 0) {
        console.log('🔧 [useVehicleSubmit] Processing equipment:', data.equipment);
        const equipmentItems = data.equipment.map(equipmentId => ({
          vehicle_id: vehicleId,
          equipment_id: equipmentId
        }));
        
        const { error: equipmentError } = await supabase
          .from('vehicle_equipment')
          .insert(equipmentItems);
          
        if (equipmentError) {
          console.error('⚠️ [useVehicleSubmit] Error inserting equipment:', equipmentError);
        } else {
          console.log('✅ [useVehicleSubmit] Equipment inserted successfully');
        }
      }
      
      // Handle damages if provided
      if (data.damages && data.damages.length > 0) {
        console.log('🔧 [useVehicleSubmit] Processing damages:', data.damages.length, 'damages');
        await handleDamagesUpload(data.damages, vehicleId);
      }
      
      // Handle image uploads if available
      if (data.images && data.images.length > 0) {
        console.log('🖼️ [useVehicleSubmit] Processing images:', data.images.length, 'images');
        await handleImageUploads(data.images, vehicleId);
      }
      
      // Handle additional files if available
      if (data.additionalFiles && data.additionalFiles.length > 0) {
        console.log('📎 [useVehicleSubmit] Processing additional files:', data.additionalFiles.length, 'files');
        // Implementation for additional files upload would go here
      }
      
      // Verify vehicle was saved by querying it back
      const { data: savedVehicle, error: queryError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();
        
      if (queryError) {
        console.error('❌ [useVehicleSubmit] Error verifying saved vehicle:', queryError);
      } else {
        console.log('✅ [useVehicleSubmit] Vehicle verification - saved successfully:', savedVehicle);
      }
      
      toast.success(t('vehicles.createSuccess', { fallback: 'Vehicle created successfully' }));
      console.log('🎉 [useVehicleSubmit] Vehicle submission completed successfully');
      return { id: vehicleId };
    } catch (error) {
      console.error('❌ [useVehicleSubmit] Error submitting vehicle:', error);
      toast.error(t('vehicles.createError', { fallback: 'Error creating vehicle' }));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleDamagesUpload = async (damages: any[], vehicleId: string) => {
    try {
      console.log('🔧 [handleDamagesUpload] Starting damages upload for vehicle:', vehicleId);
      
      for (const damage of damages) {
        // Insert damage record
        const damageData = {
          vehicle_id: vehicleId,
          damage_type: damage.damage_type,
          title: damage.title,
          description: damage.description || null,
          severity: damage.severity,
          location: damage.location || null,
          estimated_cost: damage.estimated_cost || null
        };
        
        console.log('🔧 [handleDamagesUpload] Inserting damage:', damageData);
        
        const { data: insertedDamage, error: damageError } = await supabase
          .from('vehicle_damages')
          .insert(damageData)
          .select()
          .single();
          
        if (damageError) {
          console.error('❌ [handleDamagesUpload] Error inserting damage:', damageError);
          continue;
        }
        
        console.log('✅ [handleDamagesUpload] Damage inserted successfully:', insertedDamage);
        
        // Handle damage images if provided
        if (damage.images && damage.images.length > 0) {
          console.log('🖼️ [handleDamagesUpload] Processing damage images:', damage.images.length);
          await handleDamageImagesUpload(damage.images, insertedDamage.id, vehicleId);
        }
      }
      
      console.log('🎉 [handleDamagesUpload] All damages processed successfully');
    } catch (err) {
      console.error('❌ [handleDamagesUpload] Error uploading damages:', err);
    }
  };

  const handleDamageImagesUpload = async (images: File[], damageId: string, vehicleId: string) => {
    try {
      console.log('🖼️ [handleDamageImagesUpload] Starting damage images upload for damage:', damageId);
      
      const imagePromises = images.map(async (file, index) => {
        try {
          console.log(`🖼️ [handleDamageImagesUpload] Processing image ${index + 1}/${images.length}:`, file.name);
          const fileExt = file.name.split('.').pop();
          const fileName = `damage-${Date.now()}-${index}.${fileExt}`;
          const filePath = `${vehicleId}/damages/${fileName}`;
          
          // Upload the file to storage
          const { error: uploadError } = await supabase.storage
            .from('vehicles')
            .upload(filePath, file);
            
          if (uploadError) {
            console.error(`❌ [handleDamageImagesUpload] Error uploading image ${index}:`, uploadError);
            return null;
          }
          
          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('vehicles')
            .getPublicUrl(filePath);
          
          console.log(`✅ [handleDamageImagesUpload] Image ${index} uploaded successfully:`, publicUrl);
          
          // Add to vehicle_damage_images table
          const { error: imageInsertError } = await supabase
            .from('vehicle_damage_images')
            .insert({
              damage_id: damageId,
              image_url: publicUrl,
              display_order: index,
              description: file.name
            });
            
          if (imageInsertError) {
            console.error(`❌ [handleDamageImagesUpload] Error inserting image record ${index}:`, imageInsertError);
            return null;
          }
          
          return publicUrl;
        } catch (err) {
          console.error(`❌ [handleDamageImagesUpload] Error processing image ${index}:`, err);
          return null;
        }
      });
      
      await Promise.all(imagePromises);
      console.log('🎉 [handleDamageImagesUpload] All damage images processed successfully');
    } catch (err) {
      console.error('❌ [handleDamageImagesUpload] Error uploading damage images:', err);
    }
  };

  const handleImageUploads = async (images: FileList, vehicleId: string) => {
    try {
      console.log('🖼️ [handleImageUploads] Starting image uploads for vehicle:', vehicleId);
      let thumbnailUrl: string | null = null;
      
      const imagePromises = Array.from(images).map(async (file, index) => {
        try {
          console.log(`🖼️ [handleImageUploads] Processing image ${index + 1}/${images.length}:`, file.name);
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${index}.${fileExt}`;
          const filePath = `${vehicleId}/${fileName}`;
          
          // Upload the file to storage
          const { error: uploadError } = await supabase.storage
            .from('vehicles')
            .upload(filePath, file);
            
          if (uploadError) {
            console.error(`❌ [handleImageUploads] Error uploading image ${index}:`, uploadError);
            return null;
          }
          
          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('vehicles')
            .getPublicUrl(filePath);
          
          console.log(`✅ [handleImageUploads] Image ${index} uploaded successfully:`, publicUrl);
          
          // Store URL for the first image to use as thumbnail
          if (index === 0) {
            thumbnailUrl = publicUrl;
          }
          
          // Add to vehicle_images table
          const { error: imageInsertError } = await supabase
            .from('vehicle_images')
            .insert({
              vehicle_id: vehicleId,
              image_url: publicUrl,
              is_primary: index === 0,
              display_order: index
            });
            
          if (imageInsertError) {
            console.error(`❌ [handleImageUploads] Error inserting image record ${index}:`, imageInsertError);
            return null;
          }
          
          return publicUrl;
        } catch (err) {
          console.error(`❌ [handleImageUploads] Error processing image ${index}:`, err);
          return null;
        }
      });
      
      await Promise.all(imagePromises);
      
      // Update vehicle with thumbnail URL
      if (thumbnailUrl) {
        console.log('🖼️ [handleImageUploads] Setting thumbnail URL:', thumbnailUrl);
        const { error: thumbnailError } = await supabase
          .from('vehicles')
          .update({ thumbnailurl: thumbnailUrl })
          .eq('id', vehicleId);
          
        if (thumbnailError) {
          console.error('❌ [handleImageUploads] Error updating vehicle thumbnail:', thumbnailError);
        } else {
          console.log('✅ [handleImageUploads] Thumbnail updated successfully');
        }
      }
      
      console.log('🎉 [handleImageUploads] All images processed successfully');
    } catch (err) {
      console.error('❌ [handleImageUploads] Error uploading images:', err);
    }
  };

  return { handleVehicleSubmit, loading };
};
