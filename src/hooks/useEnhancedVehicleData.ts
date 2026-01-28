import { useVehicleEquipment } from './useVehicleEquipment';
import { useVehicleDamages } from './useVehicleDamages';
import { useVehicleInformation } from './useVehicleInformation';
import { useVehicleImages } from './useVehicleImages';

export const useEnhancedVehicleData = (vehicleId: string | undefined) => {
  const {
    vehicle,
    equipmentByCategory,
    isLoading: equipmentLoading,
    error: equipmentError
  } = useVehicleEquipment(vehicleId);

  const {
    data: damages = [],
    isLoading: damagesLoading
  } = useVehicleDamages(vehicleId);

  const {
    data: vehicleInformation,
    isLoading: informationLoading
  } = useVehicleInformation(vehicleId);

  const {
    images,
    isLoading: imagesLoading
  } = useVehicleImages(vehicleId);

  const isLoading = equipmentLoading || damagesLoading || informationLoading || imagesLoading;
  const primaryImage = images.find(img => img.is_primary) || images[0];

  return {
    vehicle,
    equipmentByCategory,
    damages,
    vehicleInformation,
    primaryImage,
    isLoading,
    error: equipmentError
  };
};