
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Vehicle } from '@/types/vehicle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowRightLeft, Eye, Loader2 } from 'lucide-react';

interface VehicleComparisonCardProps {
  offeredVehicle: Partial<Vehicle>;
  requestedVehicle: Partial<Vehicle>;
  compensation?: number;
  conditions?: string;
  status: string;
  showActions?: boolean;
  isLoading?: boolean;
  onViewDetails: (vehicleId: string) => void;
  onAccept?: () => void;
  onReject?: () => void;
  onCounterOffer?: () => void;
}

const VehicleComparisonCard: React.FC<VehicleComparisonCardProps> = ({
  offeredVehicle,
  requestedVehicle,
  compensation,
  conditions,
  status,
  showActions = false,
  isLoading = false,
  onViewDetails,
  onAccept,
  onReject,
  onCounterOffer
}) => {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          {t('exchanges.proposalPending', { fallback: 'Pendiente' })}
        </Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {t('exchanges.acceptedTitle', { fallback: 'Aceptada' })}
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {t('exchanges.rejectedTitle', { fallback: 'Rechazada' })}
        </Badge>;
      case 'counteroffered':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {t('exchanges.counterofferedTitle', { fallback: 'Contraoferta' })}
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            {t('exchanges.proposedExchange', { fallback: 'Intercambio Propuesto' })}
          </CardTitle>
          {getStatusBadge(status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Vehicle Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Offered Vehicle */}
          <div className="border border-green-200 p-4 rounded-lg bg-green-50">
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              {t('exchanges.yourOffer', { fallback: 'Tu Oferta' })}
            </h4>
            {offeredVehicle.thumbnailUrl && (
              <img 
                src={offeredVehicle.thumbnailUrl} 
                alt={`${offeredVehicle.brand} ${offeredVehicle.model} ${offeredVehicle.year} - Vehículo ofrecido en intercambio`}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
            )}
            <div className="space-y-1">
              <p className="font-semibold">
                {offeredVehicle.brand} {offeredVehicle.model}
              </p>
              <p className="text-sm text-gray-600">
                {t('exchanges.year')}: {offeredVehicle.year}
              </p>
              {offeredVehicle.mileage && (
                <p className="text-sm text-gray-600">
                  {offeredVehicle.mileage.toLocaleString()} km
                </p>
              )}
              {offeredVehicle.price && (
                <p className="text-sm font-medium text-green-700">
                  €{offeredVehicle.price.toLocaleString()}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(offeredVehicle.id!)}
              className="mt-3 w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              {t('common.viewDetails', { fallback: 'Ver Detalles' })}
            </Button>
          </div>

          {/* Requested Vehicle */}
          <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
            <h4 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              {t('exchanges.theirOffer', { fallback: 'Su Oferta' })}
            </h4>
            {requestedVehicle.thumbnailUrl && (
              <img 
                src={requestedVehicle.thumbnailUrl} 
                alt={`${requestedVehicle.brand} ${requestedVehicle.model} ${requestedVehicle.year} - Vehículo solicitado en intercambio`}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
            )}
            <div className="space-y-1">
              <p className="font-semibold">
                {requestedVehicle.brand} {requestedVehicle.model}
              </p>
              <p className="text-sm text-gray-600">
                {t('exchanges.year')}: {requestedVehicle.year}
              </p>
              {requestedVehicle.mileage && (
                <p className="text-sm text-gray-600">
                  {requestedVehicle.mileage.toLocaleString()} km
                </p>
              )}
              {requestedVehicle.price && (
                <p className="text-sm font-medium text-blue-700">
                  €{requestedVehicle.price.toLocaleString()}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(requestedVehicle.id!)}
              className="mt-3 w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              {t('common.viewDetails', { fallback: 'Ver Detalles' })}
            </Button>
          </div>
        </div>

        {/* Additional Details */}
        {(compensation && compensation > 0) && (
          <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
            <h4 className="font-medium text-orange-700 mb-1">
              {t('exchanges.compensation')}
            </h4>
            <p className="text-lg font-bold text-orange-800">
              €{compensation.toLocaleString()}
            </p>
          </div>
        )}

        {conditions && (
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">
              {t('exchanges.additionalConditions')}:
            </h4>
            <p className="text-sm text-gray-600">{conditions}</p>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button
              onClick={onAccept}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              {t('exchanges.acceptProposal')}
            </Button>
            
            <Button
              variant="outline"
              onClick={onCounterOffer}
              disabled={isLoading}
              className="flex-1"
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              {t('exchanges.counterOffer')}
            </Button>
            
            <Button
              variant="outline"
              onClick={onReject}
              disabled={isLoading}
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              {t('exchanges.rejectProposal')}
            </Button>
          </div>
        )}

        {/* Status Messages */}
        {status === 'accepted' && (
          <div className="bg-green-50 p-3 rounded-md border border-green-200">
            <p className="text-green-700 text-sm">
              {t('exchanges.proposalAccepted')}
            </p>
          </div>
        )}

        {status === 'rejected' && (
          <div className="bg-red-50 p-3 rounded-md border border-red-200">
            <p className="text-red-700 text-sm">
              {t('exchanges.proposalRejected')}
            </p>
          </div>
        )}

        {status === 'counteroffered' && (
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <p className="text-blue-700 text-sm">
              {t('exchanges.counterOfferReceived')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleComparisonCard;
