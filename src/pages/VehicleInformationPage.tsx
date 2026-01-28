import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Info, Wrench, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VehicleInformationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: vehicle, isLoading: vehicleLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      if (!id) throw new Error('No vehicle ID provided');
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Map the database fields to match the Vehicle type
      const mappedVehicle: Vehicle = {
        ...data,
        countryCode: data.country_code || 'es',
        thumbnailUrl: data.thumbnailurl,
        userId: data.user_id
      };
      
      return mappedVehicle;
    },
    enabled: !!id
  });

  const { data: information, isLoading: infoLoading } = useQuery({
    queryKey: ['vehicle-information', id],
    queryFn: async () => {
      if (!id) throw new Error('No vehicle ID provided');
      
      const { data, error } = await supabase
        .from('vehicle_information')
        .select('*')
        .eq('vehicle_id', id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching vehicle information:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!id
  });

  if (vehicleLoading || infoLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando información...</span>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vehículo no encontrado</h1>
          <Button onClick={() => navigate('/vehicles')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Vehículos
          </Button>
        </div>
      </div>
    );
  }

  const technicalSpecs = information?.technical_specs || {};
  const maintenanceHistory = information?.maintenance_history || {};
  const additionalNotes = information?.additional_notes || '';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/vehicle-preview/${id}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Vehículo
        </Button>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Información Adicional
          </h1>
          <p className="text-xl text-gray-600">
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Especificaciones Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Especificaciones Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(technicalSpecs).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(technicalSpecs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="font-medium">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No hay especificaciones técnicas disponibles
              </p>
            )}
          </CardContent>
        </Card>

        {/* Historial de Mantenimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Historial de Mantenimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(maintenanceHistory).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(maintenanceHistory).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <span className="font-medium block">{key}:</span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No hay historial de mantenimiento disponible
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notas Adicionales */}
      {additionalNotes && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Notas Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {additionalNotes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mensaje cuando no hay información */}
      {!information && (
        <Card className="mt-8">
          <CardContent className="text-center py-12">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay información adicional</h3>
            <p className="text-gray-500">
              Aún no se ha registrado información adicional para este vehículo.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleInformationPage;
