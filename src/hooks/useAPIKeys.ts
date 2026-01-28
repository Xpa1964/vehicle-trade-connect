import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAPIKeys = () => {
  const { data: apiKeys, isLoading, error } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data: keys, error: keysError } = await supabase
        .from('partner_api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (keysError) throw keysError;

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, company_name');

      if (profilesError) throw profilesError;

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return keys?.map(key => ({
        ...key,
        user_email: profilesMap.get(key.user_id)?.email,
        company_name: profilesMap.get(key.user_id)?.company_name
      })) || [];
    }
  });

  return { apiKeys, isLoading, error };
};
