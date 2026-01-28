import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVehicleSubmit } from './useVehicleSubmit';
import { vehicleSchema, defaultFormValues } from './useVehicleFormConfig';
import { VehicleFormData } from '@/types/vehicle';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVehicleImages } from './useVehicleImages';
import { useVehicleDataFetcher } from './vehicle-edit/useVehicleDataFetcher';
import { useVehicleUpdater } from './vehicle-edit/useVehicleUpdater';

/**
 * Hook for editing an existing vehicle
 */
export const useVehicleEdit = (vehicleId?: string) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { handleVehicleSubmit: submitVehicle } = useVehicleSubmit();
  const { images } = useVehicleImages(vehicleId);
  const { updateVehicle } = useVehicleUpdater();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicleId ? {} : defaultFormValues,
  });

  const { fetchVehicleData, isLoading } = useVehicleDataFetcher(vehicleId, form);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleData();
    }
  }, [vehicleId]);

  const onSubmit = async (data: VehicleFormData) => {
    try {
      console.log('🔥 [useVehicleEdit] Form submission started with data:', data);
      
      // Obtener todos los valores actuales del formulario para asegurar que tenemos los datos más recientes
      const currentFormValues = form.getValues();
      console.log('🔥 [useVehicleEdit] Current form values:', currentFormValues);
      
      // Combinar los datos pasados con los valores actuales del formulario
      const completeData = {
        ...currentFormValues,
        ...data
      };
      
      console.log('🔥 [useVehicleEdit] Complete data for submission:', completeData);
      
      if (vehicleId) {
        // If we have a vehicleId, we're updating
        console.log('🔥 [useVehicleEdit] Updating vehicle with ID:', vehicleId);
        const response = await updateVehicle(vehicleId, completeData);
        
        if (response) {
          toast.success(t('vehicles.updateSuccess', { fallback: 'Vehicle updated successfully' }));
          navigate(`/vehicle-preview/${vehicleId}`);
        }
      } else {
        // Otherwise, we're creating a new vehicle
        console.log('🔥 [useVehicleEdit] Creating new vehicle');
        const newVehicle = await submitVehicle(completeData);
        
        if (newVehicle) {
          form.reset();
          navigate(`/vehicle-preview/${newVehicle.id}`);
        }
      }
    } catch (error) {
      console.error('❌ [useVehicleEdit] Form submission error:', error);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    isEditing: !!vehicleId,
    images: images || []
  };
};
