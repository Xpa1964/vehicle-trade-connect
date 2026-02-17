
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DirectChatService {
  createDirectConversation: (buyerId: string, sellerId: string, initialMessage?: string) => Promise<string | null>;
  createBulkConversations: (senderId: string, recipientIds: string[], message: string, attachments?: string[]) => Promise<void>;
}

export const directChatService: DirectChatService = {
  async createDirectConversation(buyerId: string, sellerId: string, initialMessage?: string) {
    try {
      console.log('[DirectChat] Creating direct conversation between:', buyerId, 'and', sellerId);
      
      // Verificar si ya existe una conversación directa entre estos usuarios
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', buyerId)
        .eq('seller_id', sellerId)
        .eq('source_type', 'direct')
        .single();

      if (existingConversation) {
        console.log('[DirectChat] Using existing direct conversation:', existingConversation.id);
        return existingConversation.id;
      }

      // Crear nueva conversación directa
      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
          buyer_id: buyerId,
          seller_id: sellerId,
          source_type: 'direct',
          source_title: 'Direct conversation',
          status: 'active'
        })
        .select('id')
        .single();

      if (error) {
        console.error('[DirectChat] Error creating conversation:', error);
        throw error;
      }

      // Enviar mensaje inicial si se proporciona
      if (initialMessage && conversation) {
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversation.id,
            sender_id: buyerId,
            content: initialMessage,
            original_language: 'es'
          });
      }

      console.log('[DirectChat] Direct conversation created successfully:', conversation.id);
      return conversation.id;
    } catch (error) {
      console.error('[DirectChat] Error in createDirectConversation:', error);
      toast.error('Error creating conversation');
      return null;
    }
  },

  async createBulkConversations(senderId: string, recipientIds: string[], message: string, attachments?: string[]) {
    try {
      console.log('[DirectChat] Creating bulk conversations for', recipientIds.length, 'recipients');
      
      const results = await Promise.allSettled(
        recipientIds.map(async (recipientId) => {
          const conversationId = await this.createDirectConversation(senderId, recipientId, message);
          
          // Añadir adjuntos si existen
          if (attachments && attachments.length > 0 && conversationId) {
            // Aquí se implementaría la lógica de adjuntos cuando esté lista
            console.log('[DirectChat] Attachments would be added to conversation:', conversationId);
          }
          
          return conversationId;
        })
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;

      if (successful > 0) {
        toast.success(`Messages sent successfully: ${successful}${failed > 0 ? `, ${failed} failed` : ''}`);
      }
      
      if (failed > 0 && successful === 0) {
        toast.error('Error sending all messages');
      }

      console.log('[DirectChat] Bulk messaging completed:', { successful, failed });
    } catch (error) {
      console.error('[DirectChat] Error in createBulkConversations:', error);
      toast.error('Error sending bulk messages');
    }
  }
};
