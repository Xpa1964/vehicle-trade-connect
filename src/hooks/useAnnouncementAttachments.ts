import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AnnouncementAttachment {
  id: string;
  announcement_id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
  updated_at?: string;
}

export const useAnnouncementAttachments = (announcementId?: string) => {
  const [attachments, setAttachments] = useState<AnnouncementAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAttachments = async () => {
    if (!announcementId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcement_attachments')
        .select('*')
        .eq('announcement_id', announcementId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching attachments:', error);
        throw error;
      }

      setAttachments(data || []);
    } catch (error) {
      console.error('Error in fetchAttachments:', error);
      toast.error('Error loading attachments');
    } finally {
      setLoading(false);
    }
  };

  const deleteAttachment = async (attachmentId: string) => {
    setDeleting(attachmentId);
    try {
      // Obtener datos del attachment antes de eliminarlo
      const { data: attachment, error: fetchError } = await supabase
        .from('announcement_attachments')
        .select('*')
        .eq('id', attachmentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Eliminar archivo del storage
      if (attachment.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('announcement_attachments')
          .remove([attachment.storage_path]);

        if (storageError) {
          console.warn('Error eliminando archivo del storage:', storageError);
        }
      }

      // Eliminar registro de la base de datos
      const { error: deleteError } = await supabase
        .from('announcement_attachments')
        .delete()
        .eq('id', attachmentId);

      if (deleteError) {
        throw deleteError;
      }

      // Actualizar estado local
      setAttachments(prev => prev.filter(att => att.id !== attachmentId));
      toast.success('Attachment deleted');
      
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error('Error deleting attachment');
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [announcementId]);

  return {
    attachments,
    loading,
    deleting,
    deleteAttachment,
    refetch: fetchAttachments
  };
};