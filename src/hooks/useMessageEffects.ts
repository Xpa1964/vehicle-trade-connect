
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Conversation, Message, ExchangeProposal } from '@/types/conversation';

type UseMessageEffectsProps = {
  selectedConversation: string | null;
  subscribeToMessages: (conversationId: string, onNewMessage: (message: Message) => void) => () => void;
  conversations: Conversation[] | undefined;
  user: { id: string } | null;
  currentActiveConversation: string | null;
  markAsRead: (conversationId: string) => void;
  activeConversation: Conversation | null;
  setActiveConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
  fetchExchangeVehicles: (proposal: ExchangeProposal) => Promise<void>;
};

export function useMessageEffects({
  selectedConversation,
  subscribeToMessages,
  conversations,
  user,
  currentActiveConversation,
  markAsRead,
  activeConversation,
  setActiveConversation,
  fetchExchangeVehicles
}: UseMessageEffectsProps) {
  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!selectedConversation) return;
    
    const cleanup = subscribeToMessages(selectedConversation, (newMessage) => {
      // Mark message as read if it's in the current conversation and not from current user
      if (selectedConversation === currentActiveConversation && newMessage.sender_id !== user?.id) {
        markAsRead(selectedConversation);
      }
      
      // Display notification if the message is not from the current user and not in the active conversation
      if (newMessage.sender_id !== user?.id && selectedConversation !== currentActiveConversation) {
        // Find the conversation to get the title
        const conversation = conversations?.find(c => c.id === newMessage.conversation_id);
        if (conversation) {
          const sourceTitle = conversation.source_title || 'New message';
          
          // Fix: Using toast correctly - pass the message content directly
          toast(newMessage.content);
        }
      }
      
      // Check if the message is an exchange proposal or response
      try {
        const content = JSON.parse(newMessage.content);
        if (
          (content.type === 'exchange_proposal' || content.type === 'exchange_response') && 
          activeConversation?.exchange_proposal
        ) {
          fetchExchangeVehicles(activeConversation.exchange_proposal);
        }
      } catch (e) {
        // Not a JSON message, ignore
      }
      
      // Update the local state with the new message
      setActiveConversation(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          messages: [...(prev.messages || []), newMessage]
        };
      });
    });
    
    return cleanup;
  }, [selectedConversation, subscribeToMessages, conversations, user?.id, currentActiveConversation, markAsRead, activeConversation, setActiveConversation, fetchExchangeVehicles]);

  return null; // This hook doesn't need to return anything as it's just for side effects
}
