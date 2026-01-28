import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useCreateAPIKey = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({ userId, name }: { userId: string; name: string }) => {
      const { data, error } = await supabase.rpc('generate_api_key');
      if (error) throw error;
      
      const apiKey = data as string;

      const { data: newKey, error: insertError } = await supabase
        .from('partner_api_keys')
        .insert({
          user_id: userId,
          api_key: apiKey,
          name: name,
          is_active: true
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return newKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      queryClient.invalidateQueries({ queryKey: ['api-stats'] });
      toast.success(t('api.create.successMessage'));
    },
    onError: (error) => {
      console.error('Error creating API key:', error);
      toast.error(t('api.create.errorMessage'));
    }
  });
};
