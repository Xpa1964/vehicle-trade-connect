
import { useState, useEffect } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { Conversation } from '@/types/conversation';

type ConversationSourceType = {
  type: 'vehicle' | 'announcement' | 'exchange' | string;
  title: string;
  id: string;
};

export function useConversationSource(activeConversation: Conversation | null) {
  const [conversationSource, setConversationSource] = useState<ConversationSourceType | null>(null);
  const { getConversationSource } = useConversations();

  useEffect(() => {
    const loadConversationSource = async () => {
      if (activeConversation) {
        try {
          // Check if we already have the source info directly in the conversation
          if (activeConversation.vehicle_id) {
            const vehicleInfo = activeConversation.vehicle_info;
            setConversationSource({
              type: 'vehicle',
              title: vehicleInfo ? `${vehicleInfo.brand} ${vehicleInfo.model} ${vehicleInfo.year}` : 'Vehicle',
              id: activeConversation.vehicle_id
            });
          } else if (activeConversation.source_type && activeConversation.source_id) {
            setConversationSource({
              type: activeConversation.source_type,
              title: activeConversation.source_title || activeConversation.source_type,
              id: activeConversation.source_id
            });
          } else {
            // If not, try to get it from the API
            const source = await getConversationSource(activeConversation);
            if (source) {
              setConversationSource(source as ConversationSourceType);
            } else {
              setConversationSource(null);
            }
          }
        } catch (error) {
          console.error("Error loading conversation source:", error);
          setConversationSource(null);
        }
      } else {
        setConversationSource(null);
      }
    };
    
    loadConversationSource();
  }, [activeConversation, getConversationSource]);

  const getSourceLink = () => {
    if (!conversationSource) return null;
    
    try {
      switch (conversationSource.type) {
        case 'vehicle':
          return `/vehicle/${conversationSource.id}/details`;
        case 'announcement':
          return `/bulletin/${conversationSource.id}`;
        case 'exchange':
          return `/exchanges?exchange=${conversationSource.id}`;
        default:
          console.log('Unknown source type:', conversationSource.type);
          return null;
      }
    } catch (error) {
      console.error("Error generating source link:", error, conversationSource);
      return null;
    }
  };

  return { 
    conversationSource,
    getSourceLink 
  };
}

export type { ConversationSourceType };
