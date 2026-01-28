import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAPIKeyRequests = () => {
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['api-key-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_key_requests')
        .select(`
          *,
          profiles:user_id (
            email,
            company_name
          ),
          reviewer:reviewed_by (
            email,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return { requests, isLoading, error };
};
