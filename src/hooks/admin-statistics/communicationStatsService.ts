
import { supabase } from '@/integrations/supabase/client';

export const getTotalChatConversations = async () => {
  const { count, error } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error fetching chat conversations:', error);
    return 0;
  }
  
  return count || 0;
};

export const getAverageMessagesPerUser = async () => {
  const { count: totalMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true });
  
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  if (!totalUsers || totalUsers === 0) return 0;
  
  return Math.round((totalMessages || 0) / totalUsers);
};

export const getTranslationFeatureUses = async () => {
  const { count, error } = await supabase
    .from('translation_cache')
    .select('use_count');
  
  if (error) {
    console.error('Error fetching translation uses:', error);
    return 0;
  }
  
  return count || 0;
};

export const getAverageSupportResponseTime = async () => {
  // Simulado - en producción vendría de sistema de tickets
  return 4; // 4 horas promedio
};
