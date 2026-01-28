
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { mapDatabaseToFormData } from '@/services/vehicleDataMapper';

/**
 * Hook for fetching vehicle data with improved mapping
 */
export const useVehicleDataFetcher = (
  vehicleId: string | undefined, 
  form: UseFormReturn<VehicleFormData>,
) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(vehicleId ? true : false);

  const fetchVehicleData = async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    
    try {
      console.log('🔍 [useVehicleDataFetcher] Fetching vehicle data for ID:', vehicleId);
      
      // Fetch main vehicle data
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();
        
      if (vehicleError) {
        console.error('❌ [useVehicleDataFetcher] Error fetching vehicle:', vehicleError);
        throw vehicleError;
      }
      
      if (!vehicleData) {
        console.error('❌ [useVehicleDataFetcher] Vehicle not found');
        toast.error(t('vehicles.notFound', {}));
        navigate('/vehicle-management');
        return;
      }
      
      console.log('✅ [useVehicleDataFetcher] Vehicle data fetched:', vehicleData);
      
      // Fetch metadata
      const { data: metadataData, error: metadataError } = await supabase
        .from('vehicle_metadata')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .maybeSingle();
      
      if (metadataError) {
        console.error('⚠️ [useVehicleDataFetcher] Error fetching metadata (non-critical):', metadataError);
      } else {
        console.log('✅ [useVehicleDataFetcher] Vehicle metadata fetched:', metadataData);
      }
      
      // Fetch vehicle information (technical specs)
      const { data: vehicleInfo, error: vehicleInfoError } = await supabase
        .from('vehicle_information')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .maybeSingle();
      
      if (vehicleInfoError) {
        console.error('⚠️ [useVehicleDataFetcher] Error fetching vehicle info (non-critical):', vehicleInfoError);
      } else {
        console.log('✅ [useVehicleDataFetcher] Vehicle information fetched:', vehicleInfo);
      }
      
      // Fetch equipment
      const { data: equipmentData, error: equipmentError } = await supabase
        .from('vehicle_equipment')
        .select('equipment_id')
        .eq('vehicle_id', vehicleId);
      
      if (equipmentError) {
        console.error('⚠️ [useVehicleDataFetcher] Error fetching equipment (non-critical):', equipmentError);
      } else {
        console.log('✅ [useVehicleDataFetcher] Equipment fetched:', equipmentData);
      }
      
      // Fetch damages
      const { data: damagesData, error: damagesError } = await supabase
        .from('vehicle_damages')
        .select('*')
        .eq('vehicle_id', vehicleId);
      
      if (damagesError) {
        console.error('⚠️ [useVehicleDataFetcher] Error fetching damages (non-critical):', damagesError);
      } else {
        console.log('✅ [useVehicleDataFetcher] Damages fetched:', damagesData);
      }
      
      // Map data using the new mapping service
      const mappedData = mapDatabaseToFormData(vehicleData);
      
      // Add metadata if available
      if (metadataData) {
        mappedData.mileageUnit = (metadataData.mileage_unit as 'km' | 'mi') || 'km';
        mappedData.units = metadataData.units || 1;
        mappedData.ivaStatus = (metadataData.iva_status as 'included' | 'notIncluded' | 'deductible' | 'rebu') || 'included';
        mappedData.cocStatus = metadataData.coc_status || false;
      }
      
      // Add technical specs if available
      if (vehicleInfo && vehicleInfo.technical_specs) {
        const techSpecs = vehicleInfo.technical_specs as any;
        if (techSpecs.euro_standard) {
          mappedData.euroStandard = techSpecs.euro_standard;
        }
        if (techSpecs.co2_emissions) {
          mappedData.co2Emissions = techSpecs.co2_emissions;
        }
      }
      
      // Add equipment if available
      if (equipmentData && equipmentData.length > 0) {
        mappedData.equipment = equipmentData.map(item => item.equipment_id);
      }
      
      // Add damages if available
      if (damagesData && damagesData.length > 0) {
        mappedData.damages = damagesData.map(damage => ({
          id: damage.id,
          damage_type: damage.damage_type as 'exterior' | 'interior' | 'mechanical',
          title: damage.title,
          description: damage.description || undefined,
          severity: damage.severity as 'minor' | 'moderate' | 'severe',
          location: damage.location || undefined,
          estimated_cost: damage.estimated_cost || undefined
        }));
      }
      
      console.log('🎯 [useVehicleDataFetcher] Final mapped data for form:', mappedData);
      
      // Set form values with explicit logging
      Object.entries(mappedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          console.log(`📝 [useVehicleDataFetcher] Setting form field "${key}":`, value);
          form.setValue(key as any, value);
        }
      });
      
      console.log('✅ [useVehicleDataFetcher] All form fields set successfully');
      return mappedData;
      
    } catch (error) {
      console.error('❌ [useVehicleDataFetcher] Critical error in fetchVehicleData:', error);
      toast.error(t('common.error', {}));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchVehicleData,
    isLoading
  };
};
