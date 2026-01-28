
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVehicleFilterData = () => {
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles-filter-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('brand, model, fuel_type')
        .eq('status', 'available');
      
      if (error) throw error;
      return data;
    }
  });

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(vehicles.map(v => v.brand).filter(Boolean))];
    return uniqueBrands.sort();
  }, [vehicles]);

  const fuelTypes = useMemo(() => {
    const uniqueFuelTypes = [...new Set(vehicles.map(v => v.fuel_type).filter(Boolean))];
    return uniqueFuelTypes.sort();
  }, [vehicles]);

  const getModelsForBrand = (brand: string) => {
    if (brand === 'all') return [];
    const modelsForBrand = vehicles
      .filter(v => v.brand === brand)
      .map(v => v.model)
      .filter(Boolean);
    return [...new Set(modelsForBrand)].sort();
  };

  return {
    brands,
    fuelTypes,
    getModelsForBrand
  };
};
