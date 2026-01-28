
import { Vehicle } from "@/types/vehicle";

export const mockVehicles: Vehicle[] = [];

// Add a function to get a vehicle by ID
export const mockGetVehicleById = (id: string) => {
  const vehicle = mockVehicles.find(v => v.id === id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  return vehicle;
};
