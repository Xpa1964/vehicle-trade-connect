
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface EquipmentItem {
  id: string;
  name: string;
  category_id?: string;
  equipment_categories?: {
    id?: string;
    name?: string;
  };
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  [key: string]: any;
}

interface UseVehicleEquipmentResult {
  vehicle: Vehicle | undefined;
  vehicleEquipmentItems: EquipmentItem[];
  equipmentByCategory: Record<string, { categoryName: string, items: { id: string, name: string }[] }>;
  isLoading: boolean;
  error: Error | null;
}

export const useVehicleEquipment = (vehicleId: string | undefined): UseVehicleEquipmentResult => {
  const { t } = useLanguage();

  // Fetch vehicle data
  const { 
    data: vehicle, 
    isLoading: isLoadingVehicle, 
    error: vehicleError 
  } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: async () => {
      if (!vehicleId) throw new Error('Vehicle ID is required');
      
      console.log('Fetching vehicle data for ID:', vehicleId);
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching vehicle:', error);
        throw error;
      }
      
      if (!data) {
        console.error('Vehicle not found with ID:', vehicleId);
        throw new Error('Vehicle not found');
      }
      
      console.log('Vehicle data found:', data);
      return data;
    },
    enabled: !!vehicleId
  });

  // Fetch equipment items
  const { 
    data: vehicleEquipmentItems = [], 
    isLoading: isLoadingEquipment 
  } = useQuery({
    queryKey: ['vehicle-equipment-items', vehicleId],
    queryFn: async () => {
      if (!vehicleId) return [];

      console.log('Fetching equipment for vehicle ID:', vehicleId);

      // First get equipment IDs related to this vehicle
      const { data: vehicleEquipment, error: equipmentError } = await supabase
        .from('vehicle_equipment')
        .select('equipment_id')
        .eq('vehicle_id', vehicleId);
      
      if (equipmentError) {
        console.error('Error fetching vehicle equipment IDs:', equipmentError);
        toast.error(t('common.error'));
        return [];
      }
      
      if (!vehicleEquipment || vehicleEquipment.length === 0) {
        console.log('No equipment found for vehicle:', vehicleId);
        return [];
      }
      
      // Extract equipment IDs
      const equipmentIds = vehicleEquipment.map(item => item.equipment_id);
      console.log('Equipment IDs found:', equipmentIds);
      
      // Then get details of each equipment item along with its category
      const { data: equipmentItems, error: itemsError } = await supabase
        .from('equipment_items')
        .select(`
          id, 
          name, 
          category_id,
          equipment_categories(id, name)
        `)
        .in('id', equipmentIds);
      
      if (itemsError) {
        console.error('Error fetching equipment details:', itemsError);
        toast.error(t('common.error'));
        return [];
      }
      
      console.log('Equipment items found:', equipmentItems?.length || 0);
      return equipmentItems || [];
    },
    enabled: !!vehicleId && !vehicleError
  });

  // Process equipment data into categories
  const equipmentByCategory: Record<string, { categoryName: string, items: { id: string, name: string }[] }> = {};
  
  console.log('Processing equipment items:', vehicleEquipmentItems?.length || 0);
  
  vehicleEquipmentItems.forEach((item: EquipmentItem) => {
    if (!item) return;
    
    const categoryId = item.category_id || 'other';
    const categoryName = item.equipment_categories?.name || 'Otro';
    
    if (!equipmentByCategory[categoryId]) {
      equipmentByCategory[categoryId] = {
        categoryName,
        items: []
      };
    }
    
    equipmentByCategory[categoryId].items.push({
      id: item.id,
      name: item.name
    });
  });

  const isLoading = isLoadingVehicle || isLoadingEquipment;
  
  return {
    vehicle,
    vehicleEquipmentItems,
    equipmentByCategory,
    isLoading,
    error: vehicleError
  };
};
