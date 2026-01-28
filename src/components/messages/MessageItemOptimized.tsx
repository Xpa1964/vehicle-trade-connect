import React, { memo } from 'react';
import { format } from 'date-fns';
import { Message } from '@/types/conversation';
import { OptimisticMessage } from '@/types/messageStatus';
import { ExchangeProposalMessage } from '@/components/exchanges/ExchangeProposalMessage';
import TranslatedContent from '@/components/translation/TranslatedContent';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

interface MessageItemOptimizedProps {
  message: Message | OptimisticMessage;
  isOwn: boolean;
  t: (key: string, options?: Record<string, string | number | undefined>) => string;
  currentLanguage: string;
  currentUserId?: string;
  onRespondToExchange?: (response: 'accept' | 'reject') => Promise<void>;
}

const MessageItemOptimized: React.FC<MessageItemOptimizedProps> = memo(({
  message,
  isOwn,
  t,
  currentLanguage,
  currentUserId,
  onRespondToExchange
}) => {
  // Check if this message contains an exchange proposal
  const isExchangeProposal = React.useMemo(() => {
    try {
      const parsed = JSON.parse(message.content);
      return parsed.type === 'exchange_proposal';
    } catch {
      return false;
    }
  }, [message.content]);

  // Determine original language (fallback to Spanish if not specified)
  const originalLanguage = message.original_language || 'es';

  console.log(`🌐 [MessageItemOptimized] Rendering message with originalLang: ${originalLanguage}, targetLang: ${currentLanguage}, content: "${message.content.substring(0, 30)}..."`);

  // Siempre sanitiza el contenido aquí (aunque ya lo hace TranslatedContent, para seguridad total)
  const cleanContent = sanitizeHtml(message.content);

  // If this is an exchange proposal, render the special component
  if (isExchangeProposal) {
    try {
      const proposalData = JSON.parse(message.content);
      return (
        <div className={`flex mb-3 sm:mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <div className="max-w-[90%] sm:max-w-[85%] md:max-w-[75%]">
            <ExchangeProposalMessage
              proposal={proposalData}
              currentUserId={currentUserId || ''}
              senderId={message.sender_id}
              onAccept={() => onRespondToExchange?.('accept')}
              onReject={() => onRespondToExchange?.('reject')}
              onCounterOffer={() => {
                console.log('Counter offer functionality to be implemented');
              }}
            />
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error parsing exchange proposal:', error);
    }
  }

  return (
    <div className={`flex mb-3 sm:mb-4 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-sm ${
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-secondary text-foreground rounded-bl-md border border-border'
        }`}
      >
        <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words hyphens-auto">
          <TranslatedContent
            originalText={cleanContent}
            originalLanguage={originalLanguage}
            translatedContent={message.translated_content}
            targetLanguage={currentLanguage}
          />
        </div>
        
        <div className="flex justify-end mt-1.5 sm:mt-2">
          <span className={`text-xs ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'} font-medium`}>
            {format(new Date(message.created_at), 'HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );
});

MessageItemOptimized.displayName = 'MessageItemOptimized';

export default MessageItemOptimized;
