
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types/vehicle';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import VehicleContentLayout from '@/components/vehicle/preview/VehicleContentLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VehiclePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const fromAuctionId = location.state?.fromAuction;

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      if (!id) throw new Error('No vehicle ID provided');
      
      console.log('Fetching vehicle with metadata for ID:', id);
      
      // Query with JOIN to get vehicle metadata
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_metadata (
            iva_status,
            coc_status,
            units,
            mileage_unit
          )
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching vehicle:', error);
        throw error;
      }
      
      console.log('Vehicle data with metadata:', data);
      
      // Map the database fields to match the Vehicle type
      const mappedVehicle: Vehicle = {
        ...data,
        countryCode: data.country_code || 'es',
        thumbnailUrl: data.thumbnailurl,
        userId: data.user_id,
        user_id: data.user_id,
        
        // Map commission sale fields from database (snake_case) to Vehicle interface (camelCase)
        acceptsExchange: Boolean(data.accepts_exchange),
        accepts_exchange: data.accepts_exchange,
        commissionSale: Boolean(data.commission_sale),
        publicSalePrice: data.public_sale_price,
        commissionAmount: data.commission_amount,
        commissionQuery: data.commission_query,
        
        // Map metadata fields if available
        ivaStatus: data.vehicle_metadata?.[0]?.iva_status || 'included',
        cocStatus: data.vehicle_metadata?.[0]?.coc_status || false,
        units: data.vehicle_metadata?.[0]?.units || 1,
        mileageUnit: data.vehicle_metadata?.[0]?.mileage_unit || 'km'
      };
      
      console.log('Mapped vehicle data with commission fields:', {
        id: mappedVehicle.id,
        commissionSale: mappedVehicle.commissionSale,
        publicSalePrice: mappedVehicle.publicSalePrice,
        commissionAmount: mappedVehicle.commissionAmount,
        commissionQuery: mappedVehicle.commissionQuery
      });
      
      return mappedVehicle;
    },
    enabled: !!id
  });

  const handleDelete = async () => {
    if (!vehicle || !id) return;
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: t('vehicles.deleted'),
        description: t('vehicles.deletedDescription'),
      });
      
      navigate('/vehicles');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: t('vehicles.deleteError'),
        description: t('vehicles.deleteErrorDescription'),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('vehicles.loadingVehicle')}</span>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('vehicles.notFound')}</h1>
          <p className="text-gray-600 mb-6">
            {t('vehicles.notFoundDescription')}
          </p>
          <Button onClick={() => navigate('/vehicles')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('vehicles.backToVehicles')}
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === vehicle.userId;

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          {fromAuctionId ? (
            <Button 
              variant="outline" 
              onClick={() => navigate(`/auctions/${fromAuctionId}`)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('navigation.backToAuction', { fallback: 'Volver a la Subasta' })}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate('/vehicles')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('vehicles.backToVehicles')}
            </Button>
          )}
        </div>

        <VehicleContentLayout 
          vehicle={vehicle} 
          isOwner={isOwner}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default VehiclePreviewPage;
