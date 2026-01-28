
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Car } from 'lucide-react';
import { Conversation, Message } from '@/types/conversation';
import { Vehicle } from '@/types/vehicle';

type ConversationOverviewProps = {
  conversation: Conversation | null;
  buyerProfile: any | null;
  sellerProfile: any | null;
  vehicle: Vehicle | null;
  messages: Message[] | undefined;
  hasPriceMentions: boolean | undefined;
  isLoadingConversation: boolean;
  isLoadingBuyer: boolean;
  isLoadingSeller: boolean;
  isLoadingVehicle: boolean;
};

const ConversationOverview: React.FC<ConversationOverviewProps> = ({
  conversation,
  buyerProfile,
  sellerProfile,
  vehicle,
  messages,
  hasPriceMentions,
  isLoadingConversation,
  isLoadingBuyer,
  isLoadingSeller,
  isLoadingVehicle
}) => {
  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha desconocida';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la conversación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingConversation ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : conversation ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Conversation Details */}
            <ConversationDetails 
              conversation={conversation}
              messages={messages}
              hasPriceMentions={hasPriceMentions}
              formatDate={formatDate}
            />
            
            {/* Participants Info */}
            <ParticipantsInfo 
              buyerProfile={buyerProfile}
              sellerProfile={sellerProfile}
              vehicle={vehicle}
              isLoadingBuyer={isLoadingBuyer}
              isLoadingSeller={isLoadingSeller}
              isLoadingVehicle={isLoadingVehicle}
            />
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Conversación no encontrada o acceso denegado</p>
        )}
      </CardContent>
    </Card>
  );
};

type ConversationDetailsProps = {
  conversation: Conversation;
  messages: Message[] | undefined;
  hasPriceMentions: boolean | undefined;
  formatDate: (dateString: string) => string;
};

const ConversationDetails: React.FC<ConversationDetailsProps> = ({ 
  conversation, 
  messages, 
  hasPriceMentions,
  formatDate 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Información de la conversación</h3>
        <Separator className="my-2" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-sm font-medium">ID:</div>
        <div className="text-sm font-mono">{conversation.id}</div>
        
        <div className="text-sm font-medium">Estado:</div>
        <div className="text-sm">
          <span className={`px-2 py-1 rounded-full text-xs 
            ${conversation.status === 'active' ? 'bg-green-100 text-green-800' : 
              conversation.status === 'archived' ? 'bg-gray-100 text-gray-800' : 
              'bg-red-100 text-red-800'}`}>
            {conversation.status}
          </span>
        </div>
        
        <div className="text-sm font-medium">Creada:</div>
        <div className="text-sm">{formatDate(conversation.created_at)}</div>
        
        <div className="text-sm font-medium">Última actividad:</div>
        <div className="text-sm">{formatDate(conversation.updated_at)}</div>
        
        <div className="text-sm font-medium">Origen:</div>
        <div className="text-sm">{conversation.source_type || 'No especificado'}</div>
        
        <div className="text-sm font-medium">Título:</div>
        <div className="text-sm">{conversation.source_title || 'Sin título'}</div>
        
        <div className="text-sm font-medium">Mensajes:</div>
        <div className="text-sm">{messages?.length || 0}</div>
        
        <div className="text-sm font-medium">Posible transacción:</div>
        <div className="text-sm">
          {hasPriceMentions ? (
            <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
              Posible (menciones de precio)
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
              No detectada
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

type ParticipantsInfoProps = {
  buyerProfile: any | null;
  sellerProfile: any | null;
  vehicle: Vehicle | null;
  isLoadingBuyer: boolean;
  isLoadingSeller: boolean;
  isLoadingVehicle: boolean;
};

const ParticipantsInfo: React.FC<ParticipantsInfoProps> = ({
  buyerProfile,
  sellerProfile,
  vehicle,
  isLoadingBuyer,
  isLoadingSeller,
  isLoadingVehicle
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Participantes</h3>
        <Separator className="my-2" />
      </div>
      
      {/* Buyer */}
      <div className="space-y-2">
        <h4 className="text-md font-medium">Comprador:</h4>
        {isLoadingBuyer ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : buyerProfile ? (
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={buyerProfile.company_logo} />
              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{buyerProfile.full_name || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground">
                {buyerProfile.company_name || 'Sin empresa'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Información de comprador no disponible</p>
        )}
      </div>
      
      {/* Seller */}
      <div className="space-y-2">
        <h4 className="text-md font-medium">Vendedor:</h4>
        {isLoadingSeller ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : sellerProfile ? (
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={sellerProfile.company_logo} />
              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{sellerProfile.full_name || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground">
                {sellerProfile.company_name || 'Sin empresa'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Información de vendedor no disponible</p>
        )}
      </div>
      
      {/* Vehicle */}
      <div className="space-y-2">
        <h4 className="text-md font-medium">Vehículo:</h4>
        {isLoadingVehicle ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : vehicle ? (
          <div className="flex items-center space-x-4">
            <div className="h-16 w-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {vehicle.thumbnailurl ? (
                <img 
                  src={vehicle.thumbnailurl} 
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="object-cover h-full w-full"
                />
              ) : (
                <Car className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{vehicle.brand} {vehicle.model}</p>
              <p className="text-xs text-muted-foreground">
                {vehicle.year} • {vehicle.price ? `${vehicle.price}€` : 'Precio no disponible'}
              </p>
              <p className="text-xs text-muted-foreground">
                {vehicle.mileage ? `${vehicle.mileage} km` : 'Kilometraje no disponible'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Vehículo no disponible</p>
        )}
      </div>
    </div>
  );
};

export default ConversationOverview;
