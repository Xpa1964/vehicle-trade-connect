
import { vehicleImageServiceCore } from './vehicleImageServiceCore';
import { VehicleImage } from '@/types/vehicleImage';

/**
 * Wrapper de compatibilidad para el servicio original
 * Mantiene las funciones existentes usando el nuevo servicio central
 */

export const uploadVehicleImage = async (
  file: File,
  vehicleId: string,
  isPrimary: boolean = false
): Promise<string | null> => {
  console.log(`Uploading image for vehicle ${vehicleId}, isPrimary: ${isPrimary}`);
  return await vehicleImageServiceCore.uploadToStorage(file, vehicleId);
};

export const createImageRecord = async (
  vehicleId: string,
  imageUrl: string,
  isPrimary: boolean,
  displayOrder: number
): Promise<VehicleImage | null> => {
  return await vehicleImageServiceCore.createImageRecord(vehicleId, imageUrl, isPrimary, displayOrder);
};

export const updateVehicleThumbnail = async (vehicleId: string, imageUrl: string): Promise<void> => {
  await vehicleImageServiceCore.updateVehicleThumbnail(vehicleId, imageUrl);
};

export const deletePrimaryStatus = async (vehicleId: string): Promise<void> => {
  await vehicleImageServiceCore.clearPrimaryStatus(vehicleId);
};

export const deleteImageRecord = async (imageId: string): Promise<VehicleImage | null> => {
  return await vehicleImageServiceCore.deleteImageRecord(imageId);
};
