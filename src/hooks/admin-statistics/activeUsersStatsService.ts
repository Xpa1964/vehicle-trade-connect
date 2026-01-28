
import { supabase } from '@/integrations/supabase/client';

export const getActiveUsersLast30Days = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get users who have been active in the last 30 days
    // Active means: posted vehicles, sent messages, placed bids, or created auctions
    const activeUserIds = new Set();
    
    // Users who posted vehicles
    const { data: vehicleUsers } = await supabase
      .from('vehicles')
      .select('user_id')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .not('user_id', 'is', null);
    
    vehicleUsers?.forEach(v => activeUserIds.add(v.user_id));
    
    // Users who sent messages
    const { data: messageUsers } = await supabase
      .from('messages')
      .select('sender_id')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    messageUsers?.forEach(m => activeUserIds.add(m.sender_id));
    
    // Users who placed bids
    const { data: bidUsers } = await supabase
      .from('bids')
      .select('bidder_id')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    bidUsers?.forEach(b => activeUserIds.add(b.bidder_id));
    
    // Users who created auctions
    const { data: auctionUsers } = await supabase
      .from('auctions')
      .select('created_by')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    auctionUsers?.forEach(a => activeUserIds.add(a.created_by));
    
    return activeUserIds.size;
  } catch (err) {
    console.error("[activeUsersStatsService] Error calculating active users:", err);
    return 0;
  }
};

export const getActiveUsersGrowthRate = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    // Active users in last 30 days
    const currentActive = await getActiveUsersLast30Days();
    
    // Active users in previous 30 days (30-60 days ago)
    const activeUserIds = new Set();
    
    const { data: vehicleUsers } = await supabase
      .from('vehicles')
      .select('user_id')
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString())
      .not('user_id', 'is', null);
    
    const { data: messageUsers } = await supabase
      .from('messages')
      .select('sender_id')
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString());
    
    vehicleUsers?.forEach(v => activeUserIds.add(v.user_id));
    messageUsers?.forEach(m => activeUserIds.add(m.sender_id));
    
    const previousActive = activeUserIds.size;
    
    if (previousActive === 0) return currentActive > 0 ? 100 : 0;
    
    const growthRate = ((currentActive - previousActive) / previousActive) * 100;
    return Math.round(growthRate * 10) / 10;
  } catch (err) {
    console.error("[activeUsersStatsService] Error calculating active users growth:", err);
    return 0;
  }
};
