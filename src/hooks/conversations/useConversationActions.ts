
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createConversation } from '@/services/conversations/createConversation';
import { sendMessage as sendMessageService, markMessagesAsRead } from '@/services/messages/messageOperations';
import { Conversation } from '@/types/conversation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ConversationSource {
  sourceType: string;
  sourceId: string;
  sourceTitle: string;
}

export function useConversationActions(
  selectedConversation: string | null,
  loadConversationDetails: (id: string, userId: string) => Promise<Conversation | null>,
  activeConversation: Conversation | null,
  setActiveConversation: (conversation: Conversation | null) => void,
  fetchConversations: () => Promise<void>,
  setConversations: (conversations: Conversation[]) => void,
  addOptimisticMessage: (message: any) => void,
  updateMessageStatus: (messageId: string, status: 'sent' | 'failed') => void
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const startConversation = useCallback(async (
    otherUserId: string,
    vehicleId?: string | null,
    source?: ConversationSource
  ) => {
    try {
      if (!user) {
        toast.error('Debes iniciar sesión para enviar mensajes');
        return null;
      }

      // Determinar quién es el vendedor y quién es el comprador
      const conversation = await createConversation(
        otherUserId, // sellerId - el usuario que recibe el mensaje
        user.id, // buyerId - el usuario actual que inicia la conversación
        vehicleId || null,
        source?.sourceType as 'vehicle' | 'announcement' | 'exchange' | null,
        source?.sourceId || null,
        source?.sourceTitle || null
      );

      if (conversation) {
        await fetchConversations();
        return conversation;
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Error al iniciar conversación');
      throw error;
    }
  }, [fetchConversations, user]);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      if (!user) {
        toast.error('Debes iniciar sesión para enviar mensajes');
        return null;
      }

      const message = await sendMessageService(conversationId, user.id, content, 'es');
      
      // Refresh conversation details to get the new message
      const updatedConversation = await loadConversationDetails(conversationId, user.id);
      if (updatedConversation) {
        setActiveConversation(updatedConversation);
      }
      
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
      throw error;
    }
  }, [loadConversationDetails, setActiveConversation, user]);

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      if (!user) return;
      
      await markMessagesAsRead(conversationId, user.id);
      
      // Force immediate refetch of statistics to update unread counter
      await queryClient.refetchQueries({ 
        queryKey: ['dashboard-statistics'],
        type: 'active' 
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [user, queryClient]);

  const togglePin = useCallback(async (conversationId: string, conversations: Conversation[]) => {
    try {
      if (!user) {
        toast.error('Debes iniciar sesión para fijar conversaciones');
        return;
      }

      console.log('Toggle pin for conversation:', conversationId);
      
      // Encontrar la conversación actual
      const currentConversation = conversations.find(c => c.id === conversationId);
      if (!currentConversation) {
        toast.error('Conversación no encontrada');
        return;
      }

      const newPinnedStatus = !currentConversation.is_pinned;
      
      // Actualizar en la base de datos
      const { error } = await supabase
        .from('conversations')
        .update({ is_pinned: newPinnedStatus })
        .eq('id', conversationId);

      if (error) {
        console.error('Error updating pin status:', error);
        toast.error('Error al actualizar el estado de fijado');
        return;
      }

      // Actualizar la lista local de conversaciones
      const updatedConversations = conversations.map(conversation =>
        conversation.id === conversationId
          ? { ...conversation, is_pinned: newPinnedStatus }
          : conversation
      );
      
      setConversations(updatedConversations);
      
      // Refrescar la lista completa para asegurar consistencia
      await fetchConversations();
      
      toast.success(newPinnedStatus ? 'Conversación fijada' : 'Conversación desfijada');
      
    } catch (error) {
      console.error('Error in togglePin:', error);
      toast.error('Error al cambiar el estado de fijado');
    }
  }, [user, setConversations, fetchConversations]);

  const respondToExchangeProposal = useCallback(async (
    conversationId: string, 
    status: 'accepted' | 'rejected' | 'counteroffered',
    counterOffer?: any
  ) => {
    try {
      if (!user) {
        toast.error('Debes iniciar sesión para responder');
        return;
      }

      console.log('=== RESPONDING TO EXCHANGE PROPOSAL ===');
      console.log('Conversation ID:', conversationId);
      console.log('Status:', status);
      console.log('Counter offer:', counterOffer);

      // 1. Buscar el intercambio asociado a esta conversación
      const { data: exchange, error: exchangeError } = await supabase
        .from('exchanges')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('status', 'pending')
        .single();

      if (exchangeError || !exchange) {
        console.error('Exchange not found:', exchangeError);
        toast.error('No se encontró la propuesta de intercambio');
        return;
      }

      // 2. Actualizar el estado del intercambio
      const { error: updateError } = await supabase
        .from('exchanges')
        .update({
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', exchange.id);

      if (updateError) {
        console.error('Error updating exchange:', updateError);
        toast.error('Error al actualizar el intercambio');
        return;
      }

      // 3. Generar mensaje automático según la respuesta
      let responseMessage = '';
      
      if (status === 'accepted') {
        responseMessage = '✅ ¡Genial! He aceptado tu propuesta de intercambio. Iniciemos el proceso para coordinar el intercambio de nuestros vehículos. Por favor, contactemos para definir los detalles del intercambio.';
        toast.success('Propuesta de intercambio aceptada');
      } else if (status === 'rejected') {
        responseMessage = '❌ Gracias por tu propuesta de intercambio. Lamentablemente, no puedo aceptarla en este momento, pero aprecio mucho tu interés. ¡Espero que encuentres el vehículo perfecto!';
        toast.success('Propuesta de intercambio rechazada');
      } else if (status === 'counteroffered' && counterOffer) {
        // Para contraoferta, crear un nuevo registro de intercambio
        const { data: newExchange, error: counterError } = await supabase
          .from('exchanges')
          .insert({
            initiator_id: user.id,
            offered_vehicle_id: exchange.requested_vehicle_id, // Invertir los vehículos
            requested_vehicle_id: exchange.offered_vehicle_id,
            target_vehicle_id: exchange.offered_vehicle_id,
            compensation: counterOffer.compensation || 0,
            conditions: counterOffer.conditions ? [counterOffer.conditions] : [],
            conversation_id: conversationId,
            status: 'pending'
          })
          .select()
          .single();

        if (counterError) {
          console.error('Error creating counter offer:', counterError);
          toast.error('Error al crear la contraoferta');
          return;
        }

        responseMessage = `🔄 He revisado tu propuesta y me gustaría hacer una contraoferta:\n\n`;
        if (counterOffer.compensation > 0) {
          responseMessage += `💰 Compensación adicional: €${counterOffer.compensation.toLocaleString()}\n`;
        }
        if (counterOffer.conditions) {
          responseMessage += `📋 Condiciones adicionales: ${counterOffer.conditions}\n`;
        }
        responseMessage += `\n¿Qué te parece esta propuesta? Espero tu respuesta.`;
        
        toast.success('Contraoferta enviada');
      }

      // 4. Enviar el mensaje automático
      await sendMessage(conversationId, responseMessage);

      // 5. Actualizar la conversación
      const updatedConversation = await loadConversationDetails(conversationId, user.id);
      if (updatedConversation) {
        setActiveConversation(updatedConversation);
      }

      console.log('=== EXCHANGE RESPONSE COMPLETED ===');

    } catch (error) {
      console.error('Error responding to exchange proposal:', error);
      toast.error('Error al responder a la propuesta de intercambio');
      throw error;
    }
  }, [user, loadConversationDetails, setActiveConversation, sendMessage]);

  return {
    startConversation,
    sendMessage,
    markAsRead,
    togglePin,
    respondToExchangeProposal
  };
}
