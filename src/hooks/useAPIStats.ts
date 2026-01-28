import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAPIStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['api-stats'],
    queryFn: async () => {
      const { data: keys, error } = await supabase
        .from('partner_api_keys')
        .select('id, is_active, request_count, user_id');

      if (error) throw error;

      const totalKeys = keys.length;
      const activeKeys = keys.filter(k => k.is_active).length;
      const totalUsers = new Set(keys.map(k => k.user_id)).size;
      const totalRequests = keys.reduce((sum, k) => sum + (k.request_count || 0), 0);

      return {
        totalKeys,
        activeKeys,
        totalUsers,
        totalRequests
      };
    }
  });

  return { stats, isLoading };
};
