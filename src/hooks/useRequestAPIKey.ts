import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useRequestAPIKey = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({ name, reason }: { name: string; reason?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('api_key_requests')
        .insert({
          user_id: user.id,
          name,
          reason,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-key-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-api-key-requests'] });
      toast.success(t('api.request.successMessage') || 'API key request submitted successfully');
    },
    onError: (error) => {
      console.error('Error requesting API key:', error);
      toast.error(t('api.request.errorMessage') || 'Failed to submit API key request');
    }
  });
};
