
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle } from 'lucide-react';
import { useConversations } from '@/hooks/useConversations';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ContactSellerDialogProps {
  sellerId: string;
  vehicleId: string;
  sellerName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactSellerDialog: React.FC<ContactSellerDialogProps> = ({
  sellerId,
  vehicleId,
  sellerName,
  isOpen,
  onOpenChange,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const { startConversation, sendMessage } = useConversations();
  const [isSending, setIsSending] = React.useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    if (!user) {
      toast.error('Debes iniciar sesión para enviar mensajes');
      navigate('/login');
      return;
    }
    
    setIsSending(true);
    try {
      console.log(`Starting conversation with seller ${sellerId} about vehicle ${vehicleId}`);
      
      // Iniciar conversación pasando el vehicleId
      const conversation = await startConversation(sellerId, vehicleId);
      
      if (conversation && 'id' in conversation) {
        const conversationId = conversation.id;
        console.log(`Sending message to conversation ${conversationId}`);
        
        // Enviar el mensaje
        await sendMessage(conversationId, message);
        
        toast.success('Mensaje enviado correctamente');
        onOpenChange(false);
        setMessage('');
        navigate('/messages');
      } else {
        console.error('Failed to create conversation, response:', conversation);
        throw new Error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contactar al vendedor</DialogTitle>
          <DialogDescription>
            Envía un mensaje a {sellerName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <label htmlFor="message" className="text-sm font-medium">
              Contenido del mensaje
            </label>
            <Textarea 
              id="message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Escribe tu mensaje aquí..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSendMessage}
            disabled={isSending || !message.trim()}
          >
            {isSending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Enviando...
              </>
            ) : 'Enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerDialog;
