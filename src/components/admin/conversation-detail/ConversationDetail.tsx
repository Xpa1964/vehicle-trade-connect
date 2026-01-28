
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ConversationOverview from './ConversationOverview';
import MessagesSection from './MessagesSection';
import { useConversationDetail } from './useConversationDetail';

const ConversationDetail: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { 
    conversation, 
    messages, 
    buyerProfile, 
    sellerProfile, 
    vehicle, 
    isLoadingConversation, 
    isLoadingMessages, 
    isLoadingBuyer,
    isLoadingSeller,
    isLoadingVehicle,
    hasPriceMentions
  } = useConversationDetail(conversationId);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/conversations')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('admin.conversation.back')}
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('admin.conversation.detail')}
          </h1>
        </div>
      </div>
      
      <ConversationOverview 
        conversation={conversation}
        buyerProfile={buyerProfile}
        sellerProfile={sellerProfile}
        vehicle={vehicle}
        messages={messages}
        hasPriceMentions={hasPriceMentions}
        isLoadingConversation={isLoadingConversation}
        isLoadingBuyer={isLoadingBuyer}
        isLoadingSeller={isLoadingSeller}
        isLoadingVehicle={isLoadingVehicle}
      />
      
      <MessagesSection
        messages={messages}
        buyerProfile={buyerProfile}
        sellerProfile={sellerProfile}
        conversation={conversation}
        isLoadingMessages={isLoadingMessages}
      />
    </div>
  );
};

export default ConversationDetail;
