
import React, { useState } from 'react';
import { Vehicle } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, Gauge, Fuel, Settings, MapPin, MessageCircle,
  Calculator, Heart, FileText, AlertTriangle, Info, Car,
  Wrench, Zap, CircleDot, DoorOpen, Palette, ShieldCheck,
  CloudOff, Download, Building2, User, Phone, Star, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import VehicleImageGallery from './VehicleImageGallery';
import VehicleEquipmentCard from './VehicleEquipmentCard';
import VehicleDescription from './VehicleDescription';
import VehicleInformationCard from './VehicleInformationCard';
import VehicleActionButtons from './VehicleActionButtons';
import CommissionCalculator from '@/components/commission/CommissionCalculator';
import VehicleDataSheet from '../VehicleDataSheet';
import DamageAccessCard from './DamageAccessCard';
import DocumentAccessCard from './DocumentAccessCard';
import ExchangeBadge from '@/components/vehicles/ExchangeBadge';
import CommissionSaleBadge from '@/components/vehicles/CommissionSaleBadge';
import IvaBadge from '@/components/vehicles/IvaBadge';
import NearlyNewBadge from '@/components/vehicles/NearlyNewBadge';
import { isNearlyNew } from '@/utils/vehicleClassification';
import ContactSellerDialog from './ContactSellerDialog';
import UserRatingBadge from '@/components/shared/UserRatingBadge';
import { useRatings } from '@/hooks/useRatings';
import { useImportDetection } from '@/hooks/useImportDetection';

interface VehicleContentLayoutProps {
  vehicle: Vehicle;
  isOwner: boolean;
  onDelete: () => void;
}

const VehicleContentLayout: React.FC<VehicleContentLayoutProps> = ({
  vehicle,
  isOwner,
  onDelete
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const { shouldShowImportCalculator, isLoading: importDetectionLoading } = useImportDetection(vehicle);
  const { ratingSummary } = useRatings(vehicle.user_id);

  const { data: sellerProfile } = useQuery({
    queryKey: ['seller-profile', vehicle.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', vehicle.user_id)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!vehicle.user_id
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat('es-ES').format(mileage);

  const showContactButtons = user && !isOwner;
  const sellerDisplayName = sellerProfile?.company_name || sellerProfile?.full_name || t('common.user');

  return (
    <div className="space-y-6">

      {/* ═══════════════════════════════════════════ */}
      {/* FILA 1: Imagen principal (65%) + Info Card (35%) */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Imagen principal */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-border bg-card">
          <VehicleImageGallery vehicle={vehicle} canManage={isOwner} />
        </div>

        {/* Card Información del Vehículo */}
        <div className="lg:col-span-4">
          <Card className="bg-card border-border rounded-2xl overflow-hidden h-full">
            <CardContent className="p-5 space-y-4 flex flex-col justify-between h-full">
              {/* Marca + Modelo */}
              <div>
                <h1 className="text-2xl font-heading font-semibold text-foreground tracking-tight leading-tight">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {vehicle.year} · {vehicle.location || vehicle.country}
                </p>
              </div>

              {/* Precio */}
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <span className="text-3xl font-heading font-bold text-primary tracking-tight">
                  {formatPrice(vehicle.price || 0)}
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <IvaBadge ivaStatus={vehicle.ivaStatus || 'included'} />
                <ExchangeBadge acceptsExchange={vehicle.acceptsExchange || vehicle.accepts_exchange || false} />
                <CommissionSaleBadge isCommissionSale={vehicle.commissionSale || false} />
                <NearlyNewBadge isNearlyNew={isNearlyNew(vehicle.mileage || 0, vehicle.year)} />
                {vehicle.status && vehicle.status !== 'available' && (
                  <Badge
                    variant={vehicle.status === 'sold' ? 'destructive' : 'gold'}
                    className="text-xs"
                  >
                    {vehicle.status === 'sold' ? 'Vendido' : vehicle.status === 'reserved' ? 'Reservado' : vehicle.status}
                  </Badge>
                )}
              </div>

              {/* Especificaciones rápidas */}
              <div className="grid grid-cols-2 gap-2">
                <SpecItem icon={<Calendar className="h-4 w-4" />} label={t('vehicles.year')} value={String(vehicle.year)} />
                <SpecItem icon={<Gauge className="h-4 w-4" />} label={t('vehicles.mileage')} value={`${formatMileage(vehicle.mileage || 0)} km`} />
                <SpecItem icon={<Fuel className="h-4 w-4" />} label={t('vehicles.fuel')} value={vehicle.fuel} />
                <SpecItem icon={<Settings className="h-4 w-4" />} label={t('vehicles.transmission')} value={vehicle.transmission} />
                {vehicle.enginePower && (
                  <SpecItem icon={<Zap className="h-4 w-4" />} label="Potencia" value={`${vehicle.enginePower} CV`} />
                )}
                <SpecItem icon={<MapPin className="h-4 w-4" />} label={t('vehicles.location')} value={vehicle.location || vehicle.country || '—'} />
              </div>

              {/* CTA Principal */}
              {showContactButtons && (
                <div className="space-y-2 pt-1">
                  <Button
                    className="w-full h-11 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                    onClick={() => setIsContactDialogOpen(true)}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {t('seller.contactSeller')}
                  </Button>

                  {!importDetectionLoading && shouldShowImportCalculator && (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
                      onClick={() => navigate(`/import-calculator?from_vehicle=${vehicle.id}&vehicle_info=${encodeURIComponent(`${vehicle.brand} ${vehicle.model} ${vehicle.year}`)}`)}
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Gastos de importación
                    </Button>
                  )}
                </div>
              )}

              {!user && (
                <Button
                  className="w-full h-11 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                  onClick={() => navigate('/auth')}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Inicia sesión para contactar
                </Button>
              )}

              {/* Commission sale info */}
              {vehicle.commissionSale && (
                <div className="flex items-center gap-2 p-3 bg-secondary/40 rounded-xl">
                  <Info className="h-4 w-4 text-purple-400" />
                  <div>
                    <span className="text-sm font-medium text-foreground">Venta Comisionada</span>
                    {vehicle.publicSalePrice && (
                      <p className="text-xs text-muted-foreground">PVP: {formatPrice(vehicle.publicSalePrice)}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Owner action buttons */}
      {isOwner && (
        <VehicleActionButtons
          vehicle={vehicle}
          isOwner={isOwner}
          onDelete={onDelete}
        />
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* FILA 3: Vendedor (izq) + Descripción (der)  */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card Vendedor */}
        <div className="lg:col-span-5">
          <Card className="bg-card border-border rounded-2xl overflow-hidden h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                Vendedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {sellerProfile?.company_logo ? (
                    <img
                      src={sellerProfile.company_logo}
                      alt={sellerDisplayName}
                      className="h-14 w-14 object-contain rounded-xl border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center border border-border flex-shrink-0">
                      <User className="h-7 w-7 text-muted-foreground" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {sellerDisplayName}
                      </h3>
                      {sellerProfile?.trader_type && (
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground flex-shrink-0">
                          {sellerProfile.trader_type === 'professional' ? 'Profesional' : 'Particular'}
                        </Badge>
                      )}
                      {isOwner && (
                        <Badge variant="primary" className="text-xs flex-shrink-0">
                          {t('common.owner')}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {vehicle.location || vehicle.country || t('vehicles.locationNotSpecified')}
                      </span>
                      {sellerProfile?.contact_phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {sellerProfile.contact_phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {ratingSummary && ratingSummary.total_ratings > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <UserRatingBadge
                      averageRating={Number(ratingSummary.average_rating)}
                      totalRatings={Number(ratingSummary.total_ratings)}
                      verifiedRatings={Number(ratingSummary.verified_ratings)}
                      compact={true}
                    />
                  </div>
                )}

                <Link to={isOwner ? '/profile' : `/user/${vehicle.user_id}`}>
                  <Button variant="outline" className="w-full rounded-xl">
                    <Building2 className="h-4 w-4 mr-2" />
                    {isOwner ? t('profile.editProfile') : t('profile.viewFullProfile')}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Descripción */}
        <div className="lg:col-span-7">
          <Card className="bg-card border-border rounded-2xl overflow-hidden h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-muted-foreground" />
                {t('vehicles.description')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.description ? (
                <VehicleDescription description={vehicle.description} />
              ) : (
                <p className="text-muted-foreground italic">{t('vehicles.noDescription')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* FILA 4: Equipamiento + Info + Herramientas  */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Equipamiento */}
        <div className="lg:col-span-4">
          <Card className="bg-card border-border rounded-2xl overflow-hidden h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wrench className="h-5 w-5 text-muted-foreground" />
                Equipamiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleEquipmentCard vehicleId={vehicle.id} />
            </CardContent>
          </Card>
        </div>

        {/* Información */}
        <div className="lg:col-span-4">
          <Card className="bg-card border-border rounded-2xl overflow-hidden h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5 text-muted-foreground" />
                Información
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleInformationCard vehicleId={vehicle.id} />
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: stack vertical de herramientas */}
        <div className="lg:col-span-4 space-y-6">
          {/* Calculadora de Comisiones */}
          <Card className="bg-card border-border rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-muted-foreground" />
                Calculadora de Comisiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommissionCalculator
                initialPrice={vehicle.price}
                compact={true}
                showTitle={false}
              />
            </CardContent>
          </Card>

          {/* Ficha Técnica */}
          <Card className="bg-card border-border rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Download className="h-5 w-5 text-muted-foreground" />
                Ficha Técnica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleDataSheet vehicle={vehicle} />
            </CardContent>
          </Card>

          {/* Estado */}
          <Card className="bg-card border-border rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                Estado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DamageAccessCard vehicleId={vehicle.id} />
            </CardContent>
          </Card>

          {/* Archivos */}
          <Card className="bg-card border-border rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Archivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentAccessCard vehicleId={vehicle.id} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Dialog */}
      {sellerProfile && (
        <ContactSellerDialog
          sellerId={vehicle.user_id}
          vehicleId={vehicle.id}
          sellerName={sellerProfile.full_name || sellerProfile.company_name || 'Vendedor'}
          isOpen={isContactDialogOpen}
          onOpenChange={setIsContactDialogOpen}
        />
      )}
    </div>
  );
};

/* ─── Spec Item Component ─── */
const SpecItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl">
    <div className="text-muted-foreground flex-shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground leading-none">{label}</p>
      <p className="text-sm font-medium text-foreground truncate mt-0.5">{value}</p>
    </div>
  </div>
);

export default VehicleContentLayout;
