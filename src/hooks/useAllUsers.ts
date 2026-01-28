import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAllUsers = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, company_name, full_name')
        .order('company_name', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  return { users, isLoading, error };
};
