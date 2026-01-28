
import { useState, useCallback, useMemo } from 'react';
import { fetchConversations } from '@/services/conversations/fetchConversations';
import { getConversationDetails } from '@/services/conversations';
import { getConversationSource } from '@/services/conversations';
import { Conversation } from '@/types/conversation';

export function useConversationDataOptimized(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [cache, setCache] = useState<Map<string, Conversation>>(new Map());

  const fetchConversationsData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await fetchConversations(userId);
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadConversationDetails = useCallback(async (conversationId: string) => {
    if (!userId) return null;
    
    // Check cache first
    if (cache.has(conversationId)) {
      return cache.get(conversationId);
    }

    setLoadingMessages(true);
    try {
      const details = await getConversationDetails(conversationId, userId);
      if (details) {
        // Update cache
        setCache(prev => new Map(prev).set(conversationId, details));
        return details;
      }
    } catch (error) {
      console.error('Error loading conversation details:', error);
    } finally {
      setLoadingMessages(false);
    }
    return null;
  }, [cache, userId]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return {
    conversations,
    setConversations,
    loading,
    loadingMessages,
    selectedConversation,
    setSelectedConversation,
    activeConversation,
    setActiveConversation,
    fetchConversations: fetchConversationsData,
    loadConversationDetails,
    getConversationSource,
    clearCache
  };
}
