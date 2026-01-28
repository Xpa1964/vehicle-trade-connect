
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVehicleFilterData = () => {
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles-filter-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('brand, model, fuel, type, country, country_code, price, mileage, year')
        .order('brand');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const filterData = useMemo(() => {
    const brands = [...new Set(vehicles.map(v => v.brand).filter(Boolean))].sort();
    
    const countries = [...new Set(vehicles.map(v => ({
      code: v.country_code || 'es',
      name: v.country || 'España'
    })).filter(c => c.code))];

    const uniqueCountries = countries.filter((country, index, self) => 
      index === self.findIndex(c => c.code === country.code)
    );

    const fuelTypes = [...new Set(vehicles.map(v => v.fuel || v.type).filter(Boolean))].sort();

    return {
      brands,
      countries: uniqueCountries,
      fuelTypes,
      vehicles
    };
  }, [vehicles]);

  const getModelsForBrand = (brand: string) => {
    if (!brand || brand === 'all') return [];
    return [...new Set(vehicles
      .filter(v => v.brand === brand)
      .map(v => v.model)
      .filter(Boolean)
    )].sort();
  };

  return {
    ...filterData,
    getModelsForBrand,
    isLoading: !vehicles.length
  };
};
