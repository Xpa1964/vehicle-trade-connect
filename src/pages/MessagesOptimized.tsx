
import React, { useEffect, useState, Suspense, memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConversationsOptimized } from '@/hooks/useConversationsOptimized';
import { Conversation } from '@/types/conversation';
import MessagesHero from '@/components/messages/MessagesHero';
import ConversationsListOptimized from '@/components/messages/ConversationsListOptimized';
import ChatArea from '@/components/messages/ChatArea';
import ConversationDrawer from '@/components/messages/ConversationDrawer';
import EmptyChatPlaceholder from '@/components/messages/EmptyChatPlaceholder';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
    <span className="ml-2">Cargando...</span>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const AuthRequired = memo(() => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] p-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">{t('auth.authRequired', {})}</h2>
        <p className="mb-6">{t('auth.pleaseLoginToViewMessages', {})}</p>
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

const MessagesOptimized: React.FC = memo(() => {
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
  } = useConversationsOptimized();

  const [currentActiveConversation, setCurrentActiveConversation] = useState<string | null>(null);
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);

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

  console.log('MessagesOptimized render state:', {
    loadingConversations,
    conversationsCount: conversations?.length || 0,
    selectedConversation,
    showEmptyPlaceholder
  });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {/* LAYOUT OPTIMIZADO PARA MÓVIL CON MEJOR DISTRIBUCIÓN DE ESPACIO */}
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Hero Section - MÁS COMPACTO Y RESPONSIVO */}
        <div className="p-2 sm:p-3 bg-white border-b border-gray-200">
          <MessagesHero />
        </div>
        
        {/* Main Content Area - OPTIMIZADO PARA MÓVIL */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 p-4 flex-1 min-h-0">
          {/* Lista de conversaciones */}
          <div className="lg:col-span-1 min-h-0 flex flex-col">
            <ConversationsListOptimized
              conversations={conversations || []}
              isLoading={loadingConversations}
              selectedConversation={selectedConversation}
              currentUserId={user?.id}
              onSelectConversation={handleSelectConversation}
              onTogglePin={togglePin}
              onDelete={deleteConversation}
              t={t}
              currentLanguage={currentLanguage}
              getSourceTitle={getSourceTitle}
            />
          </div>

          {/* Área de chat */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2 flex flex-col min-h-0">
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

        {/* VISTA MÓVIL OPTIMIZADA */}
        <div className="lg:hidden flex-1 flex flex-col min-h-0 bg-white">
          <div className="flex-1 p-2 sm:p-3 min-h-0">
            {conversations && conversations.length > 0 ? (
              <ConversationsListOptimized
                conversations={conversations}
                isLoading={loadingConversations}
                selectedConversation={selectedConversation}
                currentUserId={user?.id}
                onSelectConversation={handleSelectConversation}
                onTogglePin={togglePin}
                onDelete={deleteConversation}
                t={t}
                currentLanguage={currentLanguage}
                getSourceTitle={getSourceTitle}
              />
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
      </div>
    </Suspense>
  );
});

MessagesOptimized.displayName = 'MessagesOptimized';

export default MessagesOptimized;
