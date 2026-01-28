
import { supabase } from '@/integrations/supabase/client';

export const getAverageTransactionValue = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount')
      .eq('status', 'completed')
      .not('amount', 'is', null);
      
    if (error) throw error;
    
    if (!data || data.length === 0) return 0;
    
    const total = data.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
    const average = total / data.length;
    
    return Math.round(average);
  } catch (err) {
    console.error("[financialStatsService] Error calculating average transaction value:", err);
    return 0;
  }
};

export const getMonthlyCommissions = async () => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('transactions')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', startOfMonth.toISOString())
      .not('amount', 'is', null);
      
    if (error) throw error;
    
    if (!data || data.length === 0) return 0;
    
    // Calculate 3% commission on completed transactions
    const totalCommissions = data.reduce((sum, transaction) => {
      const commissionRate = 0.03; // 3%
      return sum + ((transaction.amount || 0) * commissionRate);
    }, 0);
    
    return Math.round(totalCommissions);
  } catch (err) {
    console.error("[financialStatsService] Error calculating monthly commissions:", err);
    return 0;
  }
};

export const getCommissionGrowthRate = async () => {
  try {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    
    // Get current month commissions
    const { data: currentData, error: currentError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', currentMonth.toISOString())
      .not('amount', 'is', null);
    
    // Get last month commissions
    const { data: lastData, error: lastError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', lastMonth.toISOString())
      .lt('created_at', currentMonth.toISOString())
      .not('amount', 'is', null);
    
    if (currentError || lastError) throw currentError || lastError;
    
    const currentCommissions = (currentData || []).reduce((sum, t) => sum + ((t.amount || 0) * 0.03), 0);
    const lastCommissions = (lastData || []).reduce((sum, t) => sum + ((t.amount || 0) * 0.03), 0);
    
    if (lastCommissions === 0) return currentCommissions > 0 ? 100 : 0;
    
    const growthRate = ((currentCommissions - lastCommissions) / lastCommissions) * 100;
    return Math.round(growthRate * 10) / 10;
  } catch (err) {
    console.error("[financialStatsService] Error calculating commission growth:", err);
    return 0;
  }
};
