import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Vehicle } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { isNearlyNew } from '@/utils/vehicleClassification';
import { useDebounce } from '@/hooks/useDebounce';

export const useVehicleGallery = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  // FASE 2: Aplicar debounce al searchTerm para optimizar filtrado
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'compact' | 'normal'>('compact');
  const currentYear = new Date().getFullYear();
  
  // Ref para control de estado realtime
  const realtimeConnectedRef = useRef(false);
  
  const [filters, setFilters] = useState({
    country: 'all',
    brand: 'all',
    fuel: 'all',
    model: 'all',
    status: 'all',
    priceMin: 0,
    priceMax: 100000,
    mileageMin: 0,
    mileageMax: 200000,
    yearMin: 2000,
    yearMax: currentYear,
    // Special filters
    specialFilter: 'all',
    company: 'all',
  });

  const { data: vehicles = [], isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      try {
        console.log('🔄 [useVehicleGallery] Fetching vehicles from database...');
        
        // Obtener vehículos sin join
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (vehiclesError) {
          console.error('❌ [useVehicleGallery] Error fetching vehicles:', vehiclesError);
          throw vehiclesError;
        }

        // Obtener perfiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, company_name, full_name');

        if (profilesError) {
          console.error('❌ [useVehicleGallery] Error fetching profiles:', profilesError);
          // Continuar sin perfiles si hay error
        }

        console.log('📊 [useVehicleGallery] Raw data from database:', { 
          vehiclesCount: vehiclesData?.length,
          profilesCount: profilesData?.length 
        });

        if (!vehiclesData || vehiclesData.length === 0) {
          console.log('⚠️ [useVehicleGallery] No vehicles found in database');
          return [];
        }

        // Crear mapa de perfiles para lookup rápido
        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }

        const transformedData: Vehicle[] = vehiclesData.map(item => ({
          id: item.id,
          brand: item.brand || '',
          model: item.model || '',
          year: item.year || new Date().getFullYear(),
          price: item.price || 0,
          mileage: item.mileage || 0,
          location: item.location || '',
          country: item.country || 'España',
          countryCode: item.country_code || 'es',
          user_id: item.user_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          type: item.type || '',
          condition: item.condition || '',
          description: item.description || '',
          thumbnailUrl: item.thumbnailurl || '/placeholder.svg',
          status: (item.status as 'available' | 'reserved' | 'sold') || 'available',
          fuel: item.fuel || item.type || 'unknown',
          transmission: item.transmission || 'manual',
          mileageUnit: 'km',
          units: 1,
          ivaStatus: 'notIncluded',
          cocStatus: false,
          acceptsExchange: Boolean(item.accepts_exchange),
          vin: item.vin,
          licensePlate: item.license_plate,
          registrationDate: item.registration_date ? new Date(item.registration_date) : undefined,
          vehicleType: item.vehicle_type,
          transactionType: (item.transaction_type === 'import' || item.transaction_type === 'export' || item.transaction_type === 'national') 
            ? item.transaction_type as 'national' | 'import' | 'export'
            : 'national',
          engineSize: item.engine_size,
          enginePower: item.engine_power,
          color: item.color,
          doors: item.doors,
          // Añadir datos de perfil usando el mapa
          profiles: profilesMap.get(item.user_id) || null
        }));

        console.log('✅ [useVehicleGallery] Transformed vehicles:', transformedData.length, 'vehicles');
        
        return transformedData;
      } catch (error) {
        console.error('❌ [useVehicleGallery] Error in queryFn:', error);
        toast.error(t('common.error'));
        return [];
      }
    },
    // CONFIGURACIÓN OPTIMIZADA: Reduce conexiones innecesarias
    staleTime: 30 * 1000, // 30 segundos - realtime se encarga de actualizaciones
    gcTime: 5 * 60 * 1000, // 5 minutos en cache
    refetchOnWindowFocus: false, // Controlamos manualmente via realtime
    refetchOnMount: true, // Solo refetch si está stale (no 'always')
    refetchOnReconnect: true, // Refetch cuando se reconecta
  });

  // FUNCIÓN PARA ACTUALIZACIÓN OPTIMISTA DE VEHÍCULO ESPECÍFICO
  const updateVehicleOptimistically = useCallback((vehicleId: string, updates: Partial<Vehicle>) => {
    console.log('🚀 [useVehicleGallery] Applying optimistic update:', { vehicleId, updates });
    
    queryClient.setQueryData(['vehicles'], (oldData: Vehicle[] | undefined) => {
      if (!oldData) return oldData;
      
      return oldData.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, ...updates, updated_at: new Date().toISOString() }
          : vehicle
      );
    });
  }, [queryClient]);

  // FASE 2: ELIMINADO - Polling fallback redundante con realtime subscription

  // SUSCRIPCIÓN REALTIME MEJORADA CON CANAL ESPECÍFICO
  useEffect(() => {
    console.log('🔴 [useVehicleGallery] Setting up enhanced real-time subscription');
    
    const channel = supabase
      .channel('vehicles-changes') // Canal específico para vehículos
      .on(
        'postgres_changes',
        {
          event: '*', // Todos los eventos
          schema: 'public',
          table: 'vehicles'
        },
        (payload) => {
          console.log('🔄 [useVehicleGallery] Real-time change detected:', {
            event: payload.eventType,
            vehicleId: (payload.new as any)?.id || (payload.old as any)?.id,
            payload
          });
          
          // ACTUALIZACIÓN OPTIMISTA INMEDIATA
          if (payload.eventType === 'UPDATE' && payload.new) {
            const vehicleData = payload.new as any;
            if (vehicleData.id) {
              updateVehicleOptimistically(vehicleData.id, {
                status: vehicleData.status,
                country: vehicleData.country,
                countryCode: vehicleData.country_code,
                price: vehicleData.price,
                // Añadir otros campos que puedan cambiar
              });
            }
          }
          
          // FASE 2: Reducir frecuencia de invalidación (era 100ms, ahora 1000ms)
          setTimeout(() => {
            console.log('🔄 [useVehicleGallery] Cache invalidation after optimistic update');
            queryClient.refetchQueries({ queryKey: ['vehicles'] });
          }, 1000); // 1 segundo de delay
        }
      )
      .subscribe((status) => {
        console.log('📡 [useVehicleGallery] Realtime subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          realtimeConnectedRef.current = true;
          console.log('✅ [useVehicleGallery] Realtime subscription active');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          realtimeConnectedRef.current = false;
          console.error('❌ [useVehicleGallery] Realtime connection lost');
        }
      });

    return () => {
      console.log('🔴 [useVehicleGallery] Cleaning up realtime subscription');
      realtimeConnectedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [queryClient, updateVehicleOptimistically]);

  // Memoized filter calculations
  const availableBrands = useMemo(() => {
    const brands = [...new Set(vehicles.map(vehicle => vehicle.brand))];
    return brands.filter(Boolean).sort();
  }, [vehicles]);

  const availableModels = useMemo(() => {
    if (filters.brand === 'all') return [];
    
    const models = vehicles
      .filter(vehicle => vehicle.brand === filters.brand)
      .map(vehicle => vehicle.model);
    
    return [...new Set(models)].filter(Boolean).sort();
  }, [vehicles, filters.brand]);

  // FASE 2: Usar debouncedSearchTerm para optimizar filtrado
  const filteredAndSortedVehicles = useMemo(() => {
    console.log('🔍 [useVehicleGallery] Applying filters:', { filters, debouncedSearchTerm });
    
    let filtered = vehicles;
    
    // Apply search filter con debounce
    if (debouncedSearchTerm.trim()) {
      const searchTermLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(vehicle => 
        vehicle.brand?.toLowerCase().includes(searchTermLower) ||
        vehicle.model?.toLowerCase().includes(searchTermLower) ||
        vehicle.location?.toLowerCase().includes(searchTermLower) ||
        vehicle.country?.toLowerCase().includes(searchTermLower) ||
        vehicle.description?.toLowerCase().includes(searchTermLower)
      );
      console.log('📝 [useVehicleGallery] After search filter:', filtered.length, 'vehicles');
    }

    // Apply filters
    filtered = filtered.filter(vehicle => {
      // Country filter
      const matchesCountry = filters.country === 'all' || 
        vehicle.countryCode?.toLowerCase() === filters.country.toLowerCase() ||
        vehicle.country?.toLowerCase() === filters.country.toLowerCase();

      // Fuel filter - ahora más flexible
      const matchesFuel = filters.fuel === 'all' || 
        vehicle.fuel?.toLowerCase() === filters.fuel.toLowerCase() ||
        vehicle.type?.toLowerCase() === filters.fuel.toLowerCase();

      // Brand filter
      const matchesBrand = filters.brand === 'all' || vehicle.brand === filters.brand;

      // Model filter
      const matchesModel = filters.model === 'all' || !filters.model || vehicle.model === filters.model;

      // Status filter
      const matchesStatus = filters.status === 'all' || vehicle.status === filters.status;

      // Price range filter
      const vehiclePrice = vehicle.price || 0;
      const matchesPrice = vehiclePrice >= filters.priceMin && vehiclePrice <= filters.priceMax;

      // Mileage range filter
      const vehicleMileage = vehicle.mileage || 0;
      const matchesMileage = vehicleMileage >= filters.mileageMin && vehicleMileage <= filters.mileageMax;

      // Year range filter
      const vehicleYear = vehicle.year || currentYear;
      const matchesYear = vehicleYear >= filters.yearMin && vehicleYear <= filters.yearMax;

      // Special filter
      const matchesSpecialFilter = filters.specialFilter === 'all' || (() => {
        switch (filters.specialFilter) {
          case 'ivaIncluded':
            return vehicle.ivaStatus === 'included';
          case 'ivaNotIncluded':
            return vehicle.ivaStatus !== 'included';
          case 'acceptsExchange':
            return vehicle.acceptsExchange === true;
          case 'noExchange':
            return vehicle.acceptsExchange === false;
          case 'nearlyNew':
            return isNearlyNew(vehicle.mileage || 0, vehicle.year);
          case 'commissionSale':
            return vehicle.commissionSale === true;
          default:
            return true;
        }
      })();

      // Company filter
      const matchesCompany = filters.company === 'all' || vehicle.user_id === filters.company;

      const matches = matchesCountry && matchesFuel && matchesBrand && matchesModel && 
                     matchesStatus && matchesPrice && matchesMileage && matchesYear &&
                     matchesSpecialFilter && matchesCompany;

      return matches;
    });

    console.log('🎯 [useVehicleGallery] After all filters:', filtered.length, 'vehicles');

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return (a.price || 0) - (b.price || 0);
        case 'priceDesc':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        case 'mileage':
          return (a.mileage || 0) - (b.mileage || 0);
        default:
          return 0;
      }
    });

    console.log('🔄 [useVehicleGallery] Final sorted results:', filtered.length, 'vehicles');
    
    return filtered;
  }, [vehicles, debouncedSearchTerm, filters, sortBy, currentYear]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({ 
      country: 'all', 
      brand: 'all', 
      fuel: 'all', 
      model: 'all', 
      status: 'all',
      priceMin: 0,
      priceMax: 100000,
      mileageMin: 0,
      mileageMax: 200000,
      yearMin: 2000,
      yearMax: currentYear,
      // Special filters
      specialFilter: 'all',
      company: 'all',
    });
  }, [currentYear]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    vehicles: filteredAndSortedVehicles,
    isLoading,
    error,
    availableBrands,
    availableModels,
    resetFilters,
    // Exponer función para actualizaciones manuales
    updateVehicleOptimistically,
  };
};
