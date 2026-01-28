
import { supabase } from '@/integrations/supabase/client';

export const fetchTransactionStatistics = async () => {
  try {
    // Get total transactions count
    const { count, error: potentialTransactionsError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });
      
    if (potentialTransactionsError) throw potentialTransactionsError;
    const potentialTransactionsCount = count || 0;
    
    // Get completed transactions count
    const { count: completedCount, error: completedTransactionsError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');
      
    if (completedTransactionsError) throw completedTransactionsError;
    const completedTransactionsCount = completedCount || 0;
    
    return { potential: potentialTransactionsCount, completed: completedTransactionsCount };
  } catch (e) {
    console.error('[transactionStatsService] Error fetching transaction statistics:', e);
    return { potential: 0, completed: 0 };
  }
};
