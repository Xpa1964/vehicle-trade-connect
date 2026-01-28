
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
  
  // Use either the edit or create form logic based on vehicleId
  const formHook = vehicleId 
    ? useVehicleEdit(vehicleId)
    : useVehicleForm();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleBrandChange = (brand: string) => {
    // Reset available models when brand changes
    setAvailableModels([]);
    // Here you could fetch models for the selected brand if needed
  };

  const handleFormChange = (field: string, value: string | number) => {
    console.log('🔧 [VehicleUploadForm] Field change:', field, '=', value);
    
    // Usar setValue directamente con el field name correcto
    formHook.form.setValue(field as any, value, { 
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    
    // Trigger form validation
    formHook.form.trigger(field as any);
  };
  
  const handleFormSubmit = async (data: VehicleFormData) => {
    console.log('🚀 [VehicleUploadForm] Form submitted with data:', data);
    
    try {
      // Asegurar que tenemos TODOS los valores del formulario, no solo los que se pasan en data
      const allFormValues = formHook.form.getValues();
      console.log('🚀 [VehicleUploadForm] All form values:', allFormValues);
      
      // Crear un objeto completo con todos los datos
      const completeFormData: VehicleFormData = {
        // Datos básicos
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
        
        // Campos de identificación - CRÍTICOS
        vin: allFormValues.vin || data.vin || '',
        licensePlate: allFormValues.licensePlate || data.licensePlate || '',
        registrationDate: allFormValues.registrationDate || data.registrationDate,
        vehicleType: allFormValues.vehicleType || data.vehicleType || '',
        transactionType: allFormValues.transactionType || data.transactionType || 'national',
        acceptsExchange: allFormValues.acceptsExchange || data.acceptsExchange || false,
        
        // Detalles técnicos - CRÍTICOS
        engineSize: allFormValues.engineSize || data.engineSize,
        enginePower: allFormValues.enginePower || data.enginePower,
        color: allFormValues.color || data.color || '',
        doors: allFormValues.doors || data.doors,
        
        // Archivos
        images: allFormValues.images || data.images,
        additionalFiles: allFormValues.additionalFiles || data.additionalFiles,
        equipment: allFormValues.equipment || data.equipment || []
      };
      
      console.log('🎯 [VehicleUploadForm] Complete form data being sent:', completeFormData);
      console.log('🔍 [VehicleUploadForm] Critical fields check:');
      console.log('- VIN:', completeFormData.vin);
      console.log('- License Plate:', completeFormData.licensePlate);
      console.log('- Registration Date:', completeFormData.registrationDate);
      console.log('- Vehicle Type:', completeFormData.vehicleType);
      console.log('- Engine Size:', completeFormData.engineSize);
      console.log('- Engine Power:', completeFormData.enginePower);
      console.log('- Color:', completeFormData.color);
      console.log('- Doors:', completeFormData.doors);
      
      // Pass to the original onSubmit handler with complete data
      const result = await formHook.onSubmit(completeFormData);
      console.log('✅ [VehicleUploadForm] Form submission completed:', result);
      return result;
    } catch (error) {
      console.error('❌ [VehicleUploadForm] Form submission error:', error);
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
