
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversationDataWithDeletion } from './conversations/useConversationDataWithDeletion';
import { useConversationActions } from './conversations/useConversationActions';
import { useConversationRealtime } from './conversations/useConversationRealtime';
import { useOptimisticMessages } from './conversations/useOptimisticMessages';
import { useConversationDeletion } from './conversations/useConversationDeletion';

export function useConversationsWithDeletion(vehicleId?: string) {
  const { user } = useAuth();
  
  const {
    conversations,
    setConversations,
    loading,
    loadingMessages,
    selectedConversation,
    setSelectedConversation,
    activeConversation,
    setActiveConversation,
    fetchConversations,
    loadConversationDetails,
    getConversationSource
  } = useConversationDataWithDeletion(user?.id);

  const {
    optimisticMessages,
    addOptimisticMessage,
    updateMessageStatus,
    clearOptimisticMessages
  } = useOptimisticMessages();

  const { deleteConversation } = useConversationDeletion();

  // Create a wrapper function that matches the expected signature
  const handleOptimisticMessageAdd = useCallback((message: any) => {
    if (message.content && message.conversation_id && message.sender_id) {
      addOptimisticMessage(message.content, message.conversation_id, message.sender_id);
    }
  }, [addOptimisticMessage]);

  const {
    startConversation,
    sendMessage,
    markAsRead,
    togglePin,
    respondToExchangeProposal
  } = useConversationActions(
    selectedConversation,
    loadConversationDetails,
    activeConversation,
    setActiveConversation,
    fetchConversations,
    setConversations,
    handleOptimisticMessageAdd,
    updateMessageStatus
  );

  const { subscribeToMessages } = useConversationRealtime(
    selectedConversation,
    loadConversationDetails,
    setActiveConversation,
    activeConversation,
    user?.id
  );

  // Handle conversation deletion
  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    if (!user?.id) return;
    
    console.log('Attempting to delete conversation:', conversationId);
    
    try {
      const success = await deleteConversation(conversationId, user.id);
      console.log('Deletion result:', success);
      
      if (success) {
        // Immediately remove from local state for instant feedback
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        
        // If the deleted conversation was selected, clear selection
        if (selectedConversation === conversationId) {
          setSelectedConversation(null);
          setActiveConversation(null);
        }
        
        // Refresh conversations list to sync with database
        await fetchConversations();
        
        console.log('Conversation deleted successfully');
      } else {
        console.error('Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }, [deleteConversation, user?.id, fetchConversations, selectedConversation, setSelectedConversation, setActiveConversation, setConversations]);

  // Select conversation and load its details
  const selectConversation = useCallback(async (conversationId: string) => {
    console.log('Selecting conversation:', conversationId);
    setSelectedConversation(conversationId);
    
    // Clear optimistic messages when switching conversations
    clearOptimisticMessages();
    
    const conversationDetails = await loadConversationDetails(conversationId);
    if (conversationDetails) {
      setActiveConversation(conversationDetails);
      // Mark messages as read
      await markAsRead(conversationId);
    }
  }, [loadConversationDetails, setSelectedConversation, setActiveConversation, markAsRead, clearOptimisticMessages]);

  // Wrapper for togglePin to pass conversations
  const handleTogglePin = useCallback((conversationId: string) => {
    togglePin(conversationId, conversations);
  }, [togglePin, conversations]);
  
  // Effect to load conversations when user changes
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  return {
    conversations,
    loading,
    loadingMessages,
    selectedConversation,
    activeConversation,
    optimisticMessages,
    selectConversation,
    setSelectedConversation,
    sendMessage,
    startConversation,
    respondToExchangeProposal,
    loadConversationDetails,
    getConversationSource,
    subscribeToMessages,
    markAsRead,
    togglePin: handleTogglePin,
    deleteConversation: handleDeleteConversation,
    refetch: fetchConversations
  };
}
