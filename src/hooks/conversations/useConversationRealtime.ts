
import { useEffect, useCallback } from 'react';
import { subscribeToMessages } from '@/utils/messageSubscription';
import { Conversation } from '@/types/conversation';

export function useConversationRealtime(
  selectedConversation: string | null,
  loadConversationDetails: (id: string) => Promise<Conversation | null>,
  setActiveConversation: (conversation: Conversation | null) => void,
  activeConversation: Conversation | null,
  userId: string | undefined
) {
  const subscribeToMessagesCallback = useCallback((conversationId: string, callback?: (message: any) => void) => {
    return subscribeToMessages(conversationId, (message) => {
      // Update active conversation with new message
      loadConversationDetails(conversationId).then(updated => {
        if (updated) {
          setActiveConversation(updated);
        }
      });
      
      if (callback) {
        callback(message);
      }
    });
  }, [loadConversationDetails, setActiveConversation]);

  return {
    subscribeToMessages: subscribeToMessagesCallback
  };
}
