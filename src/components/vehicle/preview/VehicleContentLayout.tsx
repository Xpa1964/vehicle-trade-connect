
import React, { useState } from 'react';
import { Vehicle } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="space-y-8">
      {/* ═══════════════════════════════════════════ */}
      {/* MAIN LAYOUT: 60% Left / 40% Right          */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ──────────────────────────────────── */}
        {/* COLUMNA IZQUIERDA (3/5 = 60%)       */}
        {/* ──────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          {/* 1) GALERÍA DE IMÁGENES */}
          <div className="rounded-2xl overflow-hidden border border-border bg-card">
            <VehicleImageGallery vehicle={vehicle} />
          </div>

          {/* Owner action buttons */}
          {isOwner && (
            <VehicleActionButtons
              vehicle={vehicle}
              isOwner={isOwner}
              onDelete={onDelete}
            />
          )}

          {/* 2) INFORMACIÓN DETALLADA EN TABS */}
          <Card className="bg-card border-border rounded-2xl overflow-hidden">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start bg-secondary/50 rounded-none border-b border-border p-0 h-auto">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm"
                >
                  {t('vehicles.description')}
                </TabsTrigger>
                <TabsTrigger
                  value="technical"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm"
                >
                  {t('vehicles.technicalDetails')}
                </TabsTrigger>
                <TabsTrigger
                  value="status"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm"
                >
                  Estado
                </TabsTrigger>
                <TabsTrigger
                  value="docs"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm"
                >
                  Documentación
                </TabsTrigger>
              </TabsList>

              {/* TAB: Descripción */}
              <TabsContent value="description" className="p-6 mt-0">
                {vehicle.description ? (
                  <VehicleDescription description={vehicle.description} />
                ) : (
                  <p className="text-muted-foreground italic">{t('vehicles.noDescription')}</p>
                )}
              </TabsContent>

              {/* TAB: Información Técnica */}
              <TabsContent value="technical" className="p-6 mt-0">
                <VehicleInformationCard vehicleId={vehicle.id} />
              </TabsContent>

              {/* TAB: Estado / Historial */}
              <TabsContent value="status" className="p-6 mt-0 space-y-4">
                <DamageAccessCard vehicleId={vehicle.id} />
                <VehicleEquipmentCard vehicleId={vehicle.id} />
              </TabsContent>

              {/* TAB: Documentación */}
              <TabsContent value="docs" className="p-6 mt-0 space-y-4">
                <DocumentAccessCard vehicleId={vehicle.id} />
                <VehicleDataSheet vehicle={vehicle} />
                <CommissionCalculator
                  initialPrice={vehicle.price}
                  compact={true}
                  showTitle={true}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* ──────────────────────────────────── */}
        {/* COLUMNA DERECHA (2/5 = 40%) STICKY  */}
        {/* ──────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* TARJETA PRINCIPAL DE CONVERSIÓN */}
            <Card className="bg-card border-border rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-5">
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
                  <span className="text-4xl font-heading font-bold text-primary tracking-tight">
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
                <div className="grid grid-cols-2 gap-3">
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
                  <div className="space-y-3 pt-2">
                    <Button
                      className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
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

                {/* Non-authenticated CTA */}
                {!user && (
                  <Button
                    className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                    onClick={() => navigate('/auth')}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Inicia sesión para contactar
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Commission sale info if applicable */}
            {vehicle.commissionSale && (
              <Card className="bg-card border-border rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-foreground">Venta Comisionada</span>
                  </div>
                  {vehicle.publicSalePrice && (
                    <p className="text-sm text-muted-foreground">
                      PVP: {formatPrice(vehicle.publicSalePrice)}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* BLOQUE INFERIOR: VENDEDOR (FULL WIDTH)      */}
      {/* ═══════════════════════════════════════════ */}
      <Card className="bg-card border-border rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar / Logo */}
            <div className="flex-shrink-0">
              {sellerProfile?.company_logo ? (
                <img
                  src={sellerProfile.company_logo}
                  alt={sellerDisplayName}
                  className="h-16 w-16 object-contain rounded-xl border border-border"
                />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-secondary flex items-center justify-center border border-border">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-3">
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

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

              {ratingSummary && ratingSummary.total_ratings > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <UserRatingBadge
                    averageRating={Number(ratingSummary.average_rating)}
                    totalRatings={Number(ratingSummary.total_ratings)}
                    verifiedRatings={Number(ratingSummary.verified_ratings)}
                    compact={true}
                  />
                </div>
              )}
            </div>

            {/* Action */}
            <div className="flex-shrink-0">
              <Link to={isOwner ? '/profile' : `/user/${vehicle.user_id}`}>
                <Button variant="outline" className="rounded-xl">
                  <Building2 className="h-4 w-4 mr-2" />
                  {isOwner ? t('profile.editProfile') : t('profile.viewFullProfile')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

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
