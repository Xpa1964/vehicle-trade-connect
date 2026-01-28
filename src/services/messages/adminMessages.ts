
import { supabase } from '@/integrations/supabase/client';

export interface AdminMessageData {
  recipientId: string;
  content: string;
  adminName: string;
  sourceTitle?: string;
}

export async function sendAdminMessage(messageData: AdminMessageData): Promise<boolean> {
  try {
    const { recipientId, content, adminName, sourceTitle } = messageData;
    
    console.log('Sending admin message:', messageData);
    
    // Crear o encontrar conversación administrativa
    let conversationId: string;
    
    // Buscar conversación existente del admin con este usuario
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('buyer_id', recipientId)
      .eq('is_admin_conversation', true)
      .eq('admin_sender_name', adminName)
      .maybeSingle();
      
    if (existingConversation) {
      conversationId = existingConversation.id;
    } else {
      // Crear nueva conversación administrativa
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          seller_id: recipientId, // El admin actúa como "seller"
          buyer_id: recipientId,  // El usuario es el "buyer"
          is_admin_conversation: true,
          admin_sender_name: adminName,
          source_type: 'kontact_vo',
          source_title: sourceTitle || `Mensaje de ${adminName}`,
          status: 'active'
        })
        .select('id')
        .single();
        
      if (conversationError) {
        console.error('Error creating admin conversation:', conversationError);
        return false;
      }
      
      conversationId = newConversation.id;
    }
    
    // Enviar mensaje
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: recipientId, // Simular que el admin envía el mensaje
        content: `[KONTACT VO - ${adminName}]: ${content}`,
        original_language: 'es'
      });
      
    if (messageError) {
      console.error('Error sending admin message:', messageError);
      return false;
    }
    
    console.log('Admin message sent successfully');
    return true;
    
  } catch (error) {
    console.error('Error in sendAdminMessage:', error);
    return false;
  }
}
