
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '@/types/vehicle';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { getCountryFlagUrl } from '@/utils/countryUtils';
import FastImage from '@/components/shared/FastImage';
import ExchangeBadge from './ExchangeBadge';
import CommissionSaleBadge from './CommissionSaleBadge';
import IvaBadge from './IvaBadge';
import { useCommissionSaleDetection } from '@/hooks/useCommissionSaleDetection';
import StatusOverlay from '@/components/shared/StatusOverlay';

interface VehicleGalleryCardProps {
  vehicle: Vehicle;
  isPublicView?: boolean;
  onVehicleClick?: (vehicleId: string) => void;
  priority?: boolean;
}

const VehicleGalleryCard: React.FC<VehicleGalleryCardProps> = ({ 
  vehicle, 
  isPublicView = false,
  onVehicleClick,
  priority = false
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Detectar automáticamente si debe ser venta comisionada
  const shouldBeCommissionSale = useCommissionSaleDetection(vehicle);

  const handleViewClick = () => {
    // Hacer tracking si la función está disponible
    onVehicleClick?.(vehicle.id);
    
    if (isPublicView) {
      navigate('/register');
      return;
    }
    navigate(`/vehicle-preview/${vehicle.id}`);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'sold':
        return 'bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30';
      case 'reserved':
        return 'bg-primary/20 text-primary border-primary/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'sold':
        return t('vehicles.statusSold');
      case 'reserved':
        return t('vehicles.statusReserved');
      default:
        return t('vehicles.statusAvailable');
    }
  };

  const countryCode = vehicle.countryCode?.toLowerCase() || 'es';

  return (
    <Card 
      className="overflow-hidden group cursor-pointer bg-card border-border hover:border-primary/30 hover:shadow-lg transition-shadow h-full" 
      onClick={handleViewClick}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-secondary">
        <FastImage
          src={vehicle.thumbnailUrl || vehicle.thumbnailurl || '/placeholder-vehicle.jpg'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
          priority={priority}
          showLoadingState={true}
        />
        
        {/* Bandera del país en la esquina superior izquierda */}
        <div className="absolute top-2 left-2 z-10">
          <img 
            src={getCountryFlagUrl(countryCode)} 
            alt={`${vehicle.country} flag`}
            className="w-6 h-4 object-cover rounded-sm shadow-sm border border-white/20"
            loading={priority ? 'eager' : 'lazy'}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        
        {/* Estado del vehículo - siempre visible */}
        <div className="absolute top-2 right-2 z-10">
          <Badge 
            className={cn(
              "font-medium border text-xs px-2 py-1",
              getStatusColor(vehicle.status)
            )}
          >
            {getStatusText(vehicle.status)}
          </Badge>
        </div>
        
        {isPublicView && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <div className="bg-card/90 px-2 py-1 rounded flex items-center border border-border">
              <Lock className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Regístrate</span>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <div className="mb-2">
          <h3 className="text-sm font-bold truncate text-foreground">{vehicle.brand} {vehicle.model}</h3>
          <p className="text-base font-bold text-primary">
            {formatCurrency(vehicle.price || 0, vehicle.currency || 'EUR')}
          </p>
        </div>
        
        {/* Año y kilometraje */}
        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mb-2">
          <span>{vehicle.year}</span>
          <span>•</span>
          <span>{vehicle.mileage} {vehicle.mileageUnit || 'km'}</span>
        </div>
        
        {/* Badges section - parte inferior */}
        <div className="flex flex-wrap gap-1 items-center">
          <ExchangeBadge acceptsExchange={vehicle.acceptsExchange || vehicle.accepts_exchange || false} compact />
          <CommissionSaleBadge isCommissionSale={shouldBeCommissionSale} compact />
          <IvaBadge ivaStatus={vehicle.ivaStatus || 'included'} compact />
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleGalleryCard;
