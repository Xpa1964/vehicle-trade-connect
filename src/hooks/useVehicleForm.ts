
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVehicleSubmit } from './useVehicleSubmit';
import { vehicleSchema, defaultFormValues } from './useVehicleFormConfig';
import type { VehicleFormData } from '@/types/vehicle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useVehicleForm = () => {
  const { handleVehicleSubmit } = useVehicleSubmit();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: defaultFormValues,
  });

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setIsLoading(true);
      const result = await handleVehicleSubmit(data);

      if (result?.id) {
        navigate(`/vehicle-preview/${result.id}`);
        form.reset();
      }
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    form, 
    onSubmit,
    isLoading, 
    isEditing: false // Always false for new vehicles
  };
};

export { vehicleSchema };
export type { VehicleFormSchema } from './useVehicleFormConfig';
