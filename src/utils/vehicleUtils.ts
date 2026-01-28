
import { Vehicle } from '@/types/vehicle';

export const getIvaStatusColor = (status: Vehicle['ivaStatus']) => {
  switch (status) {
    case 'included':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'notIncluded':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'deductible':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getIvaStatusText = (status: Vehicle['ivaStatus'], t?: (key: string) => string) => {
  if (!t) {
    // Fallback for cases where translation function is not available
    switch (status) {
      case 'included':
        return 'IVA Incluido';
      case 'notIncluded':
        return 'IVA No Incluido';
      case 'deductible':
        return 'IVA Deducible';
      default:
        return '';
    }
  }
  
  switch (status) {
    case 'included':
      return t('vehicles.ivaIncluded');
    case 'notIncluded':
      return t('vehicles.ivaNotIncluded');
    case 'deductible':
      return t('vehicles.ivaDeductible');
    default:
      return '';
  }
};
