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
      const bucketName = 'vehicles';
      
      // First check if bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucketName);
      
      if (bucketError && bucketError.message.includes('not found')) {
        console.log('Vehicles bucket not found, attempting to create it');
        const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB in bytes
        });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          toast.error("Couldn't create storage bucket. Please contact support.");
          setIsUploading(false);
          return;
        }
        console.log('Successfully created vehicles bucket');
      }
      
      let successCount = 0;
      
      for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];
        setProgress(Math.floor((i / vehicles.length) * 100));
        
        // Create vehicle record first
        const vehicleData = {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          mileage: vehicle.mileage,
          location: vehicle.location,
          user_id: user.id,
          seller_id: user.id,
          status: vehicle.status || 'available',
          type: vehicle.fuel || 'gasoline',
          condition: 'new',
          description: `${vehicle.brand} ${vehicle.model} - ${vehicle.fuel || 'gasoline'}, ${vehicle.transmission || 'manual'}`
        };

        const { data: insertedVehicle, error: insertError } = await supabase
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
            
            if (image.size > 5 * 1024 * 1024) {
              console.error(`Image too large: ${(image.size/1024/1024).toFixed(2)}MB`);
              toast.error(`Image ${j+1} is too large (max 5MB)`);
              continue;
            }
            
            try {
              const fileExt = image.name.split('.').pop();
              const fileName = `${Date.now()}-${j}.${fileExt}`;
              const filePath = `${insertedVehicle.id}/${fileName}`;
              
              const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, image);
                
              if (uploadError) {
                console.error(`Error uploading image ${j}:`, uploadError);
                continue;
              }
              
              const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

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
