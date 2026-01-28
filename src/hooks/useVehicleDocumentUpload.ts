
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export const useVehicleDocumentUpload = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleAdditionalFileUploads = async (files: FileList, vehicleId: string) => {
    console.log(`Processing ${files.length} additional files for upload`);
    
    const filePromises = Array.from(files).map(async (file, index) => {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${index}.${fileExt}`;
        const filePath = `${vehicleId}/${fileName}`;
        
        console.log(`Uploading file ${index+1}/${files.length}: ${filePath}`);
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('vehicles')
          .upload(filePath, file);
          
        if (uploadError) {
          console.error(`Error uploading file ${index}:`, uploadError);
          return null;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('vehicles')
          .getPublicUrl(filePath);
          
        console.log(`File ${index+1} uploaded successfully, URL: ${publicUrl}`);
        
        // Insert record in database
        const { error: docInsertError } = await supabase
          .from('vehicle_documents')
          .insert({
            vehicle_id: vehicleId,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_url: publicUrl,
            uploaded_by: user?.id
          });
          
        if (docInsertError) {
          console.error(`Error inserting document record ${index}:`, docInsertError);
          return null;
        }
        
        return publicUrl;
      } catch (err) {
        console.error(`Error processing file ${index}:`, err);
        return null;
      }
    });
    
    const uploadedFiles = await Promise.all(filePromises);
    const successfulUploads = uploadedFiles.filter(url => url !== null).length;
    
    if (successfulUploads < files.length) {
      toast.warning(`${successfulUploads} of ${files.length} files uploaded successfully`);
    } else if (successfulUploads > 0) {
      toast.success(t('vehicles.fileUploadSuccess'));
    }
  };

  return { handleAdditionalFileUploads };
};
