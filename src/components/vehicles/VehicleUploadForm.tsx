
import React from 'react';
import { Card } from '@/components/ui/card';
import { useVehicleUploadForm } from '@/hooks/useVehicleUploadForm';
import {
  VehicleFormHeader,
  VehicleFormLoading,
  VehicleFormContent
} from './form-components';

interface VehicleUploadFormProps {
  vehicleId?: string;
}

const VehicleUploadForm: React.FC<VehicleUploadFormProps> = ({ vehicleId }) => {
  const {
    form,
    isLoading,
    isEditing,
    previewUrl,
    availableModels,
    handleImageChange,
    handleBrandChange,
    handleFormChange,
    handleFormSubmit
  } = useVehicleUploadForm({ vehicleId });

  if (isLoading) {
    return <VehicleFormLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full">
        <VehicleFormHeader isEditing={isEditing} />
        <VehicleFormContent
          form={form}
          isEditing={isEditing}
          onSubmit={handleFormSubmit}
          onChange={handleFormChange}
          onBrandChange={handleBrandChange}
          availableModels={availableModels}
          onImageChange={handleImageChange}
          previewUrl={previewUrl}
        />
      </div>
    </div>
  );
};

export default VehicleUploadForm;
