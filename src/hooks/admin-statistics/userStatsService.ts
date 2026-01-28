import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  total: number;
  active: number;
  admins: number;
  registered_today: number;
}

export const fetchUserStatistics = async (): Promise<UserStats> => {
  try {
    console.log('[userStatsService] Fetching user statistics via Supabase client');
    
    const { data, error } = await supabase.functions.invoke('admin-users/get-user-stats', {
      method: 'GET'
    });

    if (error) {
      console.error('[userStatsService] Error from edge function:', error);
      throw error;
    }

    console.log('[userStatsService] Successfully fetched user statistics:', data);
    return data as UserStats;
  } catch (e) {
    console.error('[userStatsService] Error fetching user statistics:', e);
    throw e;
  }
};
