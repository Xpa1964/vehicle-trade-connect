
import React from 'react';
import { Vehicle } from '@/types/vehicle';
import VehicleCard from './VehicleCard';
import VehicleGalleryCard from './VehicleGalleryCard';
import VehicleCardSkeleton from '@/components/ui/vehicle-skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useVehicleRecommendations } from '@/hooks/useVehicleRecommendations';

interface VehicleListProps {
  vehicles: Vehicle[];
  onResetSearch: () => void;
  compact?: boolean;
  isPublicView?: boolean;
  isLoading?: boolean;
}

const VehicleList: React.FC<VehicleListProps> = ({ 
  vehicles, 
  onResetSearch, 
  compact = false, 
  isPublicView = false,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const { trackVehicleVisit } = useVehicleRecommendations();

  // Función para hacer tracking cuando se hace clic en un vehículo
  const handleVehicleClick = (vehicleId: string) => {
    if (!isPublicView) {
      trackVehicleVisit(vehicleId, 'click', 'gallery');
    }
  };

  // Mostrar skeletons mientras carga
  if (isLoading) {
    const skeletonCount = compact ? 8 : 6;
    return (
      <div className={`grid gap-4 ${
        compact 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
      }`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <VehicleCardSkeleton 
            key={`skeleton-${index}`} 
            compact={compact}
          />
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-card rounded-lg border border-border p-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t('vehicles.noVehicles')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('vehicles.tryDifferentSearch')}
          </p>
          <Button onClick={onResetSearch} variant="outline" className="border-border text-foreground hover:bg-secondary">
            {t('vehicles.showAll')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${
      compact 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5' 
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
    }`}>
      {vehicles.map((vehicle, index) => (
        compact ? (
          <VehicleGalleryCard 
            key={vehicle.id} 
            vehicle={vehicle} 
            isPublicView={isPublicView}
            onVehicleClick={handleVehicleClick}
            priority={index < 4} // Priorizar las primeras 4 tarjetas
          />
        ) : (
          <VehicleCard 
            key={vehicle.id} 
            vehicle={vehicle}
            priority={index < 4} // Priorizar las primeras 4 tarjetas
            index={index}
          />
        )
      ))}
    </div>
  );
};

export default VehicleList;
