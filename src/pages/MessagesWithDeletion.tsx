
import React, { useEffect, useState, Suspense, memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConversationsWithDeletion } from '@/hooks/useConversationsWithDeletion';
import { Conversation } from '@/types/conversation';
import MessagesHero from '@/components/messages/MessagesHero';
import ChatArea from '@/components/messages/ChatArea';
import ConversationDrawer from '@/components/messages/ConversationDrawer';
import EmptyChatPlaceholder from '@/components/messages/EmptyChatPlaceholder';
import ConversationListItemWithActions from '@/components/messages/ConversationListItemWithActions';
import ContactKontactModal from '@/components/messages/ContactKontactModal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, MessageSquare } from 'lucide-react';

const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2 text-foreground">Cargando...</span>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const AuthRequired = memo(() => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] p-4">
      <div className="bg-card rounded-lg shadow border border-border p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-foreground">{t('auth.authRequired', {})}</h2>
        <p className="mb-6 text-muted-foreground">{t('auth.pleaseLoginToViewMessages', {})}</p>
        <Button 
          onClick={() => navigate('/login', { state: { from: location } })}
          className="w-full"
        >
          {t('auth.login', {})}
        </Button>
      </div>
    </div>
  );
});

AuthRequired.displayName = 'AuthRequired';

const MessagesWithDeletion: React.FC = memo(() => {
  const { user } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { 
    conversations, 
    loading: loadingConversations,
    loadingMessages,
    selectedConversation,
    activeConversation,
    optimisticMessages,
    selectConversation,
    sendMessage,
    respondToExchangeProposal,
    togglePin,
    deleteConversation,
    subscribeToMessages
  } = useConversationsWithDeletion();

  const [currentActiveConversation, setCurrentActiveConversation] = useState<string | null>(null);
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleSelectConversation = React.useCallback(async (conversationId: string) => {
    if (currentActiveConversation === conversationId) return;
    
    setCurrentActiveConversation(conversationId);
    await selectConversation(conversationId);
    
    if (window.innerWidth < 1024) {
      setIsMobileConversationOpen(true);
    }
  }, [selectConversation, currentActiveConversation]);

  useEffect(() => {
    if (selectedConversation) {
      const unsubscribe = subscribeToMessages(selectedConversation, (newMessage) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Received new message in real-time:', newMessage);
        }
      });

      return unsubscribe;
    }
  }, [selectedConversation, subscribeToMessages]);

  const getSourceTitle = React.useCallback((conversation: Conversation): string => {
    // Detectar KONTACT VO
    if (conversation.is_admin_conversation && conversation.admin_sender_name) {
      return `KONTACT VO - ${conversation.admin_sender_name}`;
    }
    
    if (conversation.vehicle_info) {
      const { brand, model, year } = conversation.vehicle_info;
      return `${brand} ${model} ${year}`;
    }
    
    return conversation.source_title || conversation.source_type || t('messages.conversation', {});
  }, [t]);

  const getSourceLink = React.useCallback((): string | null => {
    if (!activeConversation) return null;
    
    if (activeConversation.vehicle_id) {
      return `/vehicle-preview/${activeConversation.vehicle_id}`;
    }
    
    if (activeConversation.source_type === 'announcement' && activeConversation.source_id) {
      return `/bulletin/${activeConversation.source_id}`;
    }
    
    return null;
  }, [activeConversation]);

  const handleSendMessage = React.useCallback(async (content: string): Promise<void> => {
    if (selectedConversation) {
      await sendMessage(selectedConversation, content);
    }
  }, [selectedConversation, sendMessage]);

  const handleRespondToExchange = React.useCallback(async (response: 'accept' | 'reject'): Promise<void> => {
    if (selectedConversation) {
      const status = response === 'accept' ? 'accepted' : 'rejected';
      await respondToExchangeProposal(selectedConversation, status);
    }
  }, [selectedConversation, respondToExchangeProposal]);

  if (!user) {
    return <AuthRequired />;
  }

  const showEmptyPlaceholder = !loadingConversations && (!conversations || conversations.length === 0 || !selectedConversation);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        {/* Hero Section */}
        <div className="p-2 sm:p-3 bg-card border-b border-border flex-shrink-0">
          <MessagesHero />
        </div>
        
        {/* Main Content Area */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 p-4 flex-1 min-h-0 overflow-hidden" style={{ isolation: 'isolate' }}>
          {/* Lista de conversaciones */}
          <div className="lg:col-span-1 min-h-0 flex flex-col relative z-10">
            <div className="bg-card rounded-lg shadow-sm border border-border flex-1 flex flex-col min-h-0 relative" style={{ overflow: 'visible', zIndex: 10 }}>
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-lg text-foreground">{t('messages.conversations', {})}</h2>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/users')}
                    className="flex-1 sm:flex-none"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {t('messages.userDirectory', { fallback: 'Directorio de Usuarios' })}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsContactModalOpen(true)}
                    className="flex-1 sm:flex-none"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('messages.contactKontact', { fallback: 'Contactar KONTACT VO' })}
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 relative" style={{ overflow: 'visible' }}>
                {loadingConversations ? (
                  <LoadingSpinner />
                ) : conversations && conversations.length > 0 ? (
                  <div className="divide-y divide-border">
                    {conversations.map((conversation) => (
                      <ConversationListItemWithActions
                        key={conversation.id}
                        conversation={conversation}
                        isSelected={selectedConversation === conversation.id}
                        currentUserId={user?.id}
                        onSelect={handleSelectConversation}
                        onTogglePin={togglePin}
                        onDelete={deleteConversation}
                        getSourceTitle={getSourceTitle}
                        t={t}
                        currentLanguage={currentLanguage}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    {t('messages.noConversations', {})}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Área de chat */}
          <div className="bg-card rounded-lg shadow-sm border border-border lg:col-span-2 flex flex-col min-h-0 overflow-hidden relative z-0" style={{ zIndex: 0 }}>
            {showEmptyPlaceholder ? (
              <EmptyChatPlaceholder />
            ) : (
              <ChatArea
                selectedConversation={selectedConversation}
                activeConversation={activeConversation}
                optimisticMessages={optimisticMessages}
                currentUserId={user?.id}
                isLoadingMessages={loadingMessages}
                t={t}
                currentLanguage={currentLanguage}
                getSourceTitle={getSourceTitle}
                getSourceLink={getSourceLink}
                sendMessage={handleSendMessage}
                onRespondToExchange={handleRespondToExchange}
              />
            )}
          </div>
        </div>

        {/* VISTA MÓVIL */}
        <div className="lg:hidden flex-1 flex flex-col min-h-0 bg-card">
          <div className="flex-1 p-2 sm:p-3 min-h-0">
            {conversations && conversations.length > 0 ? (
              <ScrollArea className="h-full">
                <div className="divide-y divide-border">
                  {conversations.map((conversation) => (
                    <ConversationListItemWithActions
                      key={conversation.id}
                      conversation={conversation}
                      isSelected={selectedConversation === conversation.id}
                      currentUserId={user?.id}
                      onSelect={handleSelectConversation}
                      onTogglePin={togglePin}
                      onDelete={deleteConversation}
                      getSourceTitle={getSourceTitle}
                      t={t}
                      currentLanguage={currentLanguage}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <EmptyChatPlaceholder />
            )}
          </div>
        </div>

        <ConversationDrawer
          isOpen={isMobileConversationOpen}
          onClose={() => setIsMobileConversationOpen(false)}
          selectedConversation={selectedConversation}
          activeConversation={activeConversation}
          optimisticMessages={optimisticMessages}
          currentUserId={user?.id}
          isLoadingMessages={loadingMessages}
          t={t}
          currentLanguage={currentLanguage}
          getSourceTitle={getSourceTitle}
          getSourceLink={getSourceLink}
          sendMessage={sendMessage}
          onRespondToExchange={respondToExchangeProposal}
        />
        
        <ContactKontactModal 
          isOpen={isContactModalOpen} 
          onClose={() => setIsContactModalOpen(false)} 
        />
      </div>
    </Suspense>
  );
});

MessagesWithDeletion.displayName = 'MessagesWithDeletion';

export default MessagesWithDeletion;
