
import { supabase } from '@/integrations/supabase/client';

export const getMessageActivityHeatmap = async () => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1000);
      
    if (error) throw error;
    
    // Group messages by hour of day
    const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0
    }));
    
    data?.forEach(message => {
      const hour = new Date(message.created_at).getHours();
      hourlyActivity[hour].count++;
    });
    
    return hourlyActivity;
  } catch (err) {
    console.error("[messageStatsService] Error fetching message activity:", err);
    return Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
  }
};

export const getMessageEngagementStats = async () => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        messages(count)
      `);
      
    if (error) throw error;
    
    const conversationsWithMessages = data?.filter(conv => conv.messages && conv.messages.length > 0) || [];
    const totalMessages = conversationsWithMessages.reduce((sum, conv) => sum + (conv.messages?.[0]?.count || 0), 0);
    const avgMessagesPerConversation = conversationsWithMessages.length > 0 
      ? Math.round(totalMessages / conversationsWithMessages.length) 
      : 0;
    
    return {
      totalConversations: data?.length || 0,
      activeConversations: conversationsWithMessages.length,
      averageMessagesPerConversation: avgMessagesPerConversation,
      totalMessages
    };
  } catch (err) {
    console.error("[messageStatsService] Error fetching engagement stats:", err);
    return {
      totalConversations: 0,
      activeConversations: 0,
      averageMessagesPerConversation: 0,
      totalMessages: 0
    };
  }
};
