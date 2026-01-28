
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVehicleEquipment } from '@/hooks/useVehicleEquipment';
import { LoadingState } from '@/components/vehicles/equipment/LoadingState';
import { ErrorState } from '@/components/vehicles/equipment/ErrorState';
import { VehicleEquipmentHeader } from '@/components/vehicles/equipment/VehicleEquipmentHeader';
import { EquipmentCategoryList } from '@/components/vehicles/equipment/EquipmentCategoryList';

const VehicleEquipmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  
  console.log('VehicleEquipmentPage - Vehicle ID:', id);
  
  const { 
    vehicle, 
    equipmentByCategory, 
    isLoading, 
    error 
  } = useVehicleEquipment(id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !vehicle) {
    console.error('Error displaying vehicle:', error);
    return <ErrorState />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <VehicleEquipmentHeader
        vehicleId={vehicle.id}
        brand={vehicle.brand}
        model={vehicle.model}
      />

      <div className="mb-8">
        <img 
          src="/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png" 
          alt="Kontact Logo" 
          className="w-32 mb-4"
        />
        <p className="text-lg text-gray-700 mb-6">{t('vehicles.equipmentFullDescription')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('vehicles.equipment')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <EquipmentCategoryList equipmentByCategory={equipmentByCategory} />
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleEquipmentPage;
