
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message } from '@/types/conversation';

// Helper to convert any JSON or string to Record<string, string>
const parseTranslatedContent = (content: any): Record<string, string> => {
  if (!content) return {};
  if (typeof content === 'object') return content;
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch (e) {
      return {};
    }
  }
  return {};
};

// Get conversations for a user
export async function fetchConversations(userId: string): Promise<Conversation[]> {
  if (!userId) return [];
  
  console.log('Fetching conversations for user:', userId);
  
  // Get conversations where the user is either the buyer or seller
  const { data: conversationsData, error: conversationsError } = await supabase
    .from('conversations')
    .select(`
      id,
      seller_id,
      buyer_id, 
      vehicle_id,
      status,
      created_at,
      updated_at,
      source_type,
      source_id,
      source_title,
      is_pinned,
      unread_count
    `)
    .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
    .order('updated_at', { ascending: false });
    
  if (conversationsError) {
    console.error('Error fetching conversations:', conversationsError);
    throw conversationsError;
  }
  
  // For each conversation, get the user details and vehicle details
  const enhancedConversations = await Promise.all(conversationsData.map(async (convo) => {
    // Get vehicle info if it's a vehicle conversation
    let vehicleInfo = null;
    if (convo.vehicle_id) {
      const { data: vehicleData } = await supabase
        .from('vehicles')
        .select('brand, model, year, thumbnailurl')
        .eq('id', convo.vehicle_id)
        .single();
        
      vehicleInfo = vehicleData || undefined;
    }
      
    // Get the last few messages
    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convo.id)
      .order('created_at', { ascending: false })
      .limit(20);
     
    // Process messages to ensure correct translated_content type
    const messages: Message[] = messagesData 
      ? messagesData.reverse().map(msg => ({
          ...msg,
          translated_content: parseTranslatedContent(msg.translated_content)
        })) 
      : [];
      
    return {
      ...convo,
      messages,
      vehicle_info: vehicleInfo
    };
  }));
  
  return enhancedConversations;
}
