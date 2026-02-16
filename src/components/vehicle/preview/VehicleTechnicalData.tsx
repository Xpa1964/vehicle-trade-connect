
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
      <Card className="min-h-[500px] flex flex-col bg-card border-border">
        <CardContent className="flex-1 flex flex-col justify-between p-6">
          {/* Línea 1: Marca y modelo */}
          <div className="space-y-4">
            <div>
              <CardTitle className="text-2xl font-heading font-medium text-foreground tracking-tight">
                {vehicle.brand} {vehicle.model}
              </CardTitle>
            </div>

            {/* Línea 2: Precio */}
            <div>
              <span className="text-4xl font-heading font-medium text-primary tracking-tight">
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

            {/* Línea 4: Información técnica - Grid 3 columnas con celdas individuales */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Calendar, value: vehicle.year, show: true },
                { icon: Gauge, value: `${formatMileage(vehicle.mileage || 0)} km`, show: true },
                { icon: Fuel, value: vehicle.fuel, show: true },
                { icon: Settings, value: vehicle.transmission, show: true },
                { icon: Zap, value: vehicle.enginePower ? `${vehicle.enginePower} CV` : null, show: !!vehicle.enginePower },
                { icon: CircleDot, value: vehicle.engineSize ? `${vehicle.engineSize} cc` : null, show: !!vehicle.engineSize },
                { icon: DoorOpen, value: vehicle.doors, show: !!vehicle.doors },
                { icon: Palette, value: vehicle.color, show: !!vehicle.color },
                { icon: Car, value: vehicle.vehicleType, show: !!vehicle.vehicleType },
                { icon: ShieldCheck, value: vehicle.euroStandard?.toUpperCase(), show: !!vehicle.euroStandard },
                { icon: CloudOff, value: vehicle.co2Emissions ? `${vehicle.co2Emissions} g/km` : null, show: !!vehicle.co2Emissions },
                { icon: MapPin, value: vehicle.countryCode?.toUpperCase(), show: !!vehicle.countryCode },
              ].filter(item => item.show).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-3 shadow-[0_2px_6px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                    <Icon className="h-4 w-4 text-primary/70 flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Línea 5: Botones de contacto (al final) */}
          {showContactButtons && (
            <div className="space-y-3 pt-6 border-t border-border">
              {/* Botón Contactar con el Vendedor */}
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsContactDialogOpen(true)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {t('seller.contactSeller')}
              </Button>


              {/* Botón Calculadora de Importación - Usando el hook useImportDetection */}
              {!importDetectionLoading && shouldShowImportCalculator && (
                <Button 
                  variant="outline"
                  className="w-full border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
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
