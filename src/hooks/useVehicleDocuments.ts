
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export interface VehicleDocument {
  id: string;
  file_name: string | null;
  document_type: string;
  document_url: string | null;
  vehicle_id: string | null;
  created_at: string | null;
  expiry_date: string | null;
  verified: boolean | null;
}

export const useVehicleDocuments = (vehicleId: string) => {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);

  const { data: documents, refetch, isLoading } = useQuery({
    queryKey: ['vehicle-documents', vehicleId],
    queryFn: async (): Promise<VehicleDocument[]> => {
      console.log('Fetching documents for vehicle:', vehicleId);
      if (!vehicleId) return [];
      
      const { data, error } = await supabase
        .from('vehicle_documents')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicle documents:', error);
        toast.error(t('common.errorFetchingData'));
        return [];
      }
      
      console.log('Documents found:', data?.length || 0, data);
      return data || [];
    },
    enabled: !!vehicleId
  });

  const uploadDocument = async (file: File) => {
    try {
      console.log('Uploading document:', file.name, 'for vehicle:', vehicleId);
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${vehicleId}/${fileName}`;

      console.log('Uploading to path:', filePath);
      
      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('vehicles')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError);
        toast.error(t('vehicles.fileUploadError'));
        throw uploadError;
      }

      console.log('File uploaded successfully, getting public URL');
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicles')
        .getPublicUrl(filePath);
        
      console.log('Public URL obtained:', publicUrl);

      // Insert record in database
      const { error: dbError, data: insertedDoc } = await supabase
        .from('vehicle_documents')
        .insert({
          vehicle_id: vehicleId,
          file_name: file.name,
          document_type: file.type || 'other',
          document_url: publicUrl
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error inserting document record:', dbError);
        toast.error(t('vehicles.fileUploadError'));
        throw dbError;
      }
      
      console.log('Document record inserted successfully:', insertedDoc);

      await refetch();
      toast.success(t('vehicles.fileUploadSuccess'));
      return insertedDoc;
    } catch (error) {
      console.error('Error in uploadDocument function:', error);
      toast.error(t('vehicles.fileUploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      console.log('Deleting document:', documentId);
      
      // Find the document first to get the file path
      const { data: document, error: fetchError } = await supabase
        .from('vehicle_documents')
        .select('*')
        .eq('id', documentId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching document to delete:', fetchError);
        toast.error(t('vehicles.fileDeleteError'));
        return;
      }
      
      // Extract storage path from URL
      if (document && document.document_url) {
        const url = new URL(document.document_url);
        const pathParts = url.pathname.split('/');
        // The last two segments typically represent the storage path in our case
        const storagePath = `${vehicleId}/${pathParts[pathParts.length - 1]}`;
        
        console.log('Attempting to delete storage file at path:', storagePath);
        
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('vehicles')
          .remove([storagePath]);
          
        if (storageError) {
          console.error('Error removing file from storage:', storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('vehicle_documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        console.error('Error deleting document from database:', error);
        throw error;
      }
      
      console.log('Document deleted successfully');
      await refetch();
      toast.success(t('vehicles.fileDeleteSuccess'));
    } catch (error) {
      console.error('Error in deleteDocument function:', error);
      toast.error(t('vehicles.fileDeleteError'));
    }
  };

  return {
    documents: documents || [],
    isLoading,
    isUploading,
    uploadDocument,
    deleteDocument
  };
};
