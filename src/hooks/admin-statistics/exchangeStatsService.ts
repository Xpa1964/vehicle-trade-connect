
import { supabase } from '@/integrations/supabase/client';

export const getExchangesCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('exchanges')
      .select('*', { count: 'exact', head: true });
      
    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error("[exchangeStatsService] Error fetching exchanges:", err);
    return 0;
  }
};

export const getExchangesChangeRate = async (): Promise<number> => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const { count, error } = await supabase
      .from('exchanges')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneMonthAgo.toISOString());
      
    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error("[exchangeStatsService] Error calculating exchanges growth:", err);
    return 0;
  }
};
