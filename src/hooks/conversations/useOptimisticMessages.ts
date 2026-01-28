
import { useState, useCallback } from 'react';
import { OptimisticMessage } from '@/types/messageStatus';

export function useOptimisticMessages() {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);

  const addOptimisticMessage = useCallback((content: string, conversationId: string, senderId: string) => {
    const optimisticMessage: OptimisticMessage = {
      id: `optimistic-${Date.now()}`,
      content,
      conversation_id: conversationId,
      sender_id: senderId,
      created_at: new Date().toISOString(),
      status: 'sending',
      isOptimistic: true
    };

    setOptimisticMessages(prev => [...prev, optimisticMessage]);
    return optimisticMessage.id;
  }, []);

  const updateMessageStatus = useCallback((messageId: string, status: 'sent' | 'failed') => {
    setOptimisticMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  }, []);

  const clearOptimisticMessages = useCallback(() => {
    setOptimisticMessages([]);
  }, []);

  return {
    optimisticMessages,
    addOptimisticMessage,
    updateMessageStatus,
    clearOptimisticMessages
  };
}
