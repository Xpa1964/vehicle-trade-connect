
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/conversation';

// Set up real-time updates for messages
export function subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', 
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        console.log('New message received:', payload);
        callback(payload.new as Message);
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}
