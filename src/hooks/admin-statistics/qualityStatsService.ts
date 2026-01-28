
import { supabase } from '@/integrations/supabase/client';

export const getQualityScore = async () => {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating');
      
    if (error) throw error;
    
    if (!data || data.length === 0) return 0;
    
    const totalRating = data.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / data.length;
    
    // Convert to scale of 10 (assuming ratings are 1-5, convert to 1-10)
    const scoreOutOf10 = (averageRating / 5) * 10;
    
    return Math.round(scoreOutOf10 * 10) / 10;
  } catch (err) {
    console.error("[qualityStatsService] Error calculating quality score:", err);
    return 0;
  }
};

export const getQualityGrowthRate = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Get recent ratings
    const { data: recentRatings, error: recentError } = await supabase
      .from('ratings')
      .select('rating')
      .gte('created_at', oneMonthAgo.toISOString());
    
    // Get older ratings
    const { data: olderRatings, error: olderError } = await supabase
      .from('ratings')
      .select('rating')
      .lt('created_at', oneMonthAgo.toISOString());
    
    if (recentError || olderError) throw recentError || olderError;
    
    const recentAvg = recentRatings?.length > 0 
      ? recentRatings.reduce((sum, r) => sum + r.rating, 0) / recentRatings.length 
      : 0;
    
    const olderAvg = olderRatings?.length > 0 
      ? olderRatings.reduce((sum, r) => sum + r.rating, 0) / olderRatings.length 
      : 0;
    
    if (olderAvg === 0) return recentAvg > 0 ? 100 : 0;
    
    const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;
    return Math.round(improvement * 10) / 10;
  } catch (err) {
    console.error("[qualityStatsService] Error calculating quality growth:", err);
    return 0;
  }
};
