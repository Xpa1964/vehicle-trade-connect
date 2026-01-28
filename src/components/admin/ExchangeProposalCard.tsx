
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
        return 'bg-warning/10 text-amber-400 border-warning/30';
      case 'accepted':
        return 'bg-success/10 text-[#22C55E] border-success/30';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-secondary text-foreground border-border';
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
        <div className="text-sm text-muted-foreground flex items-center gap-2">
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
        <div className="bg-secondary p-3 rounded-md border border-border">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Usuario que propone:</h4>
          <p className="text-sm text-foreground">
            {proposal.initiator?.profiles?.company_name || 
             proposal.initiator?.profiles?.full_name || 
             proposal.initiator?.email || 
             'Usuario desconocido'}
          </p>
          <p className="text-xs text-muted-foreground">{proposal.initiator?.email}</p>
        </div>

        {/* Vehículos del intercambio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vehículo ofrecido */}
          <div className="border border-success/30 p-3 rounded-md bg-success/10">
            <h4 className="font-medium text-sm text-[#22C55E] mb-2 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehículo Ofrecido
            </h4>
            {proposal.offered_vehicle ? (
              <div>
                <p className="font-medium text-foreground">
                  {proposal.offered_vehicle.brand} {proposal.offered_vehicle.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  Año: {proposal.offered_vehicle.year}
                </p>
                {proposal.offered_vehicle.mileage && (
                  <p className="text-sm text-muted-foreground">
                    Kilometraje: {proposal.offered_vehicle.mileage.toLocaleString()} km
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Información no disponible</p>
            )}
          </div>

          {/* Vehículo solicitado */}
          <div className="border border-info/30 p-3 rounded-md bg-info/10">
            <h4 className="font-medium text-sm text-[#0EA5E9] mb-2 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehículo Solicitado
            </h4>
            {proposal.requested_vehicle ? (
              <div>
                <p className="font-medium text-foreground">
                  {proposal.requested_vehicle.brand} {proposal.requested_vehicle.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  Año: {proposal.requested_vehicle.year}
                </p>
                {proposal.requested_vehicle.mileage && (
                  <p className="text-sm text-muted-foreground">
                    Kilometraje: {proposal.requested_vehicle.mileage.toLocaleString()} km
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Información no disponible</p>
            )}
          </div>
        </div>

        {/* Compensación */}
        {proposal.compensation > 0 && (
          <div className="bg-primary/10 p-3 rounded-md border border-primary/30">
            <h4 className="font-medium text-sm text-primary mb-1 flex items-center gap-2">
              <Euro className="h-4 w-4" />
              Compensación Adicional
            </h4>
            <p className="text-lg font-bold text-primary">
              €{proposal.compensation.toLocaleString()}
            </p>
          </div>
        )}

        {/* Condiciones */}
        {proposal.conditions && proposal.conditions.length > 0 && (
          <div className="bg-secondary p-3 rounded-md border border-border">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Condiciones:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {proposal.conditions.map((condition, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Acciones */}
        {proposal.conversation_id && onViewConversation && (
          <div className="pt-2 border-t border-border">
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
