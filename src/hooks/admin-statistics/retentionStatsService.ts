
import { supabase } from '@/integrations/supabase/client';

export const getUserRetentionStats = async () => {
  try {
    // Get user registration dates
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, created_at')
      .order('created_at', { ascending: false });
      
    if (profilesError) throw profilesError;
    
    // Get recent activity from various tables
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Check activity in vehicles (posting), messages (messaging), auctions (bidding)
    const { data: recentVehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('user_id')
      .gte('created_at', oneWeekAgo.toISOString());
      
    const { data: recentMessages, error: messagesError } = await supabase
      .from('messages')
      .select('sender_id')
      .gte('created_at', oneWeekAgo.toISOString());
      
    const { data: recentBids, error: bidsError } = await supabase
      .from('bids')
      .select('bidder_id')
      .gte('created_at', oneWeekAgo.toISOString());
    
    if (vehiclesError || messagesError || bidsError) {
      console.warn("Some retention queries failed, using partial data");
    }
    
    // Combine all active user IDs
    const activeUserIds = new Set([
      ...(recentVehicles?.map(v => v.user_id) || []),
      ...(recentMessages?.map(m => m.sender_id) || []),
      ...(recentBids?.map(b => b.bidder_id) || [])
    ].filter(id => id));
    
    const totalUsers = profiles?.length || 0;
    const activeUsers = activeUserIds.size;
    const retentionRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
    
    // Calculate new users this month
    const newUsersThisMonth = profiles?.filter(p => 
      new Date(p.created_at) >= oneMonthAgo
    ).length || 0;
    
    return {
      totalUsers,
      activeUsers,
      retentionRate,
      newUsersThisMonth,
      churnRate: 100 - retentionRate
    };
  } catch (err) {
    console.error("[retentionStatsService] Error fetching retention stats:", err);
    return {
      totalUsers: 0,
      activeUsers: 0,
      retentionRate: 0,
      newUsersThisMonth: 0,
      churnRate: 0
    };
  }
};
