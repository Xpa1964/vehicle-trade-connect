
import { supabase } from '@/integrations/supabase/client';

export const getRegionsCount = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('country')
      .not('country', 'is', null);
      
    if (error) throw error;
    
    const uniqueCountries = new Set(data?.map(p => p.country) || []);
    return uniqueCountries.size;
  } catch (err) {
    console.error("[regionsStatsService] Error counting regions:", err);
    return 0;
  }
};

export const getNewRegionsCount = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Get countries from users who registered in the last month
    const { data: newUsers, error } = await supabase
      .from('profiles')
      .select('country')
      .gte('created_at', oneMonthAgo.toISOString())
      .not('country', 'is', null);
      
    if (error) throw error;
    
    // Get countries from users who registered before last month
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('country')
      .lt('created_at', oneMonthAgo.toISOString())
      .not('country', 'is', null);
    
    const newCountries = new Set(newUsers?.map(p => p.country) || []);
    const existingCountries = new Set(existingUsers?.map(p => p.country) || []);
    
    // Count truly new regions (countries that didn't exist before)
    let newRegionsCount = 0;
    newCountries.forEach(country => {
      if (!existingCountries.has(country)) {
        newRegionsCount++;
      }
    });
    
    return newRegionsCount;
  } catch (err) {
    console.error("[regionsStatsService] Error counting new regions:", err);
    return 0;
  }
};
