
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Conversation } from '@/types/conversation';
import { Button } from '@/components/ui/button';
import { Pin } from 'lucide-react';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { MESSAGES_IMAGES } from '@/constants/imageAssets';

interface ConversationsListProps {
  conversations: Conversation[];
  isLoading: boolean; // Updated prop name from isLoading to match MessagesContainer
  selectedConversation: string | null;
  currentUserId: string | undefined;
  onSelectConversation: (id: string) => void;
  onTogglePin: (id: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  currentLanguage: string;
  getSourceTitle: (conversation: Conversation) => string;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  isLoading,
  selectedConversation,
  currentUserId,
  onSelectConversation,
  onTogglePin,
  t,
  currentLanguage,
  getSourceTitle
}) => {
  // Sort conversations - pinned first, then by updated_at
  const sortedConversations = [...conversations].sort((a, b) => {
    // First by pinned status
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    
    // Then by updated_at date (most recent first)
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t('messages.conversations')}</h2>
        </div>
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t('messages.conversations')}</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-32 h-32 mx-auto mb-4">
            <OptimizedImage
              src={MESSAGES_IMAGES.emptyState}
              alt={t('messages.noConversations')}
              fallbackSources={MESSAGES_IMAGES.fallbacks}
              className="w-full h-full object-contain"
              objectFit="contain"
            />
          </div>
          <p className="mt-2 text-gray-500">{t('messages.noConversations')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t('messages.conversations')}</h2>
        <span className="text-sm text-gray-500">
          {t('messages.total', { count: conversations.length })}
        </span>
      </div>
      
      <div className="space-y-2">
        {sortedConversations.map((conversation) => {
          const isSelected = selectedConversation === conversation.id;
          const isUserSeller = currentUserId === conversation.seller_id;
          const otherUserId = isUserSeller ? conversation.buyer_id : conversation.seller_id;
          const lastMessage = conversation.messages && conversation.messages.length > 0
            ? conversation.messages[conversation.messages.length - 1]
            : null;
          
          // Format the last message preview with proper translation if available
          const messagePreview = lastMessage
            ? (lastMessage.translated_content && currentLanguage in lastMessage.translated_content
                ? lastMessage.translated_content[currentLanguage]
                : lastMessage.content || '')
            : t('messages.noMessages');
            
          return (
            <div 
              key={conversation.id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                ${conversation.unread_count ? 'border-l-4 border-l-blue-500' : ''}
              `}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {conversation.vehicle_info && (
                    <div className="w-12 h-12 mr-3 rounded-md bg-gray-200 overflow-hidden">
                      {conversation.vehicle_info.thumbnailurl ? (
                        <img 
                          src={conversation.vehicle_info.thumbnailurl} 
                          alt={`${conversation.vehicle_info.brand} ${conversation.vehicle_info.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-300 text-gray-500 text-xs">
                          {t('common.noImage')}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">
                      {getSourceTitle(conversation)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {isUserSeller ? t('messages.buyer') : t('messages.seller')}: {otherUserId.substring(0, 8)}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`h-8 w-8 p-1 ${conversation.is_pinned ? 'text-blue-600' : 'text-gray-400'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(conversation.id);
                  }}
                >
                  <Pin className="h-4 w-4" />
                  <span className="sr-only">{t('common.pin')}</span>
                </Button>
              </div>
              
              {lastMessage && (
                <>
                  <p className="text-sm line-clamp-2 mb-2">
                    {messagePreview?.length > 60 
                      ? `${messagePreview.substring(0, 60)}...` 
                      : messagePreview}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })}
                    </span>
                    {conversation.unread_count > 0 && (
                      <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationsList;
