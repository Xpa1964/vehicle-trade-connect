import { useState, useEffect, useMemo } from 'react';
import { calculateCommission, CommissionType, CommissionResult } from '@/utils/commissionUtils';
import { useAuth } from '@/contexts/AuthContext';

interface UseCommissionCalculatorProps {
  initialPrice?: number;
  initialType?: CommissionType;
}

export const useCommissionCalculator = ({ 
  initialPrice = 0, 
  initialType = 'comprador' 
}: UseCommissionCalculatorProps = {}) => {
  const { user } = useAuth();
  const [price, setPrice] = useState<number>(initialPrice);
  const [type, setType] = useState<CommissionType>(initialType);

  // Determinar tipos permitidos según trader_type del usuario
  const allowedTypes = useMemo((): CommissionType[] => {
    const traderType = user?.profile?.trader_type;
    
    // Si no hay usuario autenticado o no tiene trader_type, mostrar todos (Opción A)
    if (!traderType) {
      return ['comprador', 'vendedor'];
    }

    // Filtrar según el tipo de trader
    switch (traderType) {
      case 'buyer':
        return ['comprador'];
      case 'seller':
        return ['vendedor'];
      case 'buyer_seller':
        return ['comprador', 'vendedor'];
      case 'trader':
        return ['trader'];
      default:
        return ['comprador', 'vendedor', 'trader'];
    }
  }, [user?.profile?.trader_type]);

  // Auto-ajustar el tipo si el actual no está permitido
  useEffect(() => {
    if (!allowedTypes.includes(type)) {
      setType(allowedTypes[0]);
    }
  }, [allowedTypes, type]);

  // Actualizar el precio si cambia el initialPrice (útil para auto-rellenar)
  useEffect(() => {
    if (initialPrice && initialPrice !== price) {
      setPrice(initialPrice);
    }
  }, [initialPrice]);

  const result: CommissionResult = useMemo(() => {
    if (price <= 0) {
      return {
        vehiclePrice: 0,
        commissionPercentage: 0,
        commissionAmount: 0,
        maintenanceFee: 25,
        totalCost: 25,
      };
    }
    return calculateCommission(price, type);
  }, [price, type]);

  const updatePrice = (newPrice: number) => {
    setPrice(Math.max(0, newPrice));
  };

  const updateType = (newType: CommissionType) => {
    setType(newType);
  };

  return {
    price,
    type,
    result,
    updatePrice,
    updateType,
    setPrice: updatePrice,
    setType: updateType,
    allowedTypes,
  };
};
