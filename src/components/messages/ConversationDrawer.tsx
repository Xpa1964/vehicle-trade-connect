
import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatArea from './ChatArea';
import { Conversation } from '@/types/conversation';
import { OptimisticMessage } from '@/types/messageStatus';

interface ConversationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedConversation: string | null;
  activeConversation: Conversation | null;
  optimisticMessages: OptimisticMessage[];
  currentUserId: string | undefined;
  isLoadingMessages: boolean;
  t: (key: string, options?: Record<string, string | number | undefined>) => string;
  currentLanguage: string;
  getSourceTitle: (conversation: Conversation) => string;
  getSourceLink: () => string | null;
  sendMessage: (conversationId: string, content: string) => Promise<any>;
  onRespondToExchange?: (conversationId: string, status: 'accepted' | 'rejected' | 'counteroffered', counterOffer?: any) => Promise<any>;
}

const ConversationDrawer: React.FC<ConversationDrawerProps> = ({
  isOpen,
  onClose,
  selectedConversation,
  activeConversation,
  optimisticMessages,
  currentUserId,
  isLoadingMessages,
  t,
  currentLanguage,
  getSourceTitle,
  getSourceLink,
  sendMessage,
  onRespondToExchange
}) => {
  if (!isOpen) return null;

  const handleSendMessage = async (content: string) => {
    if (selectedConversation) {
      return await sendMessage(selectedConversation, content);
    }
  };

  const handleRespondToExchange = async (response: 'accept' | 'reject') => {
    if (selectedConversation && onRespondToExchange) {
      const status = response === 'accept' ? 'accepted' : 'rejected';
      return await onRespondToExchange(selectedConversation, status);
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />
      
      <div className="fixed top-0 right-0 w-full bg-card shadow-xl flex flex-col" style={{ height: '100dvh' }}>
        <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-card sticky top-0 z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="touch-manipulation min-h-[44px] min-w-[44px] p-2 rounded-xl hover:bg-secondary active:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-base sm:text-lg font-semibold truncate">
              {activeConversation ? getSourceTitle(activeConversation) : t('messages.conversation', {})}
            </h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="touch-manipulation min-h-[44px] min-w-[44px] p-2 ml-2 rounded-xl hover:bg-secondary active:bg-muted"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <ChatArea
            selectedConversation={selectedConversation}
            activeConversation={activeConversation}
            optimisticMessages={optimisticMessages}
            currentUserId={currentUserId}
            isLoadingMessages={isLoadingMessages}
            t={t}
            currentLanguage={currentLanguage}
            getSourceTitle={getSourceTitle}
            getSourceLink={getSourceLink}
            sendMessage={handleSendMessage}
            onRespondToExchange={handleRespondToExchange}
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationDrawer;
