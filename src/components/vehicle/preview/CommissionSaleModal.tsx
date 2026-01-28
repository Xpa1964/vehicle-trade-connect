
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types/vehicle';
import { MessageCircle, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CommissionSaleModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSeller: () => void;
}

const CommissionSaleModal: React.FC<CommissionSaleModalProps> = ({
  vehicle,
  isOpen,
  onOpenChange,
  onContactSeller
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            {t('vehicles.commissionSaleTitle')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Precio Base */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('vehicles.basePrice')}:</span>
              <span className="text-lg font-semibold">
                {formatPrice(vehicle.price || 0)}
              </span>
            </div>
          </div>

          {/* Precio Público */}
          {vehicle.publicSalePrice && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700">{t('vehicles.publicSalePrice')}:</span>
                <span className="text-xl font-bold text-purple-800">
                  {formatPrice(vehicle.publicSalePrice)}
                </span>
              </div>
            </div>
          )}

          {/* Comisión */}
          {vehicle.commissionAmount && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">{t('vehicles.commissionAmount')}:</span>
                <span className="text-lg font-semibold text-blue-800">
                  {formatPrice(vehicle.commissionAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Consulta adicional */}
          {vehicle.commissionQuery && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="space-y-2">
                <span className="text-sm font-medium text-amber-700">{t('vehicles.additionalInformation')}:</span>
                <p className="text-sm text-amber-800">{vehicle.commissionQuery}</p>
              </div>
            </div>
          )}

          {/* Información del sistema */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t('vehicles.commissionSaleAlert')}
            </AlertDescription>
          </Alert>

          {/* Botón de contacto */}
          <div className="pt-2">
            <Button 
              onClick={onContactSeller}
              className="w-full"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('vehicles.contactSeller')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommissionSaleModal;
