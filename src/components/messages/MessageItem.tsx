
import React from 'react';
import { format } from 'date-fns';
import { Message } from '@/types/conversation';
import { OptimisticMessage } from '@/types/messageStatus';
import TranslatedContent from '@/components/translation/TranslatedContent';
import MessageStatusIndicator from './MessageStatusIndicator';

interface MessageItemProps {
  message: Message | OptimisticMessage;
  isOwn: boolean;
  currentLanguage: string;
  t: (key: string, options?: Record<string, string | number | undefined>) => string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwn,
  currentLanguage,
  t
}) => {
  // Check if this is an optimistic message
  const isOptimistic = 'isOptimistic' in message && message.isOptimistic;
  const messageStatus = 'status' in message ? message.status : 'sent';

  // Format the message date
  const formatMessageDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  
  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          isOwn 
            ? `bg-auto-blue text-white rounded-br-none ${isOptimistic ? 'opacity-70' : ''}` 
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        {/* Show original message if it's in our language, otherwise show translated version */}
        {message.original_language === currentLanguage ? (
          <p>{message.content}</p>
        ) : (
          <TranslatedContent 
            originalText={message.content}
            originalLanguage={message.original_language || 'es'}
            translatedContent={message.translated_content}
            targetLanguage={currentLanguage}
            className={isOwn ? 'text-white' : 'text-gray-800'}
          />
        )}
        
        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
          isOwn ? 'text-white/70' : 'text-gray-500'
        }`}>
          <span>{formatMessageDate(message.created_at)}</span>
          {isOwn && (
            <MessageStatusIndicator 
              status={messageStatus} 
              className={isOwn ? 'text-white/70' : 'text-gray-500'} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
