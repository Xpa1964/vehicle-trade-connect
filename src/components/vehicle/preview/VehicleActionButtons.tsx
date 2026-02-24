
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types/vehicle';
import { Edit, Trash2, Info, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import CommissionSaleModal from './CommissionSaleModal';
import { VehicleStatusActions } from '@/components/vehicles/VehicleStatusActions';
import { useVehicleStatusChange } from '@/hooks/useVehicleStatusChange';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VehicleActionButtonsProps {
  vehicle: Vehicle;
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const VehicleActionButtons: React.FC<VehicleActionButtonsProps> = ({
  vehicle,
  isOwner,
  onEdit,
  onDelete
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(vehicle.status);
  const { markVehicleStatus } = useVehicleStatusChange();

  const isApiSource = vehicle.source === 'api';

  // Sync local status with external changes
  useEffect(() => {
    setLocalStatus(vehicle.status);
  }, [vehicle.status]);

  const handleEdit = () => {
    if (isApiSource) return;
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/upload-vehicle/${vehicle.id}`);
    }
  };

  const handleContactSeller = () => {
    setIsCommissionModalOpen(false);
  };

  const handleStatusChange = (status: 'reserved' | 'sold' | 'available') => {
    setLocalStatus(status);
    markVehicleStatus.mutate({ vehicleId: vehicle.id, status });
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {/* Botón de Venta Comisionada - visible para todos cuando aplica */}
        {vehicle.commissionSale && (
          <Button 
            variant="outline" 
            onClick={() => setIsCommissionModalOpen(true)} 
            className="flex-1 min-w-[130px] text-xs"
          >
            <Info className="h-3 w-3 mr-1" />
            {t('vehicles.commissionSaleButton')}
          </Button>
        )}

        {/* Botones de propietario */}
        {isOwner && (
          <>
            {isApiSource ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" disabled className="flex-1 min-w-[100px] text-xs opacity-60">
                      <Lock className="h-3 w-3 mr-1" />
                      {t('common.edit')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('vehicles.apiSourceEditBlocked', { fallback: 'This vehicle is managed via API. Edit through your integration.' })}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button variant="outline" onClick={handleEdit} className="flex-1 min-w-[100px] text-xs">
                <Edit className="h-3 w-3 mr-1" />
                {t('common.edit')}
              </Button>
            )}
            
            {onDelete && !isApiSource && (
              <Button variant="destructive" onClick={onDelete} className="flex-1 min-w-[100px] text-xs">
                <Trash2 className="h-3 w-3 mr-1" />
                {t('common.delete')}
              </Button>
            )}
            
            {/* Botones de estado contextual según estado actual */}
            {(localStatus === 'available' || localStatus === 'reserved' || localStatus === 'sold') && (
              <VehicleStatusActions
                vehicleId={vehicle.id}
                currentStatus={localStatus}
                onStatusChange={handleStatusChange}
                isPending={markVehicleStatus.isPending}
              />
            )}
          </>
        )}
      </div>
      
      {/* Modal de Venta Comisionada */}
      {vehicle.commissionSale && (
        <CommissionSaleModal
          vehicle={vehicle}
          isOpen={isCommissionModalOpen}
          onOpenChange={setIsCommissionModalOpen}
          onContactSeller={handleContactSeller}
        />
      )}
    </>
  );
};

export default VehicleActionButtons;
