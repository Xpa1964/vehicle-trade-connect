import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VehicleDamage {
  id: string;
  vehicle_id: string | null;
  damage_type: string | null;
  description: string | null;
  severity: string | null;
  location: string | null;
  repair_cost: number | null;
  image_url: string | null;
  created_at: string | null;
}

export const useVehicleDamages = (vehicleId: string | undefined) => {
  return useQuery({
    queryKey: ['vehicle-damages', vehicleId],
    queryFn: async (): Promise<VehicleDamage[]> => {
      if (!vehicleId) return [];

      const { data, error } = await supabase
        .from('vehicle_damages')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching vehicle damages:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!vehicleId
  });
};