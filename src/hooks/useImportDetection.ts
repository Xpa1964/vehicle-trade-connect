import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Vehicle } from '@/types/vehicle';

export const useImportDetection = (vehicle: Vehicle) => {
  const { user } = useAuth();

  // Obtener el perfil del usuario para conocer su país
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('country')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Lógica para determinar si mostrar la calculadora de importación
  const shouldShowImportCalculator = () => {
    // El usuario debe estar autenticado
    if (!user || !userProfile) return false;
    
    // El usuario debe ser español
    const isSpanishUser = userProfile.country === 'España' || userProfile.country === 'Spain';
    if (!isSpanishUser) return false;
    
    // El vehículo debe ser extranjero (no español)
    const isForeignVehicle = vehicle.country !== 'España' && 
                             vehicle.country !== 'Spain' && 
                             vehicle.country !== null && 
                             vehicle.country !== undefined;
    
    return isForeignVehicle;
  };

  return {
    shouldShowImportCalculator: shouldShowImportCalculator(),
    userCountry: userProfile?.country,
    vehicleCountry: vehicle.country,
    isLoading: !userProfile && !!user
  };
};