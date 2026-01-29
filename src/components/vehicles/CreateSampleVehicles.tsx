
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Car, Plus, Loader2 } from 'lucide-react';

const sampleVehicles = [
  {
    brand: 'BMW',
    model: 'Serie 3',
    year: 2020,
    price: 25000,
    mileage: 50000,
    type: 'sedan',
    condition: 'used',
    location: 'Madrid',
    country: 'España',
    country_code: 'es',
    description: 'BMW Serie 3 en excelente estado, mantenimiento al día',
    thumbnailurl: '/placeholder-vehicle.jpg',
    status: 'available'
  },
  {
    brand: 'Mercedes-Benz',
    model: 'Clase A',
    year: 2019,
    price: 22000,
    mileage: 60000,
    type: 'hatchback',
    condition: 'used',
    location: 'Barcelona',
    country: 'España',
    country_code: 'es',
    description: 'Mercedes Clase A, perfecto para ciudad',
    thumbnailurl: '/placeholder-vehicle.jpg',
    status: 'available'
  },
  {
    brand: 'Audi',
    model: 'A4',
    year: 2021,
    price: 30000,
    mileage: 30000,
    type: 'sedan',
    condition: 'used',
    location: 'Valencia',
    country: 'España',
    country_code: 'es',
    description: 'Audi A4 como nuevo, pocos kilómetros',
    thumbnailurl: '/placeholder-vehicle.jpg',
    status: 'available'
  }
];

const CreateSampleVehicles: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const createVehiclesMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const vehiclesWithUser = sampleVehicles.map(vehicle => ({
        ...vehicle,
        seller_id: user.id,
        user_id: user.id
      }));

      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehiclesWithUser)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`${data.length} vehículos de prueba creados exitosamente`);
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-count'] });
    },
    onError: (error) => {
      console.error('Error creating sample vehicles:', error);
      toast.error('Error al crear vehículos de prueba: ' + error.message);
    }
  });

  const handleCreateSamples = async () => {
    setIsCreating(true);
    try {
      await createVehiclesMutation.mutateAsync();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Crear Vehículos de Prueba
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Crea vehículos de prueba para poblar la galería y probar la funcionalidad.
        </p>
        
        <div className="space-y-2">
          <h4 className="font-medium">Se crearán:</h4>
          <ul className="text-sm space-y-1">
            {sampleVehicles.map((vehicle, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                {vehicle.brand} {vehicle.model} ({vehicle.year}) - {vehicle.location}
              </li>
            ))}
          </ul>
        </div>

        <Button 
          onClick={handleCreateSamples}
          disabled={isCreating || createVehiclesMutation.isPending}
          className="w-full"
        >
          {isCreating || createVehiclesMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creando vehículos...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Crear {sampleVehicles.length} Vehículos de Prueba
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateSampleVehicles;
