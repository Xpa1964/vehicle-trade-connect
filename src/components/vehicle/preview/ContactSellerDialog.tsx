
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
      toast.error(t('toast.loginRequired'));
      navigate('/login');
      return;
    }
    
    setIsSending(true);
    try {
      console.log(`Starting conversation with seller ${sellerId} about vehicle ${vehicleId}`);
      
      const conversation = await startConversation(sellerId, vehicleId);
      
      if (conversation && 'id' in conversation) {
        const conversationId = conversation.id;
        console.log(`Sending message to conversation ${conversationId}`);
        
        await sendMessage(conversationId, message);
        
        toast.success(t('toast.messageSent'));
        onOpenChange(false);
        setMessage('');
        navigate('/messages');
      } else {
        console.error('Failed to create conversation, response:', conversation);
        throw new Error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('toast.messageError'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t('seller.contactTitle')}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('seller.contactDescription', { name: sellerName })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              {t('seller.messageLabel')}
            </label>
            <Textarea 
              id="message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder={t('seller.messagePlaceholder')}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSendMessage}
            disabled={isSending || !message.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                {t('seller.sending')}
              </>
            ) : t('seller.send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerDialog;