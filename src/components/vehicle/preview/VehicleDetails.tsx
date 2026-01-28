
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
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4">{t('vehicles.basicInfo')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{t('vehicles.location')}:</span>
            <span className="font-medium">{vehicle.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{t('vehicles.year')}:</span>
            <span className="font-medium">{vehicle.year}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{t('vehicles.fuel')}:</span>
            <span className="font-medium">{vehicle.fuel}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{t('vehicles.transmission')}:</span>
            <span className="font-medium">{vehicle.transmission}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{t('vehicles.mileage')}:</span>
            <span className="font-medium">{vehicle.mileage?.toLocaleString()} km</span>
          </div>
          
          {vehicle.color && (
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{t('vehicles.color')}:</span>
              <span className="font-medium">{vehicle.color}</span>
            </div>
          )}
        </div>
      </div>

      {/* Commission Sale Information */}
      {vehicle.commissionSale && (
        <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-purple-600" />
            <h3 className="text-xl font-semibold text-purple-800">{t('vehicles.commissionSaleTitle')}</h3>
          </div>
          
          <div className="space-y-3">
            {vehicle.publicSalePrice && (
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-purple-600">{t('vehicles.publicSalePrice')}:</span>
                <span className="font-bold text-purple-800">€{vehicle.publicSalePrice.toLocaleString()}</span>
              </div>
            )}
            
            {vehicle.commissionAmount && (
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-purple-600">{t('vehicles.commissionAmount')}:</span>
                <span className="font-bold text-purple-800">€{vehicle.commissionAmount.toLocaleString()}</span>
              </div>
            )}
            
            {vehicle.commissionQuery && (
              <div className="mt-3">
                <span className="text-sm text-purple-600">{t('vehicles.additionalInformation')}:</span>
                <p className="text-purple-700 bg-white p-3 rounded border border-purple-200 mt-1">
                  {vehicle.commissionQuery}
                </p>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-white rounded border border-purple-200">
              <p className="text-xs text-purple-600">
                {t('vehicles.commissionSaleDescription')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {vehicle.description && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-gray-500" />
            <h3 className="text-xl font-semibold">{t('vehicles.description')}</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
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
