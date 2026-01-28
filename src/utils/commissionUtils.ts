
export type CommissionType = 'vendedor' | 'comprador' | 'trader';

export interface CommissionResult {
  vehiclePrice: number;
  commissionPercentage: number;
  commissionAmount: number;
  maintenanceFee: number;
  totalCost: number;
}

// Tabla de escalado de comisiones
const COMMISSION_SCALE = [
  { price: 10000, vendedor: 1.00, comprador: 0.80 },
  { price: 11000, vendedor: 1.00, comprador: 0.80 },
  { price: 12000, vendedor: 1.00, comprador: 0.80 },
  { price: 13000, vendedor: 1.00, comprador: 0.80 },
  { price: 14000, vendedor: 1.00, comprador: 0.80 },
  { price: 15000, vendedor: 1.00, comprador: 0.80 },
  { price: 16000, vendedor: 1.00, comprador: 0.80 },
  { price: 17000, vendedor: 1.00, comprador: 0.80 },
  { price: 18000, vendedor: 1.00, comprador: 0.80 },
  { price: 19000, vendedor: 1.00, comprador: 0.80 },
  { price: 20000, vendedor: 1.00, comprador: 0.80 },
  { price: 21000, vendedor: 1.00, comprador: 0.80 },
  { price: 22000, vendedor: 1.00, comprador: 0.80 },
  { price: 23000, vendedor: 1.00, comprador: 0.80 },
  { price: 24000, vendedor: 1.00, comprador: 0.80 },
  { price: 25000, vendedor: 1.00, comprador: 0.80 },
  { price: 26000, vendedor: 1.00, comprador: 0.80 },
  { price: 27000, vendedor: 1.00, comprador: 0.80 },
  { price: 28000, vendedor: 1.00, comprador: 0.80 },
  { price: 29000, vendedor: 1.00, comprador: 0.80 },
  { price: 30000, vendedor: 1.00, comprador: 0.80 },
  { price: 31000, vendedor: 0.97, comprador: 0.80 },
  { price: 32000, vendedor: 0.94, comprador: 0.78 },
  { price: 33000, vendedor: 0.91, comprador: 0.76 },
  { price: 34000, vendedor: 0.88, comprador: 0.74 },
  { price: 35000, vendedor: 0.86, comprador: 0.71 },
  { price: 36000, vendedor: 0.83, comprador: 0.69 },
  { price: 37000, vendedor: 0.81, comprador: 0.68 },
  { price: 38000, vendedor: 0.79, comprador: 0.66 },
  { price: 39000, vendedor: 0.77, comprador: 0.64 },
  { price: 40000, vendedor: 0.75, comprador: 0.63 },
  { price: 41000, vendedor: 0.73, comprador: 0.61 },
  { price: 42000, vendedor: 0.71, comprador: 0.60 },
  { price: 43000, vendedor: 0.70, comprador: 0.58 },
  { price: 44000, vendedor: 0.68, comprador: 0.57 },
  { price: 45000, vendedor: 0.67, comprador: 0.56 },
  { price: 46000, vendedor: 0.65, comprador: 0.54 },
  { price: 47000, vendedor: 0.64, comprador: 0.53 },
  { price: 48000, vendedor: 0.63, comprador: 0.52 },
  { price: 49000, vendedor: 0.61, comprador: 0.51 },
  { price: 50000, vendedor: 0.60, comprador: 0.50 },
  { price: 51000, vendedor: 0.59, comprador: 0.49 },
  { price: 52000, vendedor: 0.58, comprador: 0.48 },
  { price: 53000, vendedor: 0.57, comprador: 0.47 },
  { price: 54000, vendedor: 0.56, comprador: 0.46 },
  { price: 55000, vendedor: 0.55, comprador: 0.45 },
];

const MAINTENANCE_FEE = 25; // 25€ fijos
const MIN_COMMISSION_VENDEDOR = 100; // 100€ mínimo para vendedor (0-10.000€)
const MIN_COMMISSION_COMPRADOR = 80; // 80€ mínimo para comprador (0-10.000€)
const MIN_COMMISSION_TRADER = 100; // 100€ mínimo para trader
const MAX_COMMISSION_TRADER = 150; // 150€ máximo para trader (a partir de 25.000€)
const TRADER_PERCENTAGE = 0.6; // 0.6% fijo

export const calculateCommission = (price: number, type: CommissionType): CommissionResult => {
  // Lógica especial para trader
  if (type === 'trader') {
    const calculatedCommission = (price * TRADER_PERCENTAGE) / 100;
    const commissionAmount = Math.max(
      MIN_COMMISSION_TRADER, 
      Math.min(calculatedCommission, MAX_COMMISSION_TRADER)
    );
    
    return {
      vehiclePrice: price,
      commissionPercentage: (commissionAmount / price) * 100,
      commissionAmount,
      maintenanceFee: MAINTENANCE_FEE,
      totalCost: commissionAmount + MAINTENANCE_FEE,
    };
  }

  // Para precios de 0€ a 10.000€, aplicar mínimo fijo
  if (price <= 10000) {
    const commissionAmount = type === 'vendedor' ? MIN_COMMISSION_VENDEDOR : MIN_COMMISSION_COMPRADOR;
    return {
      vehiclePrice: price,
      commissionPercentage: (commissionAmount / price) * 100,
      commissionAmount,
      maintenanceFee: MAINTENANCE_FEE,
      totalCost: commissionAmount + MAINTENANCE_FEE,
    };
  }

  // Para precios superiores a 55.000€, usar el tope de 55.000€
  const calculationPrice = Math.min(price, 55000);
  
  // Buscar el escalón correspondiente
  let commissionPercentage = 0;
  
  if (calculationPrice <= 55000) {
    // Buscar en la tabla de escalado
    const scale = COMMISSION_SCALE.find(s => calculationPrice <= s.price);
    if (scale) {
      commissionPercentage = scale[type];
    } else {
      // Si no se encuentra, usar el último valor de la tabla
      const lastScale = COMMISSION_SCALE[COMMISSION_SCALE.length - 1];
      commissionPercentage = lastScale[type];
    }
  }

  const commissionAmount = (calculationPrice * commissionPercentage) / 100;

  return {
    vehiclePrice: price,
    commissionPercentage,
    commissionAmount,
    maintenanceFee: MAINTENANCE_FEE,
    totalCost: commissionAmount + MAINTENANCE_FEE,
  };
};

export const formatCurrencyCommission = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};
