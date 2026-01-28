
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/conversation';

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

// Send a message in a conversation
export async function sendMessage(
  conversationId: string, 
  senderId: string, 
  content: string,
  language: string
): Promise<Message> {
  console.log(`Sending message to conversation ${conversationId}: ${content}`);
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      original_language: language
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  
  // Ensure translated_content is the correct type
  const message: Message = {
    ...data,
    translated_content: parseTranslatedContent(data.translated_content)
  };
  
  return message;
}

// Mark messages as read
export async function markMessagesAsRead(conversationId: string, currentUserId: string) {
  try {
    console.log('🔵 Marking messages as read:', { conversationId, currentUserId });
    
    const { data, error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .not('sender_id', 'eq', currentUserId)
      .is('read_at', null)
      .select();
      
    console.log('✅ Messages marked as read:', data?.length || 0, 'messages updated');
      
    if (error) {
      console.error('❌ Error marking messages as read:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('❌ Error in markMessagesAsRead function:', err);
    throw err;
  }
}

// Start a new conversation or get existing one
export async function startConversation(
  sellerId: string,
  buyerId: string,
  vehicleId: string | null = null,
  sourceType: 'vehicle' | 'announcement' | 'exchange' | null = null,
  sourceId: string | null = null,
  sourceTitle: string | null = null
) {
  console.log(`Starting conversation between ${sellerId} and ${buyerId} about ${sourceType} ${sourceId}`);

  try {
    // Check if conversation already exists
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('buyer_id', buyerId)
      .eq('status', 'active');
    
    // Add vehicle_id condition if provided
    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId);
    } else {
      query = query.is('vehicle_id', null);
    }
    
    // Add source conditions if provided
    if (sourceType && sourceId) {
      query = query.eq('source_type', sourceType).eq('source_id', sourceId);
    }

    const { data: existingConversation, error: fetchError } = await query.maybeSingle();

    if (fetchError) {
      console.error('Error checking for existing conversation:', fetchError);
      throw fetchError;
    }

    // If conversation exists, return it
    if (existingConversation) {
      console.log('Found existing conversation:', existingConversation.id);
      return existingConversation;
    }

    // Create a new conversation
    const { data: newConversation, error: insertError } = await supabase
      .from('conversations')
      .insert({
        seller_id: sellerId,
        buyer_id: buyerId,
        vehicle_id: vehicleId,
        source_type: sourceType,
        source_id: sourceId,
        source_title: sourceTitle,
        status: 'active'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating conversation:', insertError);
      throw insertError;
    }

    console.log('Created new conversation:', newConversation.id);
    return newConversation;
  } catch (err) {
    console.error('Error in startConversation function:', err);
    throw err;
  }
}
