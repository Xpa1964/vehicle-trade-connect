import { countries } from './countryUtils';
import { getCurrentYear } from './dateUtils';
import { resolveMultilingualValue, getLocalizedFieldOptions, getDbValues, hasMultilingualDictionary } from './xlsxMultilingualDictionary';
import { Language } from '@/config/languages';

const VEHICLE_BRANDS = [
  'AUDI', 'BMW', 'MERCEDES-BENZ', 'VOLKSWAGEN', 'FORD', 'RENAULT', 'PEUGEOT', 'CITROEN',
  'OPEL', 'SEAT', 'TOYOTA', 'NISSAN', 'HONDA', 'HYUNDAI', 'KIA', 'MAZDA', 'MITSUBISHI',
  'SUBARU', 'VOLVO', 'JAGUAR', 'LAND ROVER', 'PORSCHE', 'FERRARI', 'LAMBORGHINI', 'MASERATI',
  'ALFA ROMEO', 'FIAT', 'LANCIA', 'SKODA', 'DACIA', 'SUZUKI', 'ISUZU', 'JEEP', 'CHEVROLET',
  'CADILLAC', 'BUICK', 'GMC', 'CHRYSLER', 'DODGE', 'LINCOLN', 'ACURA', 'INFINITI', 'LEXUS',
  'TESLA'
];

/**
 * Normaliza un string para comparación
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
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
  for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[str2.length][str1.length];
};

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
  if (bestMatch && minDistance <= Math.ceil(normalized.length * 0.4)) {
    return bestMatch;
  }
  return null;
};

/**
 * Genera una sugerencia inteligente basada en el campo y valor.
 * For multilingual fields, uses the dictionary to find the best DB value.
 */
export const getSuggestion = (field: string, value: any, error: string): string | null => {
  const valueStr = value?.toString().trim() || '';

  // For fields with multilingual dictionaries, try resolving first
  if (hasMultilingualDictionary(field)) {
    if (!valueStr) {
      // Return first DB value as default
      const dbValues = getDbValues(field);
      return dbValues[0] || null;
    }
    const resolved = resolveMultilingualValue(field, valueStr);
    if (resolved) return resolved;
    // Fallback: find most similar DB value
    const dbValues = getDbValues(field);
    return findMostSimilar(valueStr, dbValues);
  }

  switch (field) {
    case 'brand':
      if (!valueStr) return VEHICLE_BRANDS[0];
      return findMostSimilar(valueStr, VEHICLE_BRANDS);

    case 'country':
      if (!valueStr) return countries[0]?.name || '';
      const countryNames = countries.map(c => c.name);
      return findMostSimilar(valueStr, countryNames);

    case 'year': {
      const currentYear = getCurrentYear();
      if (!valueStr || isNaN(parseInt(valueStr))) return currentYear.toString();
      const yearNum = parseInt(valueStr);
      if (yearNum < 1900) return '2000';
      if (yearNum > currentYear + 1) return currentYear.toString();
      return yearNum.toString();
    }

    case 'price': {
      if (!valueStr) return '10000';
      const cleanedPrice = valueStr.replace(/[^\d.]/g, '');
      const priceNum = parseFloat(cleanedPrice);
      if (!isNaN(priceNum) && priceNum > 0) return priceNum.toString();
      return '10000';
    }

    case 'mileage': {
      if (!valueStr) return '0';
      const cleanedMileage = valueStr.replace(/[^\d.]/g, '');
      const mileageNum = parseFloat(cleanedMileage);
      if (!isNaN(mileageNum) && mileageNum >= 0) return Math.floor(mileageNum).toString();
      return '0';
    }

    case 'vin':
      if (valueStr.length < 17) return valueStr.toUpperCase().padEnd(17, 'X');
      if (valueStr.length > 17) return valueStr.substring(0, 17).toUpperCase();
      return valueStr.toUpperCase();

    case 'engineSize':
    case 'enginePower':
    case 'doors': {
      if (!valueStr) return field === 'doors' ? '4' : '0';
      const numVal = parseInt(valueStr);
      if (!isNaN(numVal) && numVal > 0) return numVal.toString();
      return field === 'doors' ? '4' : '0';
    }

    case 'co2Emissions': {
      if (!valueStr) return '120';
      const co2Val = parseInt(valueStr);
      if (!isNaN(co2Val) && co2Val > 0) return co2Val.toString();
      return '120';
    }

    default:
      return null;
  }
};

export const applySuggestion = (field: string, value: any): any => {
  const suggestion = getSuggestion(field, value, '');
  return suggestion || value;
};

/**
 * Valida un valor corregido para un campo específico.
 * For multilingual fields, accepts any valid DB value.
 */
export const validateCorrectedValue = (field: string, value: any): { valid: boolean; error?: string } => {
  const valueStr = value?.toString().trim() || '';

  // For fields with multilingual dictionaries
  if (hasMultilingualDictionary(field)) {
    if (!valueStr && ['fuel', 'transmission'].includes(field)) {
      return { valid: false, error: `${field} es obligatorio` };
    }
    if (!valueStr) return { valid: true }; // Optional fields
    const dbValues = getDbValues(field);
    // Accept DB values directly
    if (dbValues.includes(valueStr)) return { valid: true };
    // Also try resolving (user might type localized value)
    const resolved = resolveMultilingualValue(field, valueStr);
    if (resolved) return { valid: true };
    return { valid: false, error: `Valor no válido para ${field}` };
  }

  switch (field) {
    case 'brand':
      if (!valueStr) return { valid: false, error: 'La marca es obligatoria' };
      if (!VEHICLE_BRANDS.includes(valueStr)) return { valid: false, error: 'Marca no válida' };
      return { valid: true };

    case 'year': {
      const currentYear = getCurrentYear();
      const yearNum = parseInt(valueStr);
      if (isNaN(yearNum)) return { valid: false, error: 'Debe ser un número' };
      if (yearNum < 1900 || yearNum > currentYear + 1) return { valid: false, error: `Debe estar entre 1900 y ${currentYear + 1}` };
      return { valid: true };
    }

    case 'price': {
      const priceNum = parseFloat(valueStr);
      if (isNaN(priceNum)) return { valid: false, error: 'Debe ser un número' };
      if (priceNum <= 0) return { valid: false, error: 'Debe ser mayor que 0' };
      return { valid: true };
    }

    case 'mileage': {
      const mileageNum = parseFloat(valueStr);
      if (isNaN(mileageNum)) return { valid: false, error: 'Debe ser un número' };
      if (mileageNum < 0) return { valid: false, error: 'No puede ser negativo' };
      return { valid: true };
    }

    case 'country':
      if (!valueStr) return { valid: false, error: 'El país es obligatorio' };
      if (!countries.some(c => c.name === valueStr)) return { valid: false, error: 'País no válido' };
      return { valid: true };

    default:
      return { valid: true };
  }
};

/**
 * Obtiene las opciones válidas para un campo.
 * For multilingual fields, returns DB values.
 * Use getLocalizedFieldOptions for localized display.
 */
export const getFieldOptions = (field: string): string[] => {
  if (hasMultilingualDictionary(field)) {
    return getDbValues(field);
  }

  switch (field) {
    case 'brand':
      return VEHICLE_BRANDS;
    case 'country':
      return countries.map(c => c.name);
    default:
      return [];
  }
};

/**
 * Get localized options for use in UI selectors.
 * Returns { value, label } pairs where value=dbValue and label=localized.
 */
export const getLocalizedOptions = (field: string, language: Language): Array<{ value: string; label: string }> => {
  if (hasMultilingualDictionary(field)) {
    return getLocalizedFieldOptions(field, language);
  }

  // For non-dictionary fields, value === label
  return getFieldOptions(field).map(v => ({ value: v, label: v }));
};
