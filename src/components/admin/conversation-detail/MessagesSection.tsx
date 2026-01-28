
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRightLeft, Euro } from 'lucide-react';
import { Message, Conversation } from '@/types/conversation';
import { useLanguage } from '@/contexts/LanguageContext';

type MessagesSectionProps = {
  messages: Message[] | undefined;
  buyerProfile: any | null;
  sellerProfile: any | null;
  conversation: Conversation | null;
  isLoadingMessages: boolean;
};

const MessagesSection: React.FC<MessagesSectionProps> = ({
  messages,
  buyerProfile,
  sellerProfile,
  conversation,
  isLoadingMessages
}) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.conversation.messages')}</CardTitle>
        <CardDescription>
          {messages?.length || 0} mensajes intercambiados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingMessages ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] ${i % 2 === 0 ? 'bg-gray-100' : 'bg-blue-100'} rounded-lg p-4`}>
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageItem 
                key={message.id}
                message={message}
                buyerProfile={buyerProfile}
                sellerProfile={sellerProfile}
                buyerId={conversation?.buyer_id}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">{t('admin.conversation.noMessages')}</p>
        )}
      </CardContent>
    </Card>
  );
};

type MessageItemProps = {
  message: Message;
  buyerProfile: any | null;
  sellerProfile: any | null;
  buyerId?: string;
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  buyerProfile,
  sellerProfile,
  buyerId
}) => {
  const isBuyer = message.sender_id === buyerId;
  
  // Detectar si es una propuesta de intercambio
  const isExchangeProposal = React.useMemo(() => {
    try {
      const parsed = JSON.parse(message.content);
      return parsed.type === 'exchange_proposal';
    } catch {
      return false;
    }
  }, [message.content]);
  
  // Si es propuesta de intercambio, renderizar componente especial
  if (isExchangeProposal) {
    try {
      const proposalData = JSON.parse(message.content);
      return (
        <div className={`flex ${isBuyer ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[80%] border-2 ${isBuyer 
            ? 'border-blue-200 bg-blue-50' 
            : 'border-green-200 bg-green-50'
          } rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightLeft className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Propuesta de Intercambio
              </span>
              <Badge variant={
                proposalData.status === 'pending' ? 'secondary' :
                proposalData.status === 'accepted' ? 'default' :
                'destructive'
              }>
                {proposalData.status === 'pending' ? 'Pendiente' :
                 proposalData.status === 'accepted' ? 'Aceptada' :
                 proposalData.status === 'rejected' ? 'Rechazada' :
                 proposalData.status}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Vehículo ofrecido:</span>
                <code className="text-xs bg-white px-2 py-1 rounded">
                  {proposalData.offeredVehicleId?.substring(0, 8)}...
                </code>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Vehículo solicitado:</span>
                <code className="text-xs bg-white px-2 py-1 rounded">
                  {proposalData.requestedVehicleId?.substring(0, 8)}...
                </code>
              </div>
              
              {proposalData.compensation > 0 && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                  <Euro className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Compensación:</span>
                  <span className="text-green-600 font-semibold">
                    {proposalData.compensation}€
                  </span>
                </div>
              )}
              
              {proposalData.conditions && proposalData.conditions.length > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <span className="font-medium">Condiciones:</span>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {proposalData.conditions.map((condition: string, idx: number) => (
                      <li key={idx} className="text-xs">{condition}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-3 pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                {isBuyer 
                  ? buyerProfile?.full_name || 'Comprador' 
                  : sellerProfile?.full_name || 'Vendedor'
                }
              </span>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.created_at), 'HH:mm')}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      // Si falla el parsing, mostrar como mensaje normal
      console.error('Error parsing exchange proposal:', e);
    }
  }
  
  // Renderizado de mensaje normal
  return (
    <div className={`flex ${isBuyer ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-[80%] ${isBuyer 
          ? 'bg-gray-100 text-gray-900' 
          : 'bg-blue-100 text-blue-900'
        } rounded-lg p-4`}
      >
        <div className="flex items-center mb-1">
          <span className="text-xs font-semibold">
            {isBuyer 
              ? buyerProfile?.full_name || 'Comprador' 
              : sellerProfile?.full_name || 'Vendedor'
            }
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className="flex justify-end items-center mt-1">
          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.created_at), 'HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessagesSection;
