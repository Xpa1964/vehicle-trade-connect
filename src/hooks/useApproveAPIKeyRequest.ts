import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useApproveAPIKeyRequest = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({ requestId, keyName }: { requestId: string; keyName: string }) => {
      const { data, error } = await supabase.rpc('approve_api_key_request', {
        p_request_id: requestId,
        p_key_name: keyName
      });

      if (error) throw error;
      
      const result = data as any;
      if (!result?.success) throw new Error(result?.message || 'Failed to approve');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-key-requests'] });
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      queryClient.invalidateQueries({ queryKey: ['api-stats'] });
      toast.success(t('api.approve.successMessage') || 'API key request approved');
    },
    onError: (error: any) => {
      console.error('Error approving API key request:', error);
      toast.error(error.message || t('api.approve.errorMessage') || 'Failed to approve request');
    }
  });
};

export const useRejectAPIKeyRequest = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
      const { data, error } = await supabase.rpc('reject_api_key_request', {
        p_request_id: requestId,
        p_rejection_reason: reason
      });

      if (error) throw error;
      
      const result = data as any;
      if (!result?.success) throw new Error(result?.message || 'Failed to reject');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-key-requests'] });
      toast.success(t('api.reject.successMessage') || 'API key request rejected');
    },
    onError: (error: any) => {
      console.error('Error rejecting API key request:', error);
      toast.error(error.message || t('api.reject.errorMessage') || 'Failed to reject request');
    }
  });
};
