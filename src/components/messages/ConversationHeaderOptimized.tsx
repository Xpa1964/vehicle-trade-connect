
import React, { memo } from 'react';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types/conversation';

interface ConversationHeaderOptimizedProps {
  conversation: Conversation;
  currentUserId: string;
  getSourceTitle: (conversation: Conversation) => string;
  t: (key: string, options?: Record<string, string | number | undefined>) => string;
  sourceLink: string | null;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ConversationHeaderOptimized: React.FC<ConversationHeaderOptimizedProps> = memo(({
  conversation,
  currentUserId,
  getSourceTitle,
  t,
  sourceLink,
  onBack,
  showBackButton = false
}) => {
  const isUserSeller = currentUserId === conversation.seller_id;

  return (
    <div className="border-b border-gray-200 p-3 sm:p-4 bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="touch-manipulation min-h-[44px] min-w-[44px] p-2 rounded-xl hover:bg-gray-100 lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {conversation.vehicle_info && conversation.vehicle_info.thumbnailurl && (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
              <img
                src={conversation.vehicle_info.thumbnailurl}
                alt={getSourceTitle(conversation)}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
              {getSourceTitle(conversation)}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {isUserSeller 
                ? t('messages.talkingToBuyer', { fallback: 'Hablando con comprador' }) 
                : t('messages.talkingToSeller', { fallback: 'Hablando con vendedor' })
              }
            </p>
          </div>
        </div>
        
        {sourceLink && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="touch-manipulation min-h-[44px] px-3 sm:px-4 flex-shrink-0 rounded-xl"
          >
            <a href={sourceLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{t('messages.viewItem', { fallback: 'Ver artículo' })}</span>
              <span className="sm:hidden">Ver</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
});

ConversationHeaderOptimized.displayName = 'ConversationHeaderOptimized';

export default ConversationHeaderOptimized;
