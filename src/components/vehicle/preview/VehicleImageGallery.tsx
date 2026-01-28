
import React from 'react';
import { Vehicle } from '@/types/vehicle';
import VehicleGallery from '@/components/vehicle/VehicleGallery';

interface VehicleImageGalleryProps {
  vehicle: Vehicle;
}

const VehicleImageGallery: React.FC<VehicleImageGalleryProps> = ({ vehicle }) => {
  return (
    <VehicleGallery
      brandModel={`${vehicle.brand} ${vehicle.model}`}
      thumbnailUrl={vehicle.thumbnailUrl || vehicle.thumbnailurl || '/placeholder.svg'}
      vehicleId={vehicle.id}
      vehicleStatus={vehicle.status as 'sold' | 'reserved' | 'available'}
      vehicleImages={vehicle.vehicle_images}
    />
  );
};

export default VehicleImageGallery;
