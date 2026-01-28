
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Car, Euro, MessageSquare, Calendar } from 'lucide-react';

interface ExchangeProposal {
  id: string;
  initiator_id: string;
  offered_vehicle_id: string;
  requested_vehicle_id: string;
  compensation: number;
  conditions: string[];
  status: string;
  created_at: string;
  conversation_id?: string;
  initiator?: {
    email: string;
    profiles?: {
      company_name?: string;
      full_name?: string;
    };
  };
  offered_vehicle?: {
    brand: string;
    model: string;
    year: number;
    mileage?: number;
  };
  requested_vehicle?: {
    brand: string;
    model: string;
    year: number;
    mileage?: number;
  };
}

interface ExchangeProposalCardProps {
  proposal: ExchangeProposal;
  onViewConversation?: (conversationId: string) => void;
}

const ExchangeProposalCard: React.FC<ExchangeProposalCardProps> = ({
  proposal,
  onViewConversation
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'accepted':
        return 'Aceptada';
      case 'rejected':
        return 'Rechazada';
      default:
        return status;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Propuesta de Intercambio
          </CardTitle>
          <Badge className={getStatusColor(proposal.status)}>
            {getStatusText(proposal.status)}
          </Badge>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {new Date(proposal.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información del usuario */}
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Usuario que propone:</h4>
          <p className="text-sm">
            {proposal.initiator?.profiles?.company_name || 
             proposal.initiator?.profiles?.full_name || 
             proposal.initiator?.email || 
             'Usuario desconocido'}
          </p>
          <p className="text-xs text-gray-500">{proposal.initiator?.email}</p>
        </div>

        {/* Vehículos del intercambio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vehículo ofrecido */}
          <div className="border border-green-200 p-3 rounded-md bg-green-50">
            <h4 className="font-medium text-sm text-green-700 mb-2 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehículo Ofrecido
            </h4>
            {proposal.offered_vehicle ? (
              <div>
                <p className="font-medium">
                  {proposal.offered_vehicle.brand} {proposal.offered_vehicle.model}
                </p>
                <p className="text-sm text-gray-600">
                  Año: {proposal.offered_vehicle.year}
                </p>
                {proposal.offered_vehicle.mileage && (
                  <p className="text-sm text-gray-600">
                    Kilometraje: {proposal.offered_vehicle.mileage.toLocaleString()} km
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Información no disponible</p>
            )}
          </div>

          {/* Vehículo solicitado */}
          <div className="border border-blue-200 p-3 rounded-md bg-blue-50">
            <h4 className="font-medium text-sm text-blue-700 mb-2 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehículo Solicitado
            </h4>
            {proposal.requested_vehicle ? (
              <div>
                <p className="font-medium">
                  {proposal.requested_vehicle.brand} {proposal.requested_vehicle.model}
                </p>
                <p className="text-sm text-gray-600">
                  Año: {proposal.requested_vehicle.year}
                </p>
                {proposal.requested_vehicle.mileage && (
                  <p className="text-sm text-gray-600">
                    Kilometraje: {proposal.requested_vehicle.mileage.toLocaleString()} km
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Información no disponible</p>
            )}
          </div>
        </div>

        {/* Compensación */}
        {proposal.compensation > 0 && (
          <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
            <h4 className="font-medium text-sm text-orange-700 mb-1 flex items-center gap-2">
              <Euro className="h-4 w-4" />
              Compensación Adicional
            </h4>
            <p className="text-lg font-bold text-orange-800">
              €{proposal.compensation.toLocaleString()}
            </p>
          </div>
        )}

        {/* Condiciones */}
        {proposal.conditions && proposal.conditions.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Condiciones:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {proposal.conditions.map((condition, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Acciones */}
        {proposal.conversation_id && onViewConversation && (
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewConversation(proposal.conversation_id!)}
              className="w-full flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Ver Conversación
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExchangeProposalCard;
