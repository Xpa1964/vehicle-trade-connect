
import { supabase } from '@/integrations/supabase/client';

export const fetchConversationStatistics = async () => {
  try {
    // Get active conversations count
    const { count, error: conversationsError } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
      
    if (conversationsError) throw conversationsError;
    const conversationsCount = count || 0;
    
    // Get new conversations from last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { count: newCount, error: newConversationsError } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());
      
    if (newConversationsError) throw newConversationsError;
    const newConversationsCount = newCount || 0;
    
    return { active: conversationsCount, newLastWeek: newConversationsCount };
  } catch (e) {
    console.error('[conversationStatsService] Error fetching conversation statistics:', e);
    return { active: 0, newLastWeek: 0 };
  }
};
