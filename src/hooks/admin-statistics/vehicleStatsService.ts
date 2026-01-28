
import { supabase } from '@/integrations/supabase/client';

export const fetchVehicleStatistics = async () => {
  try {
    // Get total vehicles count
    const { data, error: vehiclesError, count } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });
      
    if (vehiclesError) throw vehiclesError;
    const vehiclesCount = count || 0;
    
    // Get recently added vehicles (last 2 weeks)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const { count: newCount, error: newVehiclesError } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twoWeeksAgo.toISOString());
      
    if (newVehiclesError) throw newVehiclesError;
    const newVehiclesCount = newCount || 0;
    
    return { total: vehiclesCount, recentlyAdded: newVehiclesCount };
  } catch (e) {
    console.error('[vehicleStatsService] Error fetching vehicle statistics:', e);
    return { total: 0, recentlyAdded: 0 };
  }
};
