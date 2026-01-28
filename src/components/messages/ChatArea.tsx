
import React, { useEffect, useRef, memo } from 'react';
import { Conversation } from '@/types/conversation';
import { OptimisticMessage } from '@/types/messageStatus';
import MessageItemOptimized from './MessageItemOptimized';
import ConversationHeaderOptimized from './ConversationHeaderOptimized';
import MessageInput from './MessageInput';

interface ChatAreaProps {
  selectedConversation: string | null;
  activeConversation: Conversation | null;
  optimisticMessages: OptimisticMessage[];
  currentUserId: string | undefined;
  isLoadingMessages: boolean;
  t: (key: string, options?: Record<string, string | number | undefined>) => string;
  currentLanguage: string;
  getSourceTitle: (conversation: Conversation) => string;
  getSourceLink: () => string | null;
  sendMessage: (content: string) => Promise<void>;
  onRespondToExchange: (response: 'accept' | 'reject') => Promise<void>;
}

const ChatArea: React.FC<ChatAreaProps> = memo(({
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, optimisticMessages]);

  if (!selectedConversation || !activeConversation || !currentUserId) {
    return null;
  }

  const allMessages = [
    ...(activeConversation.messages || []),
    ...optimisticMessages
  ];

  const sourceLink = getSourceLink();

  return (
    <>
      <ConversationHeaderOptimized
        conversation={activeConversation}
        currentUserId={currentUserId}
        getSourceTitle={getSourceTitle}
        t={t}
        sourceLink={sourceLink}
      />
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-2 sm:px-3 py-3 sm:py-4 min-h-0 scroll-smooth focus:outline-none"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">
              {t('messages.loadingMessages', { fallback: 'Cargando mensajes...' })}
            </span>
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex items-center justify-center h-32 px-4">
            <p className="text-gray-500 text-center text-sm sm:text-base">
              {t('messages.noMessages', { fallback: 'No hay mensajes en esta conversación' })}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {allMessages.map((message) => (
              <MessageItemOptimized
                key={message.id}
                message={message}
                isOwn={message.sender_id === currentUserId}
                t={t}
                currentLanguage={currentLanguage}
                currentUserId={currentUserId}
                onRespondToExchange={onRespondToExchange}
              />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <MessageInput onSendMessage={sendMessage} t={t} />
    </>
  );
});

ChatArea.displayName = 'ChatArea';

export default ChatArea;
