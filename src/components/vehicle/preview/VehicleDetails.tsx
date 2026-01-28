
import React from 'react';
import { Vehicle } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Fuel, 
  Settings, 
  Gauge, 
  Palette,
  FileText,
  Euro,
  Users
} from 'lucide-react';

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle }) => {
  const { t } = useLanguage();

  console.log('VehicleDetails - Commission data:', {
    commissionSale: vehicle.commissionSale,
    publicSalePrice: vehicle.publicSalePrice,
    commissionAmount: vehicle.commissionAmount,
    commissionQuery: vehicle.commissionQuery
  });

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">{t('vehicles.basicInfo')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('vehicles.location')}:</span>
            <span className="font-medium text-foreground">{vehicle.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('vehicles.year')}:</span>
            <span className="font-medium text-foreground">{vehicle.year}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('vehicles.fuel')}:</span>
            <span className="font-medium text-foreground">{vehicle.fuel}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('vehicles.transmission')}:</span>
            <span className="font-medium text-foreground">{vehicle.transmission}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('vehicles.mileage')}:</span>
            <span className="font-medium text-foreground">{vehicle.mileage?.toLocaleString()} km</span>
          </div>
          
          {vehicle.color && (
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t('vehicles.color')}:</span>
              <span className="font-medium text-foreground">{vehicle.color}</span>
            </div>
          )}
        </div>
      </div>

      {/* Commission Sale Information */}
      {vehicle.commissionSale && (
        <div className="bg-purple-500/10 rounded-lg shadow-sm border border-purple-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-semibold text-purple-300">{t('vehicles.commissionSaleTitle')}</h3>
          </div>
          
          <div className="space-y-3">
            {vehicle.publicSalePrice && (
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-400">{t('vehicles.publicSalePrice')}:</span>
                <span className="font-bold text-purple-300">€{vehicle.publicSalePrice.toLocaleString()}</span>
              </div>
            )}
            
            {vehicle.commissionAmount && (
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-400">{t('vehicles.commissionAmount')}:</span>
                <span className="font-bold text-purple-300">€{vehicle.commissionAmount.toLocaleString()}</span>
              </div>
            )}
            
            {vehicle.commissionQuery && (
              <div className="mt-3">
                <span className="text-sm text-purple-400">{t('vehicles.additionalInformation')}:</span>
                <p className="text-purple-300 bg-secondary p-3 rounded border border-purple-500/30 mt-1">
                  {vehicle.commissionQuery}
                </p>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-secondary rounded border border-purple-500/30">
              <p className="text-xs text-purple-400">
                {t('vehicles.commissionSaleDescription')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {vehicle.description && (
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground">{t('vehicles.description')}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{vehicle.description}</p>
        </div>
      )}

      {/* Status Badge */}
      <div className="flex justify-center">
        <Badge 
          variant={vehicle.status === 'available' ? 'default' : 'secondary'}
          className="text-sm py-1 px-3"
        >
          {t(`vehicles.status.${vehicle.status}`)}
        </Badge>
      </div>
    </div>
  );
};

export default VehicleDetails;
