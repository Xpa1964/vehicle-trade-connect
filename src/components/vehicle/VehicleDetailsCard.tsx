
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, User, Phone, Calendar, MapPin, Fuel, Gauge, Palette, Settings } from 'lucide-react';
import ContactSellerDialog from './preview/ContactSellerDialog';
import { ImportCalculatorWidget } from './ImportCalculatorWidget';
import { useImportDetection } from '@/hooks/useImportDetection';
import ExchangeBadge from '@/components/vehicles/ExchangeBadge';
import CommissionSaleBadge from '@/components/vehicles/CommissionSaleBadge';
import IvaBadge from '@/components/vehicles/IvaBadge';

interface VehicleDetailsCardProps {
  vehicle: Vehicle;
  showSellerInfo?: boolean;
  showContactButton?: boolean;
}

const VehicleDetailsCard: React.FC<VehicleDetailsCardProps> = ({ 
  vehicle, 
  showSellerInfo = false,
  showContactButton = false
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { shouldShowImportCalculator } = useImportDetection(vehicle);
  const navigate = useNavigate();
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

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
    enabled: showSellerInfo || showContactButton
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

  if (showSellerInfo && sellerProfile) {
    // Mostrar información del vendedor
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <User className="h-5 w-5" />
            {t('seller.contact')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium text-foreground">{sellerProfile.full_name || sellerProfile.company_name}</p>
            {sellerProfile.contact_phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {sellerProfile.contact_phone}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {t('seller.memberSince')} {new Date(sellerProfile.created_at).getFullYear()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showContactButton && sellerProfile) {
    // Mostrar solo el botón de contactar
    return (
      <>
        <Button 
          className="w-full"
          onClick={() => setIsContactDialogOpen(true)}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {t('seller.contactSeller')}
        </Button>
        
        <ContactSellerDialog
          sellerId={vehicle.user_id}
          vehicleId={vehicle.id}
          sellerName={sellerProfile.full_name || sellerProfile.company_name || 'Vendedor'}
          isOpen={isContactDialogOpen}
          onOpenChange={setIsContactDialogOpen}
        />
      </>
    );
  }

  // Mostrar datos técnicos del vehículo
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl text-foreground">
            {vehicle.brand} {vehicle.model}
          </CardTitle>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(vehicle.price || 0)}
            </span>
            <div className="flex flex-col gap-2">
              <ExchangeBadge acceptsExchange={vehicle.acceptsExchange || vehicle.accepts_exchange || false} />
              <CommissionSaleBadge isCommissionSale={vehicle.commissionSale || false} />
              <IvaBadge ivaStatus={vehicle.ivaStatus || 'included'} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-3 shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200">
            <Calendar className="h-4 w-4 text-primary/70 flex-shrink-0" />
            <span className="text-sm font-semibold text-foreground">{vehicle.year}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-3 shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200">
            <Gauge className="h-4 w-4 text-primary/70 flex-shrink-0" />
            <span className="text-sm font-semibold text-foreground">{formatMileage(vehicle.mileage || 0)} km</span>
          </div>
          
          <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-3 shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200">
            <Fuel className="h-4 w-4 text-primary/70 flex-shrink-0" />
            <span className="text-sm font-semibold text-foreground">{vehicle.fuel}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-3 shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200">
            <Settings className="h-4 w-4 text-primary/70 flex-shrink-0" />
            <span className="text-sm font-semibold text-foreground">{vehicle.transmission}</span>
          </div>
          
          {vehicle.color && (
            <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-3 shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200">
              <Palette className="h-4 w-4 text-primary/70 flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground">{vehicle.color}</span>
            </div>
          )}
          
          {vehicle.countryCode && (
            <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-3 shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200">
              <MapPin className="h-4 w-4 text-primary/70 flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground">{vehicle.countryCode.toUpperCase()}</span>
            </div>
          )}
        </div>
        
        {/* Calculadora de Importación Automática */}
        {shouldShowImportCalculator && (
          <ImportCalculatorWidget vehicle={vehicle} />
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleDetailsCard;
