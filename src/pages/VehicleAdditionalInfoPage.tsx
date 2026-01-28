
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockGetVehicleById } from '@/data/mockVehicles';
import { supabase } from '@/integrations/supabase/client';

const VehicleAdditionalInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  
  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      if (!id) throw new Error('Vehicle ID is required');
      
      // Get the actual vehicle data from Supabase
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (vehicleError) {
        console.error('Error fetching vehicle from Supabase:', vehicleError);
        // Fallback to mock data if there's an error
        return mockGetVehicleById(id);
      }
      
      if (vehicleData) {
        console.log('Vehicle data from Supabase:', vehicleData);
        return vehicleData;
      }
      
      // Fallback to mock data if no data found
      return mockGetVehicleById(id);
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-pulse text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">{t('common.error')}</h2>
          <p>{t('vehicles.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to={`/vehicle-preview/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back')}
          </Button>
        </Link>
        
        <Link to="/vehicles">
          <Button variant="outline" size="sm">
            {t('common.backToHome')}
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <img 
          src="/lovable-uploads/04f9dfe3-c94a-4610-8c2d-2bd0fc7136f0.png" 
          alt="Kontact Logo" 
          className="w-32 mb-4"
        />
        <h1 className="text-2xl font-bold">
          {vehicle.brand} {vehicle.model} - {t('vehicles.additionalInfo')}
        </h1>
        <p className="text-lg text-gray-700 mb-6">{t('vehicles.additionalInfoFullDescription')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('vehicles.additionalInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            {vehicle.description ? (
              <div className="whitespace-pre-wrap">{vehicle.description}</div>
            ) : (
              <p className="text-muted-foreground italic">
                {t('vehicles.noAdditionalInfo', { defaultValue: 'No additional information available for this vehicle.' })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleAdditionalInfoPage;
