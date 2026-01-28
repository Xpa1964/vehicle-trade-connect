
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types/announcement';
import { useToast } from '@/hooks/use-toast';

export const useAnnouncementDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [authorName, setAuthorName] = useState<string | null>(null);

  // Fetch announcement details
  const { 
    data: announcement, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['announcement', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching announcement:', error);
        throw error;
      }
      
      return {
        ...data,
        status: (data as any).status || 'active',
        type: (data as any).type || 'announcement',
        category: (data as any).category || 'general'
      } as Announcement;
    },
  });

  // Fetch user info for author name
  useEffect(() => {
    const fetchAuthorName = async () => {
      if (announcement?.user_id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name, company_name')
            .eq('id', announcement.user_id)
            .single();
          
          if (data) {
            setAuthorName(data.full_name || data.company_name || 'Anonymous User');
          } else {
            setAuthorName('Anonymous User');
          }
        } catch (err) {
          console.error('Error fetching author info:', err);
          setAuthorName('Anonymous User');
        }
      }
    };
    
    fetchAuthorName();
  }, [announcement]);

  // Handle delete functionality
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Announcement deleted successfully',
        description: 'Your announcement has been deleted.',
        variant: "default",
      });
      navigate('/bulletin');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: 'Error deleting announcement',
        description: 'There was an error deleting your announcement.',
        variant: "destructive",
      });
    }
  };

  return {
    announcement,
    isLoading,
    error,
    refetch,
    authorName,
    contactDialogOpen,
    setContactDialogOpen,
    handleDelete
  };
};
