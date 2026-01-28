
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Fuel, Gauge, Palette, Settings, MessageCircle, Calculator, Zap, DoorOpen, CircleDot, ShieldCheck, CloudOff, Car } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ExchangeBadge from '@/components/vehicles/ExchangeBadge';
import CommissionSaleBadge from '@/components/vehicles/CommissionSaleBadge';
import IvaBadge from '@/components/vehicles/IvaBadge';
import NearlyNewBadge from '@/components/vehicles/NearlyNewBadge';
import { isNearlyNew } from '@/utils/vehicleClassification';
import ContactSellerDialog from './ContactSellerDialog';

import { useImportDetection } from '@/hooks/useImportDetection';

interface VehicleTechnicalDataProps {
  vehicle: Vehicle;
  isOwner?: boolean;
}

const VehicleTechnicalData: React.FC<VehicleTechnicalDataProps> = ({ vehicle, isOwner = false }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  // Hook para detectar si mostrar calculadora de importación
  const { shouldShowImportCalculator, isLoading: importDetectionLoading } = useImportDetection(vehicle);

  // Query para obtener información del vendedor
  const { data: sellerProfile } = useQuery({
    queryKey: ['seller-profile', vehicle.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', vehicle.user_id)
        .single();
      
      if (error) {
        console.error('Error fetching seller profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!vehicle.user_id
  });

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


  // Determinar si mostrar botones de contacto basado en usuario autenticado y propiedad
  const showContactButtons = user && !isOwner;

  // Debug logging para development
  console.log('VehicleTechnicalData - Import calculator debug:', {
    user: !!user,
    isOwner,
    shouldShowImportCalculator,
    importDetectionLoading,
    vehicleCountry: vehicle.country,
    vehicleId: vehicle.id
  });

  return (
    <>
      <Card className="min-h-[500px] flex flex-col">
        <CardContent className="flex-1 flex flex-col justify-between p-6">
          {/* Línea 1: Marca y modelo */}
          <div className="space-y-4">
            <div>
              <CardTitle className="text-2xl font-heading font-medium text-neutral-900 tracking-tight">
                {vehicle.brand} {vehicle.model}
              </CardTitle>
            </div>

            {/* Línea 2: Precio */}
            <div>
              <span className="text-4xl font-heading font-medium text-brand-orange tracking-tight">
                {formatPrice(vehicle.price || 0)}
              </span>
            </div>

            {/* Línea 3: Badges */}
            <div className="flex flex-wrap gap-2">
              <ExchangeBadge acceptsExchange={vehicle.acceptsExchange || vehicle.accepts_exchange || false} />
              <CommissionSaleBadge isCommissionSale={vehicle.commissionSale || false} />
              <IvaBadge ivaStatus={vehicle.ivaStatus || 'included'} />
              <NearlyNewBadge isNearlyNew={isNearlyNew(vehicle.mileage || 0, vehicle.year)} />
            </div>

            {/* Línea 4: Información técnica - Grid 3 columnas */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
              {/* FILA 1: Datos básicos */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                <span className="text-sm font-body">
                  <span className="font-medium text-neutral-700">{t('vehicles.year')}:</span> 
                  <span className="font-semibold text-neutral-900 ml-1">{vehicle.year}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                <span className="text-sm font-body">
                  <span className="font-medium text-neutral-700">{t('vehicles.mileage')}:</span> 
                  <span className="font-semibold text-neutral-900 ml-1">{formatMileage(vehicle.mileage || 0)} km</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                <span className="text-sm font-body">
                  <span className="font-medium text-neutral-700">{t('vehicles.fuel')}:</span> 
                  <span className="font-semibold text-neutral-900 ml-1">{vehicle.fuel}</span>
                </span>
              </div>
              
              {/* FILA 2: Mecánica */}
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                <span className="text-sm font-body">
                  <span className="font-medium text-neutral-700">{t('vehicles.transmission')}:</span> 
                  <span className="font-semibold text-neutral-900 ml-1">{vehicle.transmission}</span>
                </span>
              </div>
              
              {vehicle.enginePower && (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="text-sm font-body">
                    <span className="font-medium text-neutral-700">{t('vehicles.power', { fallback: 'Potencia' })}:</span> 
                    <span className="font-semibold text-neutral-900 ml-1">{vehicle.enginePower} CV</span>
                  </span>
                </div>
              )}
              
              {vehicle.engineSize && (
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="text-sm font-body">
                    <span className="font-medium text-neutral-700">{t('vehicles.engineSize', { fallback: 'Cilindrada' })}:</span> 
                    <span className="font-semibold text-neutral-900 ml-1">{vehicle.engineSize} cc</span>
                  </span>
                </div>
              )}
              
              {/* FILA 3: Características físicas */}
              {vehicle.doors && (
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="text-sm font-body">
                    <span className="font-medium text-neutral-700">{t('vehicles.doors', { fallback: 'Puertas' })}:</span> 
                    <span className="font-semibold text-neutral-900 ml-1">{vehicle.doors}</span>
                  </span>
                </div>
              )}
              
              {vehicle.color && (
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="text-sm font-body">
                    <span className="font-medium text-neutral-700">{t('vehicles.color')}:</span> 
                    <span className="font-semibold text-neutral-900 ml-1">{vehicle.color}</span>
                  </span>
                </div>
              )}
              
              {vehicle.vehicleType && (
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="text-sm font-body">
                    <span className="font-medium text-neutral-700">{t('vehicles.type', { fallback: 'Tipo' })}:</span> 
                    <span className="font-semibold text-neutral-900 ml-1">{vehicle.vehicleType}</span>
                  </span>
                </div>
              )}
              
              {/* FILA 4: Emisiones y normativas */}
              {vehicle.euroStandard && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="text-sm font-body">
                    <span className="font-medium text-neutral-700">{t('vehicles.euroStandard', { fallback: 'Normativa' })}:</span> 
                    <span className="font-semibold text-neutral-900 ml-1">{vehicle.euroStandard.toUpperCase()}</span>
                  </span>
                </div>
              )}
              
              {vehicle.co2Emissions && (
                <div className="flex items-center gap-2">
                  <CloudOff className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="text-sm font-body">
                    <span className="font-medium text-neutral-700">{t('vehicles.co2', { fallback: 'CO₂' })}:</span> 
                    <span className="font-semibold text-neutral-900 ml-1">{vehicle.co2Emissions} g/km</span>
                  </span>
                </div>
              )}
              
              {vehicle.countryCode && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="text-sm font-body">
                    <span className="font-medium text-neutral-700">{t('vehicles.location')}:</span> 
                    <span className="font-semibold text-neutral-900 ml-1">{vehicle.countryCode.toUpperCase()}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Línea 5: Botones de contacto (al final) */}
          {showContactButtons && (
            <div className="space-y-3 pt-6 border-t">
              {/* Botón Contactar con el Vendedor */}
              <Button 
                className="w-full"
                onClick={() => setIsContactDialogOpen(true)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {t('seller.contactSeller')}
              </Button>


              {/* Botón Calculadora de Importación - Usando el hook useImportDetection */}
              {!importDetectionLoading && shouldShowImportCalculator && (
                <Button 
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate(`/import-calculator?from_vehicle=${vehicle.id}&vehicle_info=${encodeURIComponent(`${vehicle.brand} ${vehicle.model} ${vehicle.year}`)}`)}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Conoce los gastos de importación
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogos */}
      {sellerProfile && (
        <ContactSellerDialog
          sellerId={vehicle.user_id}
          vehicleId={vehicle.id}
          sellerName={sellerProfile.full_name || sellerProfile.company_name || 'Vendedor'}
          isOpen={isContactDialogOpen}
          onOpenChange={setIsContactDialogOpen}
        />
      )}

    </>
  );
};

export default VehicleTechnicalData;
