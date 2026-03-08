
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { VehicleFormData } from '@/types/vehicle';
import { uploadFileSecurely } from '@/utils/secureUpload';

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
        // CRITICAL: vehicles.seller_id is NOT NULL + enforced by RLS
        seller_id: user.id,

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

        // Keep user_id for analytics/ownership fields used elsewhere
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

        // Emissions & commission fields
        euro_standard: data.euroStandard || null,
        co2_emissions: data.co2Emissions || null,
        commission_sale: data.commissionSale || false,
        public_sale_price: data.publicSalePrice || null,
        commission_amount: data.commissionAmount || null,
        commission_query: data.commissionQuery || null,
      };

      console.log('📝 [useVehicleSubmit] Vehicle data to insert:', vehicleData);

      // Insert vehicle data
      const { data: insertedVehicle, error: vehicleError } = await (supabase as any)
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
      
      // Handle equipment if provided - store option keys
      if (data.equipment && data.equipment.length > 0) {
        console.log('🔧 [useVehicleSubmit] Processing equipment keys:', data.equipment);
        const equipmentItems = data.equipment.map(optionKey => ({
          vehicle_id: vehicleId,
          name: optionKey, // Store the option key
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
      if (data.images) {
        const imagesArray = data.images instanceof FileList ? Array.from(data.images) : Array.isArray(data.images) ? data.images : [];
        if (imagesArray.length > 0) {
          console.log('🖼️ [useVehicleSubmit] Processing images:', imagesArray.length, 'images');
          await handleImageUploads(imagesArray, vehicleId);
        }
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
    } catch (error: any) {
      console.error('❌ [useVehicleSubmit] Error submitting vehicle:', error);

      const details =
        error?.message ||
        error?.details ||
        error?.hint ||
        (typeof error === 'string' ? error : undefined);

      toast.error(t('vehicles.createError', { fallback: 'Error creating vehicle' }), {
        description: details,
      });

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
          damage_type: damage.damage_type || damage.title || 'other',
          description: damage.description || null,
          severity: damage.severity || 'minor',
          location: damage.location || null,
          repair_cost: damage.estimated_cost || null
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
          const imageUrls = await handleDamageImagesUpload(damage.images, insertedDamage.id, vehicleId);
          
          // Set first image as the main image_url on the damage record
          if (imageUrls && imageUrls.length > 0) {
            const { error: updateError } = await supabase
              .from('vehicle_damages')
              .update({ image_url: imageUrls[0] })
              .eq('id', insertedDamage.id);
            if (updateError) {
              console.error('❌ [handleDamagesUpload] Error setting damage image_url:', updateError);
            } else {
              console.log('✅ [handleDamagesUpload] Damage image_url set:', imageUrls[0]);
            }
          }
        }
      }
      
      console.log('🎉 [handleDamagesUpload] All damages processed successfully');
    } catch (err) {
      console.error('❌ [handleDamagesUpload] Error uploading damages:', err);
    }
  };

  const handleDamageImagesUpload = async (images: File[], damageId: string, vehicleId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    try {
      console.log('🖼️ [handleDamageImagesUpload] Starting damage images upload for damage:', damageId);
      
      for (let index = 0; index < images.length; index++) {
        const file = images[index];
        try {
          console.log(`🖼️ [handleDamageImagesUpload] Processing image ${index + 1}/${images.length}:`, file.name);

          const { publicUrl, error: uploadError } = await uploadFileSecurely(
            file,
            'vehicles',
            `damages`
          );
            
          if (uploadError || !publicUrl) {
            console.error(`❌ [handleDamageImagesUpload] Error uploading image ${index}:`, uploadError);
            continue;
          }
          
          console.log(`✅ [handleDamageImagesUpload] Image ${index} uploaded:`, publicUrl);
          
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
            continue;
          }
          
          uploadedUrls.push(publicUrl);
        } catch (err) {
          console.error(`❌ [handleDamageImagesUpload] Error processing image ${index}:`, err);
        }
      }
      
      console.log('🎉 [handleDamageImagesUpload] All damage images processed:', uploadedUrls.length, 'uploaded');
    } catch (err) {
      console.error('❌ [handleDamageImagesUpload] Error uploading damage images:', err);
    }
    return uploadedUrls;
  };

  const handleImageUploads = async (images: FileList | File[], vehicleId: string) => {
    try {
      console.log('🖼️ [handleImageUploads] Starting image uploads for vehicle:', vehicleId);
      let thumbnailUrl: string | null = null;
      
      const filesArray = Array.from(images);
      const imagePromises = filesArray.map(async (file, index) => {
        try {
          console.log(`🖼️ [handleImageUploads] Processing image ${index + 1}/${images.length}:`, file.name);

          // Upload through secure-file-upload edge function
          const { publicUrl, error: uploadError } = await uploadFileSecurely(
            file,
            'vehicles',
            vehicleId
          );
            
          if (uploadError || !publicUrl) {
            console.error(`❌ [handleImageUploads] Error uploading image ${index}:`, uploadError);
            return null;
          }
          
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
