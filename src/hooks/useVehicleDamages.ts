import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VehicleDamage {
  id: string;
  vehicle_id: string;
  damage_type: string;
  title: string;
  description: string | null;
  severity: string;
  location: string | null;
  estimated_cost: number | null;
  created_at: string;
  vehicle_damage_images?: any[];
}

export const useVehicleDamages = (vehicleId: string | undefined) => {
  return useQuery({
    queryKey: ['vehicle-damages', vehicleId],
    queryFn: async () => {
      if (!vehicleId) return [];

      const { data, error } = await supabase
        .from('vehicle_damages')
        .select(`
          *,
          vehicle_damage_images (*)
        `)
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching vehicle damages:', error);
        return [];
      }

      return data as VehicleDamage[];
    },
    enabled: !!vehicleId
  });
};