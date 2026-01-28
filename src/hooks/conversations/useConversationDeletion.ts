
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useConversationDeletion() {
  const deleteConversation = useCallback(async (conversationId: string, userId: string): Promise<boolean> => {
    try {
      console.log('Deleting conversation:', conversationId, 'for user:', userId);
      
      const { data, error } = await supabase.rpc('soft_delete_conversation', {
        p_conversation_id: conversationId,
        p_user_id: userId
      });

      if (error) {
        console.error('Error deleting conversation:', error);
        return false;
      }

      console.log('Conversation deleted successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in deleteConversation:', error);
      return false;
    }
  }, []);

  return { deleteConversation };
}
