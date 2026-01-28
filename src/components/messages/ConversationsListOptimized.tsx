
import React from 'react';
import { Conversation } from '@/types/conversation';
import { ScrollArea } from '@/components/ui/scroll-area';
import ConversationListItemWithActions from './ConversationListItemWithActions';
import { Bell, MessageSquare } from 'lucide-react';

interface ConversationsListOptimizedProps {
  conversations: Conversation[];
  isLoading: boolean;
  selectedConversation: string | null;
  currentUserId: string | undefined;
  onSelectConversation: (conversationId: string) => void;
  onTogglePin: (conversationId: string) => void;
  onDelete?: (conversationId: string) => void;
  t: (key: string, params?: any) => string;
  currentLanguage: string;
  getSourceTitle: (conversation: Conversation) => string;
}

const ConversationsListOptimized: React.FC<ConversationsListOptimizedProps> = ({
  conversations,
  isLoading,
  selectedConversation,
  currentUserId,
  onSelectConversation,
  onTogglePin,
  onDelete = () => {},
  t,
  currentLanguage,
  getSourceTitle
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">{t('messages.conversations', {})}</h2>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          <span className="ml-2">Cargando...</span>
        </div>
      </div>
    );
  }

  // Separate system notifications from regular conversations
  const systemNotifications = conversations.filter(conv => conv.is_admin_conversation && conv.source_type === 'system_notification');
  const regularConversations = conversations.filter(conv => !conv.is_admin_conversation || conv.source_type !== 'system_notification');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{t('messages.conversations', {})}</h2>
      </div>
      
      <ScrollArea className="flex-1">
        {(systemNotifications.length > 0 || regularConversations.length > 0) ? (
          <div className="divide-y">
            {/* System Notifications Section */}
            {systemNotifications.length > 0 && (
              <>
                <div className="p-3 bg-blue-50 border-b">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                    <Bell className="h-4 w-4" />
                    Notificaciones del Sistema
                  </div>
                </div>
                {systemNotifications.map((conversation) => (
                  <div key={conversation.id} className="relative">
                    <div className="absolute left-2 top-4 h-2 w-2 bg-blue-500 rounded-full z-10"></div>
                    <ConversationListItemWithActions
                      conversation={conversation}
                      isSelected={selectedConversation === conversation.id}
                      currentUserId={currentUserId}
                      onSelect={onSelectConversation}
                      onTogglePin={onTogglePin}
                      onDelete={onDelete}
                      getSourceTitle={getSourceTitle}
                      t={t}
                      currentLanguage={currentLanguage}
                    />
                  </div>
                ))}
              </>
            )}
            
            {/* Regular Conversations Section */}
            {regularConversations.length > 0 && (
              <>
                {systemNotifications.length > 0 && (
                  <div className="p-3 bg-gray-50 border-b">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MessageSquare className="h-4 w-4" />
                      Conversaciones
                    </div>
                  </div>
                )}
                {regularConversations.map((conversation) => (
                  <ConversationListItemWithActions
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedConversation === conversation.id}
                    currentUserId={currentUserId}
                    onSelect={onSelectConversation}
                    onTogglePin={onTogglePin}
                    onDelete={onDelete}
                    getSourceTitle={getSourceTitle}
                    t={t}
                    currentLanguage={currentLanguage}
                  />
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {t('messages.noConversations', {})}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationsListOptimized;
