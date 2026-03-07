
import { useState } from 'react';
import { useVehicleForm } from './useVehicleForm';
import { useVehicleEdit } from './useVehicleEdit';
import { VehicleFormData } from '@/types/vehicle';

interface UseVehicleUploadFormProps {
  vehicleId?: string;
}

export const useVehicleUploadForm = ({ vehicleId }: UseVehicleUploadFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
  // Always call both hooks (React rules of hooks - no conditional calls)
  const createForm = useVehicleForm();
  const editForm = useVehicleEdit(vehicleId);
  
  // Select the appropriate form based on vehicleId
  const formHook = vehicleId ? editForm : createForm;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } catch (error) {
      console.error('[VehicleUploadForm] Error handling image change:', error);
    }
  };

  const handleBrandChange = (brand: string) => {
    setAvailableModels([]);
  };

  const handleFormChange = (field: string, value: string | number) => {
    
    
    formHook.form.setValue(field as any, value, { 
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    
    formHook.form.trigger(field as any);
  };
  
  const handleFormSubmit = async (data: VehicleFormData) => {
    try {
      const allFormValues = formHook.form.getValues();
      
      const completeFormData: VehicleFormData = {
        brand: allFormValues.brand || data.brand || '',
        model: allFormValues.model || data.model || '',
        year: allFormValues.year || data.year || new Date().getFullYear(),
        price: allFormValues.price || data.price || 0,
        currency: allFormValues.currency || data.currency || 'EUR',
        mileage: allFormValues.mileage || data.mileage || 0,
        mileageUnit: allFormValues.mileageUnit || data.mileageUnit || 'km',
        units: allFormValues.units || data.units || 1,
        fuel: allFormValues.fuel || data.fuel || '',
        transmission: allFormValues.transmission || data.transmission || '',
        location: allFormValues.location || data.location || '',
        country: allFormValues.country || data.country || '',
        countryCode: allFormValues.countryCode || data.countryCode || 'es',
        ivaStatus: allFormValues.ivaStatus || data.ivaStatus || 'included',
        cocStatus: allFormValues.cocStatus || data.cocStatus || false,
        status: allFormValues.status || data.status || 'available',
        description: allFormValues.description || data.description || '',
        vin: allFormValues.vin || data.vin || '',
        licensePlate: allFormValues.licensePlate || data.licensePlate || '',
        registrationDate: allFormValues.registrationDate || data.registrationDate,
        vehicleType: allFormValues.vehicleType || data.vehicleType || '',
        transactionType: allFormValues.transactionType || data.transactionType || 'national',
        acceptsExchange: allFormValues.acceptsExchange || data.acceptsExchange || false,
        engineSize: allFormValues.engineSize || data.engineSize,
        enginePower: allFormValues.enginePower || data.enginePower,
        color: allFormValues.color || data.color || '',
        doors: allFormValues.doors || data.doors,
        images: allFormValues.images || data.images,
        additionalFiles: allFormValues.additionalFiles || data.additionalFiles,
        equipment: allFormValues.equipment || data.equipment || []
      };
      
      const result = await formHook.onSubmit(completeFormData);
      return result;
    } catch (error) {
      console.error('[VehicleUploadForm] Form submission error:', error);
      throw error;
    }
  };

  return {
    ...formHook,
    previewUrl,
    availableModels,
    handleImageChange,
    handleBrandChange,
    handleFormChange,
    handleFormSubmit
  };
};
