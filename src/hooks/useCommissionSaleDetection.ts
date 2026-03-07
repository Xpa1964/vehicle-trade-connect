
import { useMemo } from 'react';
import { Vehicle } from '@/types/vehicle';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para detectar automáticamente si un vehículo debe ser marcado como venta comisionada
 * Lógica: Usuario español viendo vehículo extranjero
 */
export const useCommissionSaleDetection = (vehicle: Vehicle) => {
  const { user } = useAuth();

  const shouldBeCommissionSale = useMemo(() => {
    // Si ya está marcado como venta comisionada, respetarlo
    if (vehicle.commissionSale === true) {
      return true;
    }

    // Verificar si el usuario está en España (por defecto o por perfil)
    const userCountry = user?.user_metadata?.country || 'España';
    const isSpanishUser = userCountry === 'España' || userCountry === 'Spain';

    // Verificar si el vehículo es extranjero
    const vehicleCountry = vehicle.country || '';
    const isForeignVehicle = vehicleCountry !== 'España' && 
                            vehicleCountry !== 'Spain' && 
                            vehicleCountry !== '' &&
                            vehicle.countryCode !== 'es';

    // Auto-detectar venta comisionada
    const shouldAutoDetect = isSpanishUser && isForeignVehicle;


    return shouldAutoDetect;
  }, [vehicle, user]);

  return shouldBeCommissionSale;
};

export default useCommissionSaleDetection;
