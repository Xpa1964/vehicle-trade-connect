
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message } from '@/types/conversation';
import { markMessagesAsRead } from '@/services/messages/messageOperations';

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

// Fetch details about a specific conversation WITH MESSAGES
export const fetchConversationById = async (
  conversationId: string, 
  userId: string
): Promise<Conversation | null> => {
  console.log(`Fetching details for conversation ${conversationId}`);

  // First get the conversation details
  const { data: conversationData, error: conversationError } = await supabase
    .from('conversations')
    .select(`
      id,
      seller_id,
      buyer_id,
      vehicle_id,
      status,
      created_at,
      updated_at,
      source_id,
      source_type,
      source_title,
      is_pinned,
      unread_count
    `)
    .eq('id', conversationId)
    .single();

  if (conversationError) {
    console.error(`Error fetching conversation details:`, conversationError);
    throw conversationError;
  }

  if (!conversationData) {
    console.warn(`No conversation found with id ${conversationId}`);
    return null;
  }

  // Ensure the user is part of this conversation
  if (conversationData.seller_id !== userId && conversationData.buyer_id !== userId) {
    console.error(`User ${userId} is not authorized to access conversation ${conversationId}`);
    throw new Error('Unauthorized access to conversation');
  }

  // Now get the messages for this conversation
  const { data: messagesData, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (messagesError) {
    console.error(`Error fetching conversation messages:`, messagesError);
    throw messagesError;
  }

  console.log(`Fetched ${messagesData?.length || 0} messages for conversation ${conversationId}`);

  // Transform the messages to ensure translated_content is the correct type
  const messages: Message[] = (messagesData || []).map(message => ({
    ...message,
    translated_content: parseTranslatedContent(message.translated_content)
  }));

  // Mark messages as read if the user opens this conversation
  try {
    await markMessagesAsRead(conversationId, userId);
  } catch (err) {
    console.error('Error marking messages as read:', err);
  }

  // Return conversation with messages
  return {
    ...conversationData,
    messages
  } as Conversation;
};

// Fetch messages for a specific conversation
export const fetchConversationMessages = async (conversationId: string): Promise<Message[]> => {
  console.log(`Fetching messages for conversation ${conversationId}`);

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error(`Error fetching conversation messages:`, error);
    throw error;
  }

  console.log(`Fetched ${data?.length} messages for conversation ${conversationId}`);

  // Transform the data to ensure translated_content is the correct type
  const messages: Message[] = (data || []).map(message => ({
    ...message,
    translated_content: parseTranslatedContent(message.translated_content)
  }));

  return messages;
};
