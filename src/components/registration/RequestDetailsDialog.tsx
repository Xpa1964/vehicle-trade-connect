
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RegistrationRequest } from '@/hooks/useRegistrationRequests';
import ProfileCreationStatus from './ProfileCreationStatus';

interface RequestDetailsDialogProps {
  isOpen: boolean;
  request: RegistrationRequest | null;
  adminNotes: string;
  isProcessing: boolean;
  onOpenChange: (open: boolean) => void;
  onNotesChange: (notes: string) => void;
  onSaveNotes: () => void;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
}

export const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  isOpen,
  request,
  adminNotes,
  isProcessing,
  onOpenChange,
  onNotesChange,
  onSaveNotes,
  onUpdateStatus,
}) => {
  if (!request) return null;

  const getBusinessTypeLabel = (businessType: string) => {
    const businessTypes = {
      'dealer': 'Concesionario',
      'multibrand_used': 'Multimarca VO',
      'buy_sell': 'Compraventa',
      'rent_a_car': 'Rent a Car',
      'renting': 'Renting',
      'workshop': 'Taller',
      'importer': 'Importador',
      'exporter': 'Exportador',
      'trader': 'Comerciante',
      'other': 'Otro'
    };
    return businessTypes[businessType as keyof typeof businessTypes] || businessType;
  };

  const getTraderTypeLabel = (traderType: string) => {
    const traderTypes = {
      'buyer': 'Comprador',
      'seller': 'Vendedor',
      'trader': 'Comerciante',
      'buyer_seller': 'Comprador/Vendedor'
    };
    return traderTypes[traderType as keyof typeof traderTypes] || traderType;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Detalles de la Solicitud
            <Badge 
              className={`ml-2 ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}
            >
              {request.status === 'pending' ? 'Pendiente' :
               request.status === 'approved' ? 'Aprobado' : 'Rechazado'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Nombre de la Empresa</Label>
              <p className="text-sm">{request.company_name}</p>
            </div>
            <div>
              <Label className="font-semibold">Email</Label>
              <p className="text-sm">{request.email}</p>
            </div>
            <div>
              <Label className="font-semibold">Persona de Contacto</Label>
              <p className="text-sm">{request.contact_person}</p>
            </div>
            <div>
              <Label className="font-semibold">Teléfono</Label>
              <p className="text-sm">{request.phone}</p>
            </div>
            <div>
              <Label className="font-semibold">País</Label>
              <p className="text-sm">{request.country}</p>
            </div>
            <div>
              <Label className="font-semibold">Ciudad</Label>
              <p className="text-sm">{request.city}</p>
            </div>
          </div>

          {/* Business Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Tipo de Negocio</Label>
              <p className="text-sm">{getBusinessTypeLabel(request.business_type || '')}</p>
            </div>
            <div>
              <Label className="font-semibold">Tipo de Comerciante</Label>
              <p className="text-sm">{getTraderTypeLabel(request.trader_type || '')}</p>
            </div>
          </div>

          {/* Description */}
          {request.description && (
            <div>
              <Label className="font-semibold">Descripción</Label>
              <p className="text-sm bg-gray-50 p-3 rounded">{request.description}</p>
            </div>
          )}

          {/* Profile Creation Status */}
          <ProfileCreationStatus 
            registrationId={request.id}
            status={request.status}
          />

          {/* Admin Notes */}
          <div>
            <Label htmlFor="admin-notes" className="font-semibold">Notas de Administración</Label>
            <Textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Agregar notas internas..."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={onSaveNotes}
              disabled={isProcessing}
            >
              Guardar Notas
            </Button>
            
            <div className="space-x-2">
              {request.status === 'pending' && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => onUpdateStatus(request.id, 'rejected')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Procesando...' : 'Rechazar'}
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => onUpdateStatus(request.id, 'approved')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Procesando...' : 'Aprobar'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
