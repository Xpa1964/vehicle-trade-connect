import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VehicleInformation {
  id: string;
  vehicle_id: string;
  technical_specifications?: string;
  maintenance_history?: string;
  additional_notes?: string;
  created_at: string;
  updated_at: string;
}

export const useVehicleInformation = (vehicleId: string | undefined) => {
  return useQuery({
    queryKey: ['vehicle-information', vehicleId],
    queryFn: async () => {
      if (!vehicleId) return null;

      const { data, error } = await supabase
        .from('vehicle_information')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching vehicle information:', error);
        return null;
      }

      return data as VehicleInformation | null;
    },
    enabled: !!vehicleId
  });
};