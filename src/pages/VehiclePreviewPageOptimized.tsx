
import React, { Suspense } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types/vehicle';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import VehicleContentLayout from '@/components/vehicle/preview/VehicleContentLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Gavel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/shared/BackButton';
import { deleteVehicleWithRelatedRecords } from '@/services/vehicleDeletionService';

// Skeleton component para loading
const VehicleSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-6 w-48"></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="h-96 bg-gray-200 rounded"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

const VehiclePreviewPageOptimized: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Obtener el ID de la subasta desde los parámetros URL
  const fromAuction = searchParams.get('from_auction');

  console.log('VehiclePreviewPageOptimized - Params:', { id, fromAuction });

  // Query optimizada con mejor manejo de errores y validación
  const { data: vehicle, isLoading, error, refetch } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      if (!id) throw new Error('No vehicle ID provided');
      
      console.log('Fetching vehicle with ID:', id);
      
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images(id, image_url, is_primary, display_order),
          vehicle_information(technical_specs, additional_notes, maintenance_history),
          vehicle_equipment(equipment_id, equipment_items(name, standard_name)),
          vehicle_metadata(iva_status, coc_status, units, mileage_unit),
          profiles!vehicles_user_id_fkey(full_name, company_name, contact_phone)
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching vehicle:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Vehicle not found');
      }
      
      console.log('🔍 Raw vehicle data from DB:', data);
      console.log('🔍 Vehicle images from DB:', data.vehicle_images);
      
      // Map the database fields to match the Vehicle type
      const mappedVehicle: Vehicle = {
        ...data,
        countryCode: data.country_code || 'es',
        thumbnailUrl: data.thumbnailurl,
        userId: data.user_id,
        user_id: data.user_id,
        acceptsExchange: Boolean(data.accepts_exchange),
        accepts_exchange: data.accepts_exchange,
        commissionSale: Boolean(data.commission_sale),
        publicSalePrice: data.public_sale_price,
        commissionAmount: data.commission_amount,
        commissionQuery: data.commission_query,
        ivaStatus: data.vehicle_metadata?.[0]?.iva_status || 'included',
        cocStatus: data.vehicle_metadata?.[0]?.coc_status || false,
        units: data.vehicle_metadata?.[0]?.units || 1,
        mileageUnit: data.vehicle_metadata?.[0]?.mileage_unit || 'km',
        vehicle_images: data.vehicle_images || []
      };
      
      console.log('🔍 Mapped vehicle data with images:', {
        id: mappedVehicle.id,
        vehicle_images: mappedVehicle.vehicle_images,
        acceptsExchange: mappedVehicle.acceptsExchange,
        commissionSale: mappedVehicle.commissionSale,
        publicSalePrice: mappedVehicle.publicSalePrice,
        commissionAmount: mappedVehicle.commissionAmount,
        originalValue: data.accepts_exchange
      });
      
      return mappedVehicle;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.message?.includes('not found')) {
        return false;
      }
      return failureCount < 3;
    }
  });

  const handleDelete = React.useCallback(async () => {
    if (!vehicle || !id || !user?.id) {
      console.error('Missing required data for deletion:', { vehicle: !!vehicle, id, userId: user?.id });
      toast({
        title: 'Error',
        description: 'No se puede eliminar el vehículo. Datos requeridos faltantes.',
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Starting vehicle deletion process...', { vehicleId: id, userId: user.id });
      
      const success = await deleteVehicleWithRelatedRecords(
        id,
        user.id,
        () => {
          console.log('Vehicle deleted successfully, navigating to vehicles page');
          navigate('/vehicles');
        }
      );
      
      if (!success) {
        console.error('Vehicle deletion failed');
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el vehículo. Inténtalo de nuevo.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast({
        title: 'Error',
        description: 'Error inesperado al eliminar el vehículo.',
        variant: "destructive",
      });
    }
  }, [vehicle, id, user?.id, navigate, toast]);

  if (isLoading) {
    return (
      <Suspense fallback={<VehicleSkeleton />}>
        <VehicleSkeleton />
      </Suspense>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('vehicles.notFound', {})}</h1>
          <p className="text-gray-600 mb-6">
            {error?.message || t('vehicles.notFoundDescription', {})}
          </p>
          <div className="flex gap-4 justify-center">
            <BackButton 
              auctionId={fromAuction || undefined}
              label={t('common.goBack', {})}
            />
            <Button onClick={() => refetch()}>
              {t('common.retry', {})}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === vehicle.user_id || user?.id === vehicle.userId;

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-full mx-auto">
        <div className="mb-6 flex gap-4 items-center">
          <BackButton 
            auctionId={fromAuction || undefined}
            label={t('common.goBack', {})}
          />
          
          {fromAuction && (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auctions')}
              className="flex items-center gap-2"
            >
              <Gavel className="h-4 w-4" />
              Ver todas las subastas
            </Button>
          )}
        </div>

        <Suspense fallback={<VehicleSkeleton />}>
          <VehicleContentLayout 
            vehicle={vehicle} 
            isOwner={isOwner}
            onDelete={handleDelete}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default VehiclePreviewPageOptimized;
