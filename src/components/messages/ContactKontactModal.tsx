import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { sendAdminMessage } from '@/services/messages/adminMessages';
import { toast } from 'sonner';

interface ContactKontactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactKontactModal: React.FC<ContactKontactModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!user || !message.trim()) return;

    setIsLoading(true);
    try {
      const success = await sendAdminMessage({
        recipientId: user.id,
        content: message.trim(),
        adminName: 'KONTACT VO Support',
        sourceTitle: 'Contacto directo con KONTACT VO'
      });

      if (success) {
        toast.success(t('toast.messageSent'));
        setMessage('');
        onClose();
      } else {
        toast.error(t('toast.messageError'));
      }
    } catch (error) {
      console.error('Error sending message to KONTACT VO:', error);
      toast.error(t('toast.messageError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('messages.contactKontactModal.title', {})}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('seller.messageLabel')}
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('messages.contactKontactModal.placeholder', {})}
              rows={6}
              className="w-full resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {t('common.cancel', {})}
            </Button>
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('seller.sending')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t('messages.contactKontactModal.send', {})}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactKontactModal;