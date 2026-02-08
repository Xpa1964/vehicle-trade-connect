
import { supabase } from '@/integrations/supabase/client';

export const calculateGrowthTrends = async () => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get user growth trend
    const { data: lastMonthUsers, error: lastMonthError } = await supabase
      .from('profiles')
      .select('id')
      .gte('created_at', lastMonth.toISOString())
      .lt('created_at', thisMonth.toISOString());
      
    const { data: thisMonthUsers, error: thisMonthError } = await supabase
      .from('profiles')
      .select('id')
      .gte('created_at', thisMonth.toISOString());
    
    if (lastMonthError || thisMonthError) {
      console.warn("Error fetching user trends:", lastMonthError || thisMonthError);
    }
    
    // Get vehicle listing trend
    const { data: lastMonthVehicles } = await supabase
      .from('vehicles')
      .select('id')
      .gte('created_at', lastMonth.toISOString())
      .lt('created_at', thisMonth.toISOString());
      
    const { data: thisMonthVehicles } = await supabase
      .from('vehicles')
      .select('id')
      .gte('created_at', thisMonth.toISOString());
    
    // Get auction activity trend
    const { data: lastMonthAuctions } = await supabase
      .from('auctions')
      .select('id')
      .gte('created_at', lastMonth.toISOString())
      .lt('created_at', thisMonth.toISOString());
      
    const { data: thisMonthAuctions } = await supabase
      .from('auctions')
      .select('id')
      .gte('created_at', thisMonth.toISOString());
    
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };
    
    return {
      userGrowth: calculateTrend(
        thisMonthUsers?.length || 0,
        lastMonthUsers?.length || 0
      ),
      vehicleListings: calculateTrend(
        thisMonthVehicles?.length || 0,
        lastMonthVehicles?.length || 0
      ),
      auctionActivity: calculateTrend(
        thisMonthAuctions?.length || 0,
        lastMonthAuctions?.length || 0
      )
    };
  } catch (err) {
    console.error("[trendAnalysisService] Error calculating trends:", err);
    return {
      userGrowth: 0,
      vehicleListings: 0,
      auctionActivity: 0
    };
  }
};

export const detectCriticalAlerts = async () => {
  try {
    const alerts = [];
    
    // Check for low activity in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { data: recentActivity } = await supabase
      .from('activity_logs')
      .select('id')
      .gte('created_at', oneWeekAgo.toISOString());
    
    if ((recentActivity?.length || 0) < 10) {
      alerts.push({
        type: 'warning',
        title: 'Baja Actividad',
        message: 'La actividad del sistema está por debajo del promedio esta semana',
        severity: 'medium'
      });
    }
    
    // Check for failed auctions
    const { data: failedAuctions } = await supabase
      .from('auctions')
      .select('id')
      .eq('status', 'ended_pending_acceptance')
      .is('winner_id', null)
      .gte('end_date', oneWeekAgo.toISOString());
    
    if ((failedAuctions?.length || 0) > 5) {
      alerts.push({
        type: 'alert',
        title: 'Subastas Fallidas',
        message: `${failedAuctions?.length || 0} subastas terminaron sin ganador esta semana`,
        severity: 'high'
      });
    }
    
    return alerts;
  } catch (err) {
    console.error("[trendAnalysisService] Error detecting alerts:", err);
    return [];
  }
};
