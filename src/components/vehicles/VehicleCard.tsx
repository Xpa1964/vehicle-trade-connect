
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/vehicle';
import { MapPin, Calendar, Fuel, Gauge } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import FastImage from '@/components/shared/FastImage';
import { isNearlyNew } from '@/utils/vehicleClassification';
import CommissionSaleBadge from './CommissionSaleBadge';
import { useCommissionSaleDetection } from '@/hooks/useCommissionSaleDetection';
import StatusOverlay from '@/components/shared/StatusOverlay';

interface VehicleCardProps {
  vehicle: Vehicle;
  showExchangeBadge?: boolean;
  priority?: boolean;
  index?: number;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  showExchangeBadge = true,
  priority = false,
  index = 0
}) => {
  const { t } = useLanguage();
  
  // Detectar automáticamente si debe ser venta comisionada
  const shouldBeCommissionSale = useCommissionSaleDetection(vehicle);

  // Priorizar las primeras 4 imágenes en móvil
  const shouldPrioritize = priority || index < 4;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('es-ES').format(mileage);
  };

  return (
    <Link to={`/vehicle/${vehicle.id}`} className="block">
      <Card className="overflow-hidden bg-card border-border hover:border-primary/30 hover:shadow-lg transition-shadow duration-300">
        {/* Image Section - Usando FastImage optimizado */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <FastImage
            src={vehicle.thumbnailUrl || '/placeholder.svg'}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year} - Imagen principal del vehículo`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            priority={shouldPrioritize}
            showLoadingState={true}
          />
          
          {/* Status overlay for sold/reserved/draft vehicles */}
          {(vehicle.status === 'sold' || vehicle.status === 'reserved') && (
            <StatusOverlay 
              status={vehicle.status as 'sold' | 'reserved'} 
              position="top-right" 
              size="md" 
            />
          )}
          {vehicle.status === 'draft' && (
            <div className="absolute top-2 right-2 z-20">
              <Badge className="bg-yellow-500/90 text-yellow-950 border-yellow-600/50 font-semibold text-xs">
                {t('vehicles.statusDraft', { fallback: 'Borrador' })}
              </Badge>
            </div>
          )}
          
          {/* Badges overlay */}
          <div className="absolute top-2 left-2 space-y-1 z-10 max-w-[calc(100%-8px)]">
            {showExchangeBadge && vehicle.acceptsExchange && (
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30 w-fit min-w-0 max-w-full">
                <span className="truncate">{t('vehicles.acceptsExchange')}</span>
              </Badge>
            )}
            {isNearlyNew(vehicle.mileage || 0, vehicle.year) && (
              <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/30 w-fit min-w-0 max-w-full">
                <span className="truncate">{t('vehicles.nearlyNew')}</span>
              </Badge>
            )}
            {/* Badge de venta comisionada */}
            {shouldBeCommissionSale && (
              <CommissionSaleBadge isCommissionSale={true} className="text-xs max-w-fit" />
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg truncate text-foreground">
              {vehicle.brand} {vehicle.model}
            </h3>
            <span className="text-lg font-bold text-primary ml-2">
              {formatPrice(vehicle.price || 0)}
            </span>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5 border border-white/[0.08]" style={{ background: 'hsl(222, 28%, 10%)', boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
              <Calendar className="h-3 w-3 text-primary/70 flex-shrink-0" />
              <span className="text-xs font-semibold text-foreground">{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5 border border-white/[0.08]" style={{ background: 'hsl(222, 28%, 10%)', boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
              <Gauge className="h-3 w-3 text-primary/70 flex-shrink-0" />
              <span className="text-xs font-semibold text-foreground">{formatMileage(vehicle.mileage || 0)} km</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5 border border-white/[0.08]" style={{ background: 'hsl(222, 28%, 10%)', boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
              <Fuel className="h-3 w-3 text-primary/70 flex-shrink-0" />
              <span className="text-xs font-semibold text-foreground">{vehicle.fuel}</span>
            </div>
            {vehicle.countryCode && (
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5 border border-white/[0.08]" style={{ background: 'hsl(222, 28%, 10%)', boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                <MapPin className="h-3 w-3 text-primary/70 flex-shrink-0" />
                <span className="text-xs font-semibold text-foreground">{vehicle.countryCode.toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* Description Preview */}
          {vehicle.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {vehicle.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default VehicleCard;
