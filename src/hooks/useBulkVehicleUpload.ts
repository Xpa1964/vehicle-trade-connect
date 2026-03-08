import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { VehicleFormData } from '@/types/vehicle';
import { toast } from 'sonner';
import { CSVVehicleData, downloadImageFromUrl } from '@/utils/csvParser';
import { uploadFileSecurely } from '@/utils/secureUpload';

export const useBulkVehicleUpload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadVehicles = async (vehicles: (VehicleFormData | CSVVehicleData)[]) => {
    if (!user) {
      toast.error("You must be logged in to upload vehicles");
      return;
    }

    console.log(`Starting bulk upload of ${vehicles.length} vehicles for user ${user.id}`);
    setIsUploading(true);
    setProgress(0);
    
    try {
      let successCount = 0;
      
      for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];
        setProgress(Math.floor((i / vehicles.length) * 100));
        
        // Create vehicle record with all available fields
        const vehicleData: Record<string, any> = {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          mileage: vehicle.mileage,
          location: vehicle.location ? `${vehicle.location}${vehicle.country ? ', ' + vehicle.country : ''}` : '',
          country: vehicle.country || null,
          country_code: ('countryCode' in vehicle ? (vehicle as any).countryCode : null) || null,
          user_id: user.id,
          seller_id: user.id,
          status: vehicle.status || 'available',
          type: vehicle.fuel || 'gasoline',
          fuel: vehicle.fuel || 'gasoline',
          transmission: vehicle.transmission || 'manual',
          condition: 'used',
          description: vehicle.description || `${vehicle.brand} ${vehicle.model} - ${vehicle.fuel || 'gasoline'}, ${vehicle.transmission || 'manual'}`,

          // Technical specs
          vin: ('vin' in vehicle ? (vehicle as any).vin : null) || null,
          license_plate: ('licensePlate' in vehicle ? (vehicle as any).licensePlate : null) || null,
          vehicle_type: ('vehicleType' in vehicle ? (vehicle as any).vehicleType : null) || null,
          color: ('color' in vehicle ? (vehicle as any).color : null) || null,
          doors: ('doors' in vehicle ? (vehicle as any).doors : null) || null,
          engine_size: ('engineSize' in vehicle ? (vehicle as any).engineSize : null) || null,
          engine_power: ('enginePower' in vehicle ? (vehicle as any).enginePower : null) || null,

          // Transaction & exchange
          transaction_type: ('transactionType' in vehicle ? (vehicle as any).transactionType : null) || null,
          accepts_exchange: ('acceptsExchange' in vehicle ? (vehicle as any).acceptsExchange : false),

          // Emissions
          euro_standard: ('euroStandard' in vehicle ? (vehicle as any).euroStandard : null) || null,
          co2_emissions: ('co2Emissions' in vehicle ? (vehicle as any).co2Emissions : null) || null,

          // IVA & Commission
          commission_sale: ('commissionSale' in vehicle ? (vehicle as any).commissionSale : false),
          public_sale_price: ('publicSalePrice' in vehicle ? (vehicle as any).publicSalePrice : null) || null,
          commission_amount: ('commissionAmount' in vehicle ? (vehicle as any).commissionAmount : null) || null,
        };

        // Add IVA-related fields if present (cocStatus maps to a DB field if exists)
        if ('ivaStatus' in vehicle) {
          // ivaStatus is stored in metadata or handled by the form — check if column exists
          // The vehicles table doesn't have a direct iva_status column, but we keep for compatibility
        }
        if ('cocStatus' in vehicle && (vehicle as any).cocStatus !== undefined) {
          // cocStatus similarly handled
        }

        const { data: insertedVehicle, error: insertError } = await (supabase as any)
          .from('vehicles')
          .insert([vehicleData])
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting vehicle:', insertError);
          continue;
        }

        // Upload images if available (from FileList or URLs)
        let imagesToProcess: File[] = [];
        
        // Handle file uploads
        if ('images' in vehicle && vehicle.images && vehicle.images.length > 0) {
          imagesToProcess = Array.from(vehicle.images);
        }
        
        // Handle URL downloads
        if ('imageUrls' in vehicle && vehicle.imageUrls) {
          const urls = vehicle.imageUrls.split(';').filter(url => url.trim());
          console.log(`Downloading ${urls.length} images from URLs for vehicle: ${vehicle.brand} ${vehicle.model}`);
          
          for (const url of urls) {
            try {
              const downloadedFile = await downloadImageFromUrl(url.trim());
              if (downloadedFile) {
                imagesToProcess.push(downloadedFile);
              }
            } catch (error) {
              console.error(`Error downloading image from ${url}:`, error);
            }
          }
        }
        
        if (imagesToProcess.length > 0) {
          console.log(`Processing ${imagesToProcess.length} images for vehicle: ${vehicle.brand} ${vehicle.model}`);
          
          const maxImages = Math.min(25, imagesToProcess.length);
          
          for (let j = 0; j < maxImages; j++) {
            const image = imagesToProcess[j];
            if (!image) continue;
            
            if (image.size > 10 * 1024 * 1024) {
              console.error(`Image too large: ${(image.size/1024/1024).toFixed(2)}MB`);
              toast.error(`Image ${j+1} is too large (max 10MB)`);
              continue;
            }
            
            try {
              // Upload through secure-file-upload edge function
              const { publicUrl, error: uploadError } = await uploadFileSecurely(
                image,
                'vehicles',
                insertedVehicle.id
              );
                
              if (uploadError || !publicUrl) {
                console.error(`Error uploading image ${j}:`, uploadError);
                continue;
              }

              const { error: imageError } = await supabase
                .from('vehicle_images')
                .insert({
                  vehicle_id: insertedVehicle.id,
                  image_url: publicUrl,
                  is_primary: j === 0,
                  display_order: j
                });

              if (imageError) {
                console.error(`Error saving image record ${j}:`, imageError);
                continue;
              }

              console.log(`Successfully uploaded image ${j}: ${publicUrl}`);
            } catch (error) {
              console.error(`Error processing image ${j}:`, error);
            }
          }
        }

        successCount++;
        console.log(`Successfully uploaded vehicle: ${vehicle.brand} ${vehicle.model}`);
      }

      setProgress(100);
      toast.success(`${successCount} vehicles have been uploaded successfully`);

    } catch (error) {
      console.error('Error uploading vehicles:', error);
      toast.error("Failed to upload vehicles. Please try again.");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return { uploadVehicles, isUploading, progress };
};
