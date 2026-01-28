import { countries } from './countryUtils';
import { getCurrentYear } from './dateUtils';

const VEHICLE_BRANDS = [
  'AUDI', 'BMW', 'MERCEDES-BENZ', 'VOLKSWAGEN', 'FORD', 'RENAULT', 'PEUGEOT', 'CITROEN',
  'OPEL', 'SEAT', 'TOYOTA', 'NISSAN', 'HONDA', 'HYUNDAI', 'KIA', 'MAZDA', 'MITSUBISHI',
  'SUBARU', 'VOLVO', 'JAGUAR', 'LAND ROVER', 'PORSCHE', 'FERRARI', 'LAMBORGHINI', 'MASERATI',
  'ALFA ROMEO', 'FIAT', 'LANCIA', 'SKODA', 'DACIA', 'SUZUKI', 'ISUZU', 'JEEP', 'CHEVROLET',
  'CADILLAC', 'BUICK', 'GMC', 'CHRYSLER', 'DODGE', 'LINCOLN', 'ACURA', 'INFINITI', 'LEXUS',
  'TESLA'
];

const FUEL_TYPES = ['diesel', 'gasoline', 'electric', 'hybrid', 'plugin-hybrid', 'lpg', 'cng', 'hydrogen'];
const TRANSMISSIONS = ['manual', 'automatic', 'semi-automatic'];
const IVA_STATUS = ['included', 'notIncluded', 'deductible', 'rebu'];
const EURO_STANDARDS = ['euro1', 'euro2', 'euro3', 'euro4', 'euro5', 'euro6', 'euro6d', 'euro7'];

/**
 * Normaliza un string para comparación (quita acentos, espacios extra, lowercase)
 */
const normalizeString = (str: string): string => {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Calcula la distancia de Levenshtein entre dos strings
 * (para encontrar sugerencias similares)
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitución
          matrix[i][j - 1] + 1,     // inserción
          matrix[i - 1][j] + 1      // eliminación
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

/**
 * Encuentra el elemento más similar en una lista usando distancia de Levenshtein
 */
const findMostSimilar = (value: string, validValues: string[]): string | null => {
  const normalized = normalizeString(value);
  let minDistance = Infinity;
  let bestMatch: string | null = null;

  for (const validValue of validValues) {
    const distance = levenshteinDistance(normalized, normalizeString(validValue));
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = validValue;
    }
  }

  // Solo devolver sugerencia si la distancia es razonable (< 40% de la longitud)
  if (bestMatch && minDistance <= Math.ceil(normalized.length * 0.4)) {
    return bestMatch;
  }

  return null;
};

/**
 * Genera una sugerencia inteligente basada en el campo, valor y tipo de error
 */
export const getSuggestion = (field: string, value: any, error: string): string | null => {
  const valueStr = value?.toString().trim() || '';

  switch (field) {
    case 'brand':
      if (!valueStr) return VEHICLE_BRANDS[0]; // Sugerir primera marca
      return findMostSimilar(valueStr, VEHICLE_BRANDS);

    case 'fuel':
      if (!valueStr) return 'diesel';
      return findMostSimilar(valueStr, FUEL_TYPES);

    case 'transmission':
      if (!valueStr) return 'manual';
      return findMostSimilar(valueStr, TRANSMISSIONS);

    case 'ivaStatus':
      if (!valueStr) return 'included';
      return findMostSimilar(valueStr, IVA_STATUS);

    case 'euroStandard':
      if (!valueStr) return 'euro6';
      return findMostSimilar(valueStr, EURO_STANDARDS);

    case 'country':
      if (!valueStr) return countries[0]?.name || '';
      const countryNames = countries.map(c => c.name);
      return findMostSimilar(valueStr, countryNames);

    case 'year':
      const currentYear = getCurrentYear();
      if (!valueStr || isNaN(parseInt(valueStr))) {
        return currentYear.toString();
      }
      const yearNum = parseInt(valueStr);
      if (yearNum < 1900) return '2000';
      if (yearNum > currentYear + 1) return currentYear.toString();
      return yearNum.toString();

    case 'price':
      if (!valueStr) return '10000';
      // Intentar limpiar el precio (quitar símbolos, comas, etc)
      const cleanedPrice = valueStr.replace(/[^\d.]/g, '');
      const priceNum = parseFloat(cleanedPrice);
      if (!isNaN(priceNum) && priceNum > 0) {
        return priceNum.toString();
      }
      return '10000';

    case 'mileage':
      if (!valueStr) return '0';
      const cleanedMileage = valueStr.replace(/[^\d.]/g, '');
      const mileageNum = parseFloat(cleanedMileage);
      if (!isNaN(mileageNum) && mileageNum >= 0) {
        return Math.floor(mileageNum).toString();
      }
      return '0';

    case 'vin':
      // Si el VIN tiene longitud incorrecta, no podemos sugerir nada útil
      if (valueStr.length < 17) {
        return valueStr.toUpperCase().padEnd(17, 'X');
      }
      if (valueStr.length > 17) {
        return valueStr.substring(0, 17).toUpperCase();
      }
      return valueStr.toUpperCase();

    case 'engineSize':
    case 'enginePower':
    case 'doors':
      if (!valueStr) return '0';
      const numVal = parseInt(valueStr);
      if (!isNaN(numVal) && numVal > 0) {
        return numVal.toString();
      }
      return field === 'doors' ? '4' : '0';

    case 'co2Emissions':
      if (!valueStr) return '120';
      const co2Val = parseInt(valueStr);
      if (!isNaN(co2Val) && co2Val > 0) {
        return co2Val.toString();
      }
      return '120';

    default:
      return null;
  }
};

/**
 * Aplica automáticamente una sugerencia corregida a un valor
 */
export const applySuggestion = (field: string, value: any): any => {
  const suggestion = getSuggestion(field, value, '');
  return suggestion || value;
};

/**
 * Valida un valor corregido para un campo específico
 */
export const validateCorrectedValue = (field: string, value: any): { valid: boolean; error?: string } => {
  const valueStr = value?.toString().trim() || '';

  switch (field) {
    case 'brand':
      if (!valueStr) return { valid: false, error: 'La marca es obligatoria' };
      if (!VEHICLE_BRANDS.includes(valueStr)) {
        return { valid: false, error: 'Marca no válida' };
      }
      return { valid: true };

    case 'fuel':
      if (!valueStr) return { valid: false, error: 'El combustible es obligatorio' };
      if (!FUEL_TYPES.includes(valueStr)) {
        return { valid: false, error: 'Combustible no válido' };
      }
      return { valid: true };

    case 'transmission':
      if (!valueStr) return { valid: false, error: 'La transmisión es obligatoria' };
      if (!TRANSMISSIONS.includes(valueStr)) {
        return { valid: false, error: 'Transmisión no válida' };
      }
      return { valid: true };

    case 'year':
      const currentYear = getCurrentYear();
      const yearNum = parseInt(valueStr);
      if (isNaN(yearNum)) return { valid: false, error: 'Debe ser un número' };
      if (yearNum < 1900 || yearNum > currentYear + 1) {
        return { valid: false, error: `Debe estar entre 1900 y ${currentYear + 1}` };
      }
      return { valid: true };

    case 'price':
      const priceNum = parseFloat(valueStr);
      if (isNaN(priceNum)) return { valid: false, error: 'Debe ser un número' };
      if (priceNum <= 0) return { valid: false, error: 'Debe ser mayor que 0' };
      return { valid: true };

    case 'mileage':
      const mileageNum = parseFloat(valueStr);
      if (isNaN(mileageNum)) return { valid: false, error: 'Debe ser un número' };
      if (mileageNum < 0) return { valid: false, error: 'No puede ser negativo' };
      return { valid: true };

    case 'country':
      if (!valueStr) return { valid: false, error: 'El país es obligatorio' };
      const countryExists = countries.some(c => c.name === valueStr);
      if (!countryExists) return { valid: false, error: 'País no válido' };
      return { valid: true };

    default:
      // Para campos opcionales o sin validación específica
      return { valid: true };
  }
};

/**
 * Obtiene las opciones válidas para un campo con lista
 */
export const getFieldOptions = (field: string): string[] => {
  switch (field) {
    case 'brand':
      return VEHICLE_BRANDS;
    case 'fuel':
      return FUEL_TYPES;
    case 'transmission':
      return TRANSMISSIONS;
    case 'ivaStatus':
      return IVA_STATUS;
    case 'euroStandard':
      return EURO_STANDARDS;
    case 'country':
      return countries.map(c => c.name);
    default:
      return [];
  }
};
