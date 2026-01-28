
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ErrorState } from '@/components/vehicles/equipment/ErrorState';
import { toast } from 'sonner';

const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      if (!id) throw new Error('Vehicle ID is required');
      
      console.log('Fetching vehicle with ID:', id);
      
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching vehicle:', error);
          toast.error(t('vehicles.notFound', { fallback: 'Vehículo no encontrado' }));
          throw error;
        }
        
        if (!data) {
          console.error('Vehicle not found');
          toast.error(t('vehicles.notFound', { fallback: 'Vehículo no encontrado' }));
          throw new Error('Vehicle not found');
        }
        
        console.log('Vehicle data retrieved:', data);
        return data;
      } catch (err) {
        console.error('Exception in vehicle fetch:', err);
        toast.error(t('vehicles.loadError', { fallback: 'Error al cargar los datos del vehículo' }));
        throw err;
      }
    },
    retry: 1,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-pulse text-xl">{t('common.loading', { fallback: 'Cargando...' })}</div>
      </div>
    );
  }

  // Handle error state
  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back', { fallback: 'Volver' })}
        </Button>
        
        <ErrorState message={t('vehicles.loadError', { fallback: 'Error al cargar los datos del vehículo' })} />
      </div>
    );
  }

  // Mock technical details (would come from API in a real implementation)
  const technicalDetails = {
    enginePower: '150 CV',
    engineSize: '2.0L',
    doors: '5',
    color: 'Negro',
    fuelConsumption: '5.8L/100km',
    co2Emissions: '132 g/km',
    euStandard: 'Euro 6d',
    acceleration: '9.2s (0-100 km/h)',
    topSpeed: '210 km/h'
  };

  // Mock dimensions (would come from API in a real implementation)
  const dimensions = {
    length: '4.5m',
    width: '1.8m',
    height: '1.5m',
    weight: '1500 kg',
    wheelbase: '2.7m',
    trunkCapacity: '480L',
    fuelTankCapacity: '55L'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back', { fallback: 'Volver' })}
        </Button>
        <h1 className="text-2xl font-bold">
          {vehicle.brand} {vehicle.model} - {t('vehicles.details', { fallback: 'Detalles' })}
        </h1>
      </div>

      <div className="mb-8">
        <img 
          src="/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png" 
          alt="Kontact Logo" 
          className="w-32 mb-4"
        />
        <p className="text-lg text-gray-700 mb-6">
          {t('vehicles.detailsFullDescription', { 
            fallback: 'Información técnica y especificaciones detalladas del vehículo' 
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('vehicles.technicalDetails', { fallback: 'Detalles Técnicos' })}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(technicalDetails).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">{t(`vehicles.${key}`, { fallback: key })}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('vehicles.dimensions', { fallback: 'Dimensiones' })}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(dimensions).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">{t(`vehicles.${key}`, { fallback: key })}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
