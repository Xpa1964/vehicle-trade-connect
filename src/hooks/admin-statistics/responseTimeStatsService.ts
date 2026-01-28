
import { supabase } from '@/integrations/supabase/client';

export const getAverageResponseTime = async () => {
  try {
    // Get conversations with at least 2 messages to calculate response times
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        id,
        messages!inner(
          id,
          created_at,
          sender_id
        )
      `)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    let totalResponseTime = 0;
    let responseCount = 0;
    
    conversations?.forEach(conversation => {
      const messages = conversation.messages;
      if (messages && messages.length >= 2) {
        // Calculate response times between consecutive messages from different senders
        for (let i = 1; i < messages.length; i++) {
          const prevMessage = messages[i - 1];
          const currentMessage = messages[i];
          
          // Only count if different senders (actual response)
          if (prevMessage.sender_id !== currentMessage.sender_id) {
            const responseTime = new Date(currentMessage.created_at).getTime() - 
                               new Date(prevMessage.created_at).getTime();
            totalResponseTime += responseTime;
            responseCount++;
          }
        }
      }
    });
    
    if (responseCount === 0) return 0;
    
    // Convert to hours and round to 1 decimal
    const averageHours = (totalResponseTime / responseCount) / (1000 * 60 * 60);
    return Math.round(averageHours * 10) / 10;
  } catch (err) {
    console.error("[responseTimeStatsService] Error calculating response time:", err);
    return 0;
  }
};
