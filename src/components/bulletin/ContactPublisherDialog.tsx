
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types/announcement';

interface ContactPublisherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement;
}

const ContactPublisherDialog: React.FC<ContactPublisherDialogProps> = ({ 
  open, 
  onOpenChange,
  announcement
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('El mensaje no puede estar vacío');
      return;
    }
    
    if (!user) {
      toast.error(t('auth.loginRequired', { fallback: 'Debes iniciar sesión para enviar mensajes' }));
      return;
    }
    
    if (!announcement?.user_id) {
      toast.error(t('bulletin.contact.noPublisherError', { fallback: 'No se pudo identificar al publicador del anuncio' }));
      return;
    }
    
    if (user.id === announcement.user_id) {
      toast.error('No puedes enviarte un mensaje a ti mismo');
      return;
    }
    
    setIsSending(true);
    
    try {
      console.log('Creating conversation for announcement:', {
        sellerId: announcement.user_id,
        buyerId: user.id,
        sourceType: 'announcement',
        sourceId: announcement.id,
        sourceTitle: announcement.title
      });

      // Verificar si ya existe una conversación para este anuncio
      const { data: existingConversation, error: checkError } = await supabase
        .from('conversations')
        .select('*')
        .eq('seller_id', announcement.user_id)
        .eq('buyer_id', user.id)
        .eq('source_type', 'announcement')
        .eq('source_id', announcement.id)
        .is('vehicle_id', null)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing conversation:', checkError);
        throw checkError;
      }

      let conversation = existingConversation;

      // Si no existe, crear nueva conversación
      if (!conversation) {
        console.log('Creating new conversation...');
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            seller_id: announcement.user_id,
            buyer_id: user.id,
            vehicle_id: null,
            source_type: 'announcement',
            source_id: announcement.id,
            source_title: announcement.title,
            status: 'active',
            unread_count: 0
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating conversation:', createError);
          throw createError;
        }
        
        conversation = newConversation;
        console.log('Conversation created:', conversation.id);
      } else {
        console.log('Using existing conversation:', conversation.id);
      }
      
      // Enviar el mensaje
      const { data: sentMessage, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          content: message,
          sender_id: user.id,
          original_language: 'es'
        })
        .select()
        .single();
      
      if (messageError) {
        console.error('Error sending message:', messageError);
        throw messageError;
      }
      
      console.log('Message sent successfully:', sentMessage);
      
      // Actualizar timestamp de la conversación
      await supabase
        .from('conversations')
        .update({ 
          updated_at: new Date().toISOString(),
          unread_count: 1
        })
        .eq('id', conversation.id);
      
      toast.success(t('bulletin.contact.messageSent', { fallback: 'Mensaje enviado correctamente' }));
      setMessage('');
      onOpenChange(false);
      
      // Redirigir a la página de mensajes con esta conversación abierta
      window.location.href = `/messages?conversation=${conversation.id}`;
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast.error(t('bulletin.contact.sendError', { fallback: 'Error al enviar el mensaje' }));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] mx-4 sm:mx-0">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">
            {t('bulletin.contact.title', { fallback: 'Contactar con el publicador' })}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {t('bulletin.contact.description', { fallback: 'Envía un mensaje al publicador de este anuncio' })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2 sm:py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{t('bulletin.title', { fallback: 'Anuncio' })}</h4>
            <p className="text-sm text-gray-500 line-clamp-2">{announcement?.title}</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              {t('bulletin.contact.message', { fallback: 'Mensaje' })}
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder={t('bulletin.contact.messagePlaceholder', { fallback: 'Escribe tu mensaje aquí...' })}
              className="resize-none min-h-[100px] text-base sm:text-sm touch-manipulation"
            />
            <p className="text-xs text-gray-500">
              {t('messages.continueChatting', { fallback: 'Podrás continuar esta conversación en la sección de Mensajes' })}
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            type="button"
            disabled={isSending}
            className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
          >
            {t('common.cancel', { fallback: 'Cancelar' })}
          </Button>
          <Button 
            type="button" 
            disabled={isSending || !message.trim()}
            onClick={handleSendMessage}
            className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
          >
            {isSending ? t('bulletin.contact.sending', { fallback: 'Enviando...' }) : t('bulletin.contact.send', { fallback: 'Enviar' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactPublisherDialog;
