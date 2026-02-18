
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message } from '@/types/conversation';
import { parseTranslatedContent } from './utils';
import { ConversationSource } from './types';

export function useConversationDataWithDeletion(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  // Fetch conversations list - ACTUALIZADO para filtrar eliminadas
  const fetchConversations = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          vehicles(id, brand, model, year, thumbnailurl)
        `)
        .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
        .neq('status', 'deleted')
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }
      
      // Format conversations with vehicle info
      const formattedConversations: Conversation[] = data.map(conv => {
        const vehicleInfo = conv.vehicles ? {
          id: conv.vehicles.id,
          brand: conv.vehicles.brand,
          model: conv.vehicles.model,
          year: conv.vehicles.year,
          thumbnailurl: conv.vehicles.thumbnailurl
        } : undefined;

        return {
          ...conv,
          messages: [],
          vehicle_info: vehicleInfo
        };
      });
      
      console.log('Fetched conversations:', formattedConversations.length, 'total conversations');
      setConversations(formattedConversations);
    } catch (err) {
      console.error('Error in fetchConversations:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load full conversation details with messages
  const loadConversationDetails = useCallback(async (conversationId: string) => {
    if (!userId || !conversationId) return null;

    try {
      setLoadingMessages(true);
      console.log('Loading conversation details for:', conversationId);

      // Get conversation details
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select(`
          *,
          vehicles(id, brand, model, year, thumbnailurl)
        `)
        .eq('id', conversationId)
        .single();
        
      if (conversationError) {
        console.error('Error fetching conversation:', conversationError);
        throw conversationError;
      }
      
      // Get messages for this conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }

      console.log(`Loaded ${messagesData?.length || 0} messages for conversation ${conversationId}`);
      
      // Format vehicle info
      const vehicleInfo = conversationData.vehicles ? {
        id: conversationData.vehicles.id,
        brand: conversationData.vehicles.brand,
        model: conversationData.vehicles.model,
        year: conversationData.vehicles.year,
        thumbnailurl: conversationData.vehicles.thumbnailurl
      } : undefined;

      // Transform messages to ensure correct type for translated_content
      const transformedMessages: Message[] = (messagesData || []).map(msg => ({
        ...msg,
        translated_content: parseTranslatedContent(msg.translated_content)
      }));

      // Check for exchange proposals in messages
      let exchangeProposal = null;
      for (const message of transformedMessages) {
        try {
          const content = JSON.parse(message.content);
          if (content.type === 'exchange_proposal' || content.type === 'exchange_response') {
            exchangeProposal = {
              offeredVehicleId: content.offeredVehicleId,
              requestedVehicleId: content.requestedVehicleId,
              compensation: content.compensation || 0,
              conditions: content.conditions ? Array.isArray(content.conditions) ? content.conditions : [content.conditions] : [],
              status: content.status || 'pending'
            };
            break;
          }
        } catch (e) {
          // Not a JSON message or not an exchange proposal, skip
        }
      }

      const fullConversation: Conversation = {
        ...conversationData,
        messages: transformedMessages,
        vehicle_info: vehicleInfo,
        exchange_proposal: exchangeProposal
      };

      return fullConversation;
    } catch (error) {
      console.error('Error loading conversation details:', error);
      return null;
    } finally {
      setLoadingMessages(false);
    }
  }, [userId]);

  // Get conversation source information
  const getConversationSource = useCallback(async (conversation: Conversation): Promise<ConversationSource | null> => {
    if (!conversation) return null;
    
    try {
      // Si es una conversación de vehículo
      if (conversation.vehicle_id) {
        if (conversation.vehicle_info) {
          const { brand, model, year } = conversation.vehicle_info;
          return {
            type: 'vehicle',
            title: `${brand} ${model} ${year}`,
            id: conversation.vehicle_id
          };
        }
        
        const { data } = await supabase
          .from('vehicles')
          .select('brand, model, year')
          .eq('id', conversation.vehicle_id)
          .single();
          
        if (data) {
          return {
            type: 'vehicle',
            title: `${data.brand} ${data.model} ${data.year}`,
            id: conversation.vehicle_id
          };
        }
      }
      
      // Si es una conversación de anuncio o KONTACT VO
      if (conversation.source_type && conversation.source_id) {
        // Detectar si es KONTACT VO basado en admin_sender_name
        if (conversation.is_admin_conversation && conversation.admin_sender_name) {
          return {
            type: 'kontact_vo',
            title: `KONTACT VO - ${conversation.admin_sender_name}`,
            id: conversation.source_id
          };
        }
        
        return {
          type: conversation.source_type,
          title: conversation.source_title || `Anuncio: ${conversation.source_type}`,
          id: conversation.source_id
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting conversation source:', error);
      return null;
    }
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
    fetchConversations,
    loadConversationDetails,
    getConversationSource
  };
}
