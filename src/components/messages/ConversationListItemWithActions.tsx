
import React from 'react';
import { Conversation } from '@/types/conversation';
import { Badge } from '@/components/ui/badge';
import { Pin } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { es, enUS, fr, it } from 'date-fns/locale';
import ConversationActionsMenu from './ConversationActionsMenu';

interface ConversationListItemWithActionsProps {
  conversation: Conversation;
  isSelected: boolean;
  currentUserId: string | undefined;
  onSelect: (conversationId: string) => void;
  onTogglePin: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  getSourceTitle: (conversation: Conversation) => string;
  t: (key: string, params?: any) => string;
  currentLanguage: string;
}

const ConversationListItemWithActions: React.FC<ConversationListItemWithActionsProps> = ({
  conversation,
  isSelected,
  currentUserId,
  onSelect,
  onTogglePin,
  onDelete,
  getSourceTitle,
  t,
  currentLanguage
}) => {
  const getLocale = () => {
    switch (currentLanguage) {
      case 'en': return enUS;
      case 'fr': return fr;
      case 'it': return it;
      default: return es;
    }
  };

  const getOtherParticipantRole = () => {
    if (!currentUserId) return '';
    
    // Detectar KONTACT VO
    if (conversation.is_admin_conversation && conversation.admin_sender_name) {
      return `KONTACT VO - ${conversation.admin_sender_name}`;
    }
    
    if (conversation.seller_id === currentUserId) {
      return t('messages.buyer', {});
    }
    return t('messages.seller', {});
  };

  const lastMessage = conversation.messages?.[conversation.messages.length - 1];
  const sourceTitle = getSourceTitle(conversation);

  return (
    <div
      className={`relative p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
        isSelected ? 'bg-muted border-r-2 border-r-primary' : ''
      }`}
      onClick={() => onSelect(conversation.id)}
    >
      {/* Menú de acciones - Posicionado en esquina superior izquierda */}
      <div 
        className="absolute top-2 left-2 z-[1000]" 
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', zIndex: 1000, overflow: 'visible' }}
      >
        <ConversationActionsMenu
          conversation={conversation}
          onTogglePin={onTogglePin}
          onDelete={onDelete}
          t={t}
        />
      </div>

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pl-8"> {/* Agregamos padding izquierdo para el menú */}
          <div className="flex items-center gap-2 mb-1">
            {conversation.is_pinned && (
              <Pin className="h-3 w-3 text-primary" />
            )}
            <h4 className="font-medium text-sm truncate">
              {sourceTitle}
            </h4>
            {conversation.unread_count && conversation.unread_count > 0 && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0">
                {conversation.unread_count}
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mb-1">
            {getOtherParticipantRole()}
          </p>
          
          {lastMessage && (
            <p className="text-xs text-muted-foreground truncate">
              {lastMessage.content.length > 50 
                ? `${lastMessage.content.substring(0, 50)}...`
                : lastMessage.content
              }
            </p>
          )}
          
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistance(new Date(conversation.updated_at), new Date(), {
              addSuffix: true,
              locale: getLocale()
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationListItemWithActions;
