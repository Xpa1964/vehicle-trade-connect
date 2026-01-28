
import { supabase } from '@/integrations/supabase/client';

export const getGeographicStats = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('country')
      .not('country', 'is', null);
      
    if (error) throw error;
    
    // Count users by country
    const countryStats = data?.reduce((acc, profile) => {
      const country = profile.country || 'Desconocido';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    // Convert to array format for charts
    const geographicData = Object.entries(countryStats)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 countries
    
    return geographicData;
  } catch (err) {
    console.error("[geographicStatsService] Error fetching geographic stats:", err);
    return [];
  }
};
