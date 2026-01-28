import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAPISyncLogs = (apiKeyId: string) => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['api-sync-logs', apiKeyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_sync_logs')
        .select('*')
        .eq('api_key_id', apiKeyId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!apiKeyId
  });

  return { logs, isLoading };
};
