import type * as XLSXType from 'xlsx';
import { VehicleFormData } from '@/types/vehicle';
import { countries } from './countryUtils';
import { getCurrentYear } from './dateUtils';
import { Language } from '@/config/languages';
import { translations } from '@/translations';
import { resolveMultilingualValue, detectExcelLanguage } from './xlsxMultilingualDictionary';

const loadXLSX = () => import('xlsx') as Promise<typeof XLSXType>;

export interface ValidationError {
  row: number;
  column: string;
  field: string;
  value: any;
  error: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export interface ParseResult {
  valid: boolean;
  validVehicles: VehicleFormData[];
  errors: ValidationError[];
  warnings: ValidationError[];
  summary: {
    totalRows: number;
    validRows: number;
    errorRows: number;
    warningRows: number;
  };
}

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
const STATUS_OPTIONS = ['available', 'reserved', 'sold'];

// Función para normalizar strings (quitar acentos, espacios extra, etc.)
const normalizeString = (str: string): string => {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Función para encontrar coincidencia cercana en una lista
const findClosestMatch = (value: string, validValues: string[]): string | null => {
  const normalized = normalizeString(value);
  
  // Buscar coincidencia exacta
  const exactMatch = validValues.find(v => normalizeString(v) === normalized);
  if (exactMatch) return exactMatch;
  
  // Buscar coincidencia parcial
  const partialMatch = validValues.find(v => 
    normalizeString(v).includes(normalized) || normalized.includes(normalizeString(v))
  );
  
  return partialMatch || null;
};

export const parseXLSXFile = async (file: File, language: Language = 'es'): Promise<ParseResult> => {
  // Translation helper function
  const t = (key: string, params?: Record<string, any>) => {
    let translation = translations[language]?.[key] || key;
    
    // Replace placeholders {value}, {maxYear}, etc.
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }
    
    return translation;
  };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const XLSX = await loadXLSX();
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Detectar si es formato nuevo (1 pestaña) o antiguo (2 pestañas)
        const unifiedKeywords = [
          'Datos', 'Data', 'Vehículos', 'Vehicles', 'Veicoli', 
          'Voertuigen', 'Pojazdy', 'Gegevens'
        ];
        const unifiedSheetName = workbook.SheetNames.find(name => 
          unifiedKeywords.some(keyword => name.includes(keyword))
        );
        
        if (unifiedSheetName) {
          // FORMATO NUEVO: Una sola pestaña con todos los datos
          const unifiedSheet = workbook.Sheets[unifiedSheetName];
          const unifiedData = XLSX.utils.sheet_to_json(unifiedSheet, { header: 1 });
          const result = parseUnifiedVehicleData(unifiedData as any[][], t);
          resolve(result);
        } else {
          // FORMATO ANTIGUO: Dos pestañas separadas (compatibilidad)
          const mandatoryKeywords = [
            'Obligatorio', 'Mandatory', 'Pflichtdaten', 'Obbligatori', 
            'Obrigatórios', 'obligatoires', 'Obowiązkowe', 'Verplichte'
          ];
          const mandatorySheetName = workbook.SheetNames.find(name => 
            mandatoryKeywords.some(keyword => name.includes(keyword))
          );
          
          if (!mandatorySheetName) {
            reject(new Error(t('xlsx.validation.sheetNotFound')));
            return;
          }
          
          const mandatorySheet = workbook.Sheets[mandatorySheetName];
          const mandatoryData = XLSX.utils.sheet_to_json(mandatorySheet, { header: 1 });
          
          const optionalKeywords = [
            'Opcional', 'Optional', 'Optionale', 'Facoltativi', 
            'Opcionais', 'facultatives', 'Opcjonalne', 'Optionele'
          ];
          const optionalSheetName = workbook.SheetNames.find(name => 
            optionalKeywords.some(keyword => name.includes(keyword))
          );
          
          let optionalData: any[] = [];
          if (optionalSheetName) {
            const optionalSheet = workbook.Sheets[optionalSheetName];
            optionalData = XLSX.utils.sheet_to_json(optionalSheet, { header: 1 });
          }
          
          const result = parseVehicleData(mandatoryData as any[][], optionalData as any[][], t);
          resolve(result);
        }
        
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error(t('xlsx.validation.fileReadError')));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Función para parsear formato NUEVO (una sola pestaña)
const parseUnifiedVehicleData = (data: any[][], t: (key: string, params?: Record<string, any>) => string): ParseResult => {
  const validVehicles: VehicleFormData[] = [];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  const headers = data[0] as string[];
  const detectedLang = detectExcelLanguage(headers.map(h => h?.toString() || ''));
  const totalRows = data.length - 1;
  let validRowCount = 0;
  const errorRows = new Set<number>();
  const warningRows = new Set<number>();
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    if (!row || row.every(cell => cell === undefined || cell === '')) {
      continue;
    }
    
    const rowNumber = i + 1;
    const vehicle: any = {
      currency: 'EUR',
      mileageUnit: 'km',
      units: 1,
      ivaStatus: 'included',
      cocStatus: false,
      status: 'available',
      equipment: []
    };
    
    let hasError = false;
    
    // CAMPOS OBLIGATORIOS (columnas 0-8)
    // Brand (columna 0)
    const brand = row[0]?.toString().trim();
    if (!brand) {
      errors.push({
        row: rowNumber,
        column: 'A',
        field: 'brand',
        value: brand,
        error: t('xlsx.validation.brandRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const matchedBrand = findClosestMatch(brand, VEHICLE_BRANDS);
      if (!matchedBrand) {
        errors.push({
          row: rowNumber,
          column: 'A',
          field: 'brand',
          value: brand,
          error: t('xlsx.validation.brandUnrecognized', { value: brand }),
          severity: 'error',
          suggestion: t('xlsx.validation.brandSuggestion')
        });
        hasError = true;
      } else {
        vehicle.brand = matchedBrand;
      }
    }
    
    // Model (columna 1)
    const model = row[1]?.toString().trim();
    if (!model) {
      errors.push({
        row: rowNumber,
        column: 'B',
        field: 'model',
        value: model,
        error: t('xlsx.validation.modelRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      vehicle.model = model;
    }
    
    // Year (columna 2)
    const year = row[2];
    const currentYear = getCurrentYear();
    if (!year) {
      errors.push({
        row: rowNumber,
        column: 'C',
        field: 'year',
        value: year,
        error: t('xlsx.validation.yearRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const yearNum = parseInt(year.toString(), 10);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
        errors.push({
          row: rowNumber,
          column: 'C',
          field: 'year',
          value: year,
          error: t('xlsx.validation.yearRange', { maxYear: currentYear + 1 }),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.year = yearNum;
      }
    }
    
    // Price (columna 3)
    const price = row[3];
    if (!price) {
      errors.push({
        row: rowNumber,
        column: 'D',
        field: 'price',
        value: price,
        error: t('xlsx.validation.priceRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const priceNum = parseFloat(price.toString().replace(/[^\d.-]/g, ''));
      if (isNaN(priceNum) || priceNum <= 0) {
        errors.push({
          row: rowNumber,
          column: 'D',
          field: 'price',
          value: price,
          error: t('xlsx.validation.pricePositive'),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.price = priceNum;
      }
    }
    
    // Mileage (columna 4)
    const mileage = row[4];
    if (mileage === undefined || mileage === null || mileage === '') {
      errors.push({
        row: rowNumber,
        column: 'E',
        field: 'mileage',
        value: mileage,
        error: t('xlsx.validation.mileageRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const mileageNum = parseFloat(mileage.toString().replace(/[^\d.-]/g, ''));
      if (isNaN(mileageNum) || mileageNum < 0) {
        errors.push({
          row: rowNumber,
          column: 'E',
          field: 'mileage',
          value: mileage,
          error: t('xlsx.validation.mileagePositive'),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.mileage = mileageNum;
      }
    }
    
    // Fuel (columna 5)
    const fuel = row[5]?.toString().trim();
    if (!fuel) {
      errors.push({
        row: rowNumber,
        column: 'F',
        field: 'fuel',
        value: fuel,
        error: t('xlsx.validation.fuelRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const resolvedFuel = resolveMultilingualValue('fuel', fuel);
      if (!resolvedFuel) {
        errors.push({
          row: rowNumber,
          column: 'F',
          field: 'fuel',
          value: fuel,
          error: t('xlsx.validation.fuelInvalid', { value: fuel }),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.fuel = resolvedFuel;
      }
    }
    
    // Transmission (columna 6)
    const transmission = row[6]?.toString().trim();
    if (!transmission) {
      errors.push({
        row: rowNumber,
        column: 'G',
        field: 'transmission',
        value: transmission,
        error: t('xlsx.validation.transmissionRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const resolvedTransmission = resolveMultilingualValue('transmission', transmission);
      if (!resolvedTransmission) {
        errors.push({
          row: rowNumber,
          column: 'G',
          field: 'transmission',
          value: transmission,
          error: t('xlsx.validation.transmissionInvalid', { value: transmission }),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.transmission = resolvedTransmission;
      }
    }
    
    // Location (columna 7)
    const location = row[7]?.toString().trim();
    if (!location) {
      errors.push({
        row: rowNumber,
        column: 'H',
        field: 'location',
        value: location,
        error: t('xlsx.validation.locationRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      vehicle.location = location;
    }
    
    // Country (columna 8)
    const country = row[8]?.toString().trim();
    if (!country) {
      errors.push({
        row: rowNumber,
        column: 'I',
        field: 'country',
        value: country,
        error: t('xlsx.validation.countryRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const countryObj = countries.find(c => 
        normalizeString(c.name) === normalizeString(country)
      );
      if (!countryObj) {
        errors.push({
          row: rowNumber,
          column: 'I',
          field: 'country',
          value: country,
          error: t('xlsx.validation.countryInvalid', { value: country }),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.country = countryObj.name;
        vehicle.countryCode = countryObj.code;
      }
    }
    
    // CAMPOS OPCIONALES (columnas 9+)
    const vin = row[9]?.toString().trim();
    if (vin && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
        warnings.push({
          row: rowNumber,
          column: 'J',
          field: 'vin',
          value: vin,
          error: t('xlsx.validation.vinInvalid'),
          severity: 'warning'
        });
      warningRows.add(rowNumber);
    } else if (vin) {
      vehicle.vin = vin.toUpperCase();
    }
    
    if (row[10]) vehicle.licensePlate = row[10].toString().trim();
    if (row[11]) {
      const resolvedType = resolveMultilingualValue('vehicleType', row[11].toString().trim());
      vehicle.vehicleType = resolvedType || row[11].toString().trim();
    }
    if (row[12]) vehicle.color = row[12].toString().trim();
    if (row[13]) vehicle.doors = parseInt(row[13].toString(), 10);
    if (row[14]) vehicle.engineSize = parseInt(row[14].toString(), 10);
    if (row[15]) vehicle.enginePower = parseInt(row[15].toString(), 10);
    
    const euroStandard = row[16]?.toString().trim();
    if (euroStandard) {
      const resolvedEuro = resolveMultilingualValue('euroStandard', euroStandard);
      if (resolvedEuro) vehicle.euroStandard = resolvedEuro;
    }
    
    if (row[17]) vehicle.co2Emissions = parseFloat(row[17].toString());
    
    const ivaStatus = row[18]?.toString().trim();
    if (ivaStatus) {
      const resolvedIva = resolveMultilingualValue('ivaStatus', ivaStatus);
      if (resolvedIva) vehicle.ivaStatus = resolvedIva;
    }
    
    if (row[19]) vehicle.cocStatus = row[19].toString().toLowerCase() === 'true';
    if (row[20]) vehicle.acceptsExchange = row[20].toString().toLowerCase() === 'true';
    if (row[21]) vehicle.commissionSale = row[21].toString().toLowerCase() === 'true';
    if (row[22]) vehicle.publicSalePrice = parseFloat(row[22].toString());
    if (row[23]) vehicle.commissionAmount = parseFloat(row[23].toString());
    if (row[24]) vehicle.description = row[24].toString().trim();
    
    if (!hasError) {
      validVehicles.push(vehicle as VehicleFormData);
      validRowCount++;
    } else {
      errorRows.add(rowNumber);
    }
  }
  
  return {
    valid: validVehicles.length > 0,
    validVehicles,
    errors,
    warnings,
    summary: {
      totalRows,
      validRows: validRowCount,
      errorRows: errorRows.size,
      warningRows: warningRows.size
    }
  };
};

// Función para parsear formato ANTIGUO (dos pestañas) - mantener compatibilidad
const parseVehicleData = (mandatoryData: any[][], optionalData: any[][], t: (key: string, params?: Record<string, any>) => string): ParseResult => {
  const validVehicles: VehicleFormData[] = [];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  // Saltar la primera fila (encabezados)
  const mandatoryHeaders = mandatoryData[0] as string[];
  const optionalHeaders = optionalData[0] as string[];
  
  const totalRows = mandatoryData.length - 1; // Sin contar encabezados
  let validRowCount = 0;
  const errorRows = new Set<number>();
  const warningRows = new Set<number>();
  
  // Procesar cada fila de datos
  for (let i = 1; i < mandatoryData.length; i++) {
    const mandatoryRow = mandatoryData[i];
    const optionalRow = optionalData[i] || [];
    
    // Saltar filas vacías
    if (!mandatoryRow || mandatoryRow.every(cell => cell === undefined || cell === '')) {
      continue;
    }
    
    const rowNumber = i + 1; // +1 porque Excel empieza en 1
    const vehicle: any = {
      currency: 'EUR',
      mileageUnit: 'km',
      units: 1,
      ivaStatus: 'included',
      cocStatus: false,
      status: 'available',
      equipment: []
    };
    
    let hasError = false;
    
    // ============ VALIDAR DATOS OBLIGATORIOS ============
    
    // Brand (columna A)
    const brand = mandatoryRow[0]?.toString().trim();
    if (!brand) {
      errors.push({
        row: rowNumber,
        column: 'A',
        field: 'brand',
        value: brand,
        error: t('xlsx.validation.brandRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const matchedBrand = findClosestMatch(brand, VEHICLE_BRANDS);
      if (!matchedBrand) {
        errors.push({
          row: rowNumber,
          column: 'A',
          field: 'brand',
          value: brand,
          error: t('xlsx.validation.brandUnrecognized', { value: brand }),
          severity: 'error',
          suggestion: t('xlsx.validation.brandSuggestion')
        });
        hasError = true;
      } else {
        vehicle.brand = matchedBrand;
        if (matchedBrand !== brand) {
          warnings.push({
            row: rowNumber,
            column: 'A',
            field: 'brand',
            value: brand,
            error: `Se corrigió "${brand}" a "${matchedBrand}"`,
            severity: 'warning'
          });
          warningRows.add(rowNumber);
        }
      }
    }
    
    // Model (columna B)
    const model = mandatoryRow[1]?.toString().trim();
    if (!model) {
      errors.push({
        row: rowNumber,
        column: 'B',
        field: 'model',
        value: model,
        error: t('xlsx.validation.modelRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      vehicle.model = model;
    }
    
    // Year (columna C)
    const year = mandatoryRow[2];
    const currentYear = getCurrentYear();
    if (!year) {
      errors.push({
        row: rowNumber,
        column: 'C',
        field: 'year',
        value: year,
        error: t('xlsx.validation.yearRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const yearNum = parseInt(year.toString(), 10);
      if (isNaN(yearNum)) {
        errors.push({
          row: rowNumber,
          column: 'C',
          field: 'year',
          value: year,
          error: 'El año debe ser un número',
          severity: 'error'
        });
        hasError = true;
      } else if (yearNum < 1900 || yearNum > currentYear + 1) {
        errors.push({
          row: rowNumber,
          column: 'C',
          field: 'year',
          value: year,
          error: t('xlsx.validation.yearRange', { maxYear: currentYear + 1 }),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.year = yearNum;
      }
    }
    
    // Price (columna D)
    const price = mandatoryRow[3];
    if (!price) {
      errors.push({
        row: rowNumber,
        column: 'D',
        field: 'price',
        value: price,
        error: t('xlsx.validation.priceRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const priceNum = parseFloat(price.toString().replace(/[^\d.-]/g, ''));
      if (isNaN(priceNum) || priceNum <= 0) {
        errors.push({
          row: rowNumber,
          column: 'D',
          field: 'price',
          value: price,
          error: t('xlsx.validation.pricePositive'),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.price = priceNum;
      }
    }
    
    // Mileage (columna E)
    const mileage = mandatoryRow[4];
    if (mileage === undefined || mileage === null || mileage === '') {
      errors.push({
        row: rowNumber,
        column: 'E',
        field: 'mileage',
        value: mileage,
        error: t('xlsx.validation.mileageRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const mileageNum = parseFloat(mileage.toString().replace(/[^\d.-]/g, ''));
      if (isNaN(mileageNum) || mileageNum < 0) {
        errors.push({
          row: rowNumber,
          column: 'E',
          field: 'mileage',
          value: mileage,
          error: t('xlsx.validation.mileagePositive'),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.mileage = mileageNum;
      }
    }
    
    // Fuel (columna F)
    const fuel = mandatoryRow[5]?.toString().trim();
    if (!fuel) {
      errors.push({
        row: rowNumber,
        column: 'F',
        field: 'fuel',
        value: fuel,
        error: t('xlsx.validation.fuelRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const resolvedFuel = resolveMultilingualValue('fuel', fuel);
      if (!resolvedFuel) {
        errors.push({
          row: rowNumber,
          column: 'F',
          field: 'fuel',
          value: fuel,
          error: t('xlsx.validation.fuelInvalid', { value: fuel }),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.fuel = resolvedFuel;
      }
    }
    
    // Transmission (columna G)
    const transmission = mandatoryRow[6]?.toString().trim();
    if (!transmission) {
      errors.push({
        row: rowNumber,
        column: 'G',
        field: 'transmission',
        value: transmission,
        error: t('xlsx.validation.transmissionRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const resolvedTransmission = resolveMultilingualValue('transmission', transmission);
      if (!resolvedTransmission) {
        errors.push({
          row: rowNumber,
          column: 'G',
          field: 'transmission',
          value: transmission,
          error: t('xlsx.validation.transmissionInvalid', { value: transmission }),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.transmission = resolvedTransmission;
      }
    }
    
    // Location (columna H)
    const location = mandatoryRow[7]?.toString().trim();
    if (!location) {
      errors.push({
        row: rowNumber,
        column: 'H',
        field: 'location',
        value: location,
        error: t('xlsx.validation.locationRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      vehicle.location = location;
    }
    
    // Country (columna I)
    const country = mandatoryRow[8]?.toString().trim();
    if (!country) {
      errors.push({
        row: rowNumber,
        column: 'I',
        field: 'country',
        value: country,
        error: t('xlsx.validation.countryRequired'),
        severity: 'error'
      });
      hasError = true;
    } else {
      const countryObj = countries.find(c => 
        normalizeString(c.name) === normalizeString(country)
      );
      if (!countryObj) {
        errors.push({
          row: rowNumber,
          column: 'I',
          field: 'country',
          value: country,
          error: t('xlsx.validation.countryInvalid', { value: country }),
          severity: 'error'
        });
        hasError = true;
      } else {
        vehicle.country = countryObj.name;
        vehicle.countryCode = countryObj.code;
      }
    }
    
    // ============ VALIDAR DATOS OPCIONALES ============
    
    if (optionalRow.length > 0) {
      // VIN (columna A de opcional)
      const vin = optionalRow[0]?.toString().trim();
      if (vin) {
        if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
          warnings.push({
            row: rowNumber,
            column: 'A (Opcional)',
            field: 'vin',
            value: vin,
            error: t('xlsx.validation.vinInvalid'),
            severity: 'warning'
          });
          warningRows.add(rowNumber);
        } else {
          vehicle.vin = vin.toUpperCase();
        }
      }
      
      // License Plate (columna B de opcional)
      const licensePlate = optionalRow[1]?.toString().trim();
      if (licensePlate) {
        vehicle.licensePlate = licensePlate;
      }
      
      // Vehicle Type (columna C de opcional)
      const vehicleType = optionalRow[2]?.toString().trim();
      if (vehicleType) {
        const resolvedType = resolveMultilingualValue('vehicleType', vehicleType);
        vehicle.vehicleType = resolvedType || vehicleType;
      }
      
      // Color (columna D de opcional)
      const color = optionalRow[3]?.toString().trim();
      if (color) {
        vehicle.color = color;
      }
      
      // Doors (columna E de opcional)
      const doors = optionalRow[4];
      if (doors) {
        const doorsNum = parseInt(doors.toString(), 10);
        if (!isNaN(doorsNum) && doorsNum > 0) {
          vehicle.doors = doorsNum;
        }
      }
      
      // Engine Size (columna F de opcional)
      const engineSize = optionalRow[5];
      if (engineSize) {
        const engineSizeNum = parseInt(engineSize.toString(), 10);
        if (!isNaN(engineSizeNum) && engineSizeNum > 0) {
          vehicle.engineSize = engineSizeNum;
        }
      }
      
      // Engine Power (columna G de opcional)
      const enginePower = optionalRow[6];
      if (enginePower) {
        const enginePowerNum = parseInt(enginePower.toString(), 10);
        if (!isNaN(enginePowerNum) && enginePowerNum > 0) {
          vehicle.enginePower = enginePowerNum;
        }
      }
      
      // Euro Standard (columna H de opcional)
      const euroStandard = optionalRow[7]?.toString().trim();
      if (euroStandard) {
        const resolvedEuro = resolveMultilingualValue('euroStandard', euroStandard);
        if (resolvedEuro) {
          vehicle.euroStandard = resolvedEuro;
        }
      }
      
      // CO2 Emissions (columna I de opcional)
      const co2Emissions = optionalRow[8];
      if (co2Emissions) {
        const co2Num = parseInt(co2Emissions.toString(), 10);
        if (!isNaN(co2Num) && co2Num >= 0) {
          vehicle.co2Emissions = co2Num;
        }
      }
      
      // IVA Status (columna J de opcional)
      const ivaStatus = optionalRow[9]?.toString().trim();
      if (ivaStatus) {
        const resolvedIva = resolveMultilingualValue('ivaStatus', ivaStatus);
        if (resolvedIva) {
          vehicle.ivaStatus = resolvedIva;
        }
      }
      
      // COC Status (columna K de opcional)
      const cocStatus = optionalRow[10]?.toString().trim().toLowerCase();
      if (cocStatus === 'true' || cocStatus === '1' || cocStatus === 'yes' || cocStatus === 'sí') {
        vehicle.cocStatus = true;
      } else if (cocStatus === 'false' || cocStatus === '0' || cocStatus === 'no') {
        vehicle.cocStatus = false;
      }
      
      // Accepts Exchange (columna L de opcional)
      const acceptsExchange = optionalRow[11]?.toString().trim().toLowerCase();
      if (acceptsExchange === 'true' || acceptsExchange === '1' || acceptsExchange === 'yes' || acceptsExchange === 'sí') {
        vehicle.acceptsExchange = true;
      } else if (acceptsExchange === 'false' || acceptsExchange === '0' || acceptsExchange === 'no') {
        vehicle.acceptsExchange = false;
      }
      
      // Commission Sale (columna M de opcional)
      const commissionSale = optionalRow[12]?.toString().trim().toLowerCase();
      if (commissionSale === 'true' || commissionSale === '1' || commissionSale === 'yes' || commissionSale === 'sí') {
        vehicle.commissionSale = true;
      } else if (commissionSale === 'false' || commissionSale === '0' || commissionSale === 'no') {
        vehicle.commissionSale = false;
      }
      
      // Public Sale Price (columna N de opcional)
      const publicSalePrice = optionalRow[13];
      if (publicSalePrice) {
        const publicPriceNum = parseFloat(publicSalePrice.toString().replace(/[^\d.-]/g, ''));
        if (!isNaN(publicPriceNum) && publicPriceNum > 0) {
          vehicle.publicSalePrice = publicPriceNum;
        }
      }
      
      // Commission Amount (columna O de opcional)
      const commissionAmount = optionalRow[14];
      if (commissionAmount) {
        const commissionNum = parseFloat(commissionAmount.toString().replace(/[^\d.-]/g, ''));
        if (!isNaN(commissionNum) && commissionNum >= 0) {
          vehicle.commissionAmount = commissionNum;
        }
      }
      
      // Description (columna P de opcional)
      const description = optionalRow[15]?.toString().trim();
      if (description) {
        if (description.length > 2000) {
          warnings.push({
            row: rowNumber,
            column: 'P (Opcional)',
            field: 'description',
            value: description,
            error: 'La descripción excede los 2000 caracteres y será truncada',
            severity: 'warning'
          });
          warningRows.add(rowNumber);
          vehicle.description = description.substring(0, 2000);
        } else {
          vehicle.description = description;
        }
      }
    }
    
    // Si no hay errores, agregar a vehículos válidos
    if (!hasError) {
      validVehicles.push(vehicle as VehicleFormData);
      validRowCount++;
    } else {
      errorRows.add(rowNumber);
    }
  }
  
  return {
    valid: errorRows.size === 0,
    validVehicles,
    errors,
    warnings,
    summary: {
      totalRows,
      validRows: validRowCount,
      errorRows: errorRows.size,
      warningRows: warningRows.size
    }
  };
};

// Función para generar reporte de errores en XLSX
export const generateErrorReport = (
  parseResult: ParseResult,
  originalMandatoryData: any[][],
  originalOptionalData: any[][]
): Blob => {
  const wb = XLSX.utils.book_new();
  
  // ================== PESTAÑA 1: RESUMEN DE ERRORES ==================
  const summaryData = [
    ['📊 RESUMEN DE VALIDACIÓN'],
    [],
    ['Total de filas procesadas:', parseResult.summary.totalRows],
    ['✅ Filas válidas:', parseResult.summary.validRows],
    ['❌ Filas con errores:', parseResult.summary.errorRows],
    ['⚠️ Filas con advertencias:', parseResult.summary.warningRows],
    [],
    ['LISTADO DE ERRORES:'],
    ['Fila', 'Campo', 'Valor', 'Error', 'Sugerencia']
  ];
  
  parseResult.errors.forEach(error => {
    summaryData.push([
      error.row,
      error.field,
      error.value?.toString() || '',
      error.error,
      error.suggestion || ''
    ]);
  });
  
  if (parseResult.warnings.length > 0) {
    summaryData.push([]);
    summaryData.push(['ADVERTENCIAS:']);
    summaryData.push(['Fila', 'Campo', 'Valor', 'Advertencia']);
    
    parseResult.warnings.forEach(warning => {
      summaryData.push([
        warning.row,
        warning.field,
        warning.value?.toString() || '',
        warning.error
      ]);
    });
  }
  
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [
    { wch: 10 },
    { wch: 20 },
    { wch: 30 },
    { wch: 50 },
    { wch: 40 }
  ];
  XLSX.utils.book_append_sheet(wb, wsSummary, '📊 Resumen');
  
  // ================== PESTAÑA 2: DATOS CON ERRORES MARCADOS ==================
  const errorRowNumbers = new Set(parseResult.errors.map(e => e.row));
  
  // Clonar datos originales y marcar errores
  const mandatoryWithErrors = originalMandatoryData.map((row, index) => {
    const rowNumber = index + 1;
    if (errorRowNumbers.has(rowNumber)) {
      return ['❌ ERROR', ...row];
    }
    return ['', ...row];
  });
  
  // Agregar columna de ERROR al inicio
  mandatoryWithErrors[0][0] = 'ESTADO';
  
  const wsErrors = XLSX.utils.aoa_to_sheet(mandatoryWithErrors);
  XLSX.utils.book_append_sheet(wb, wsErrors, '❌ Datos con Errores');
  
  // Generar blob
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};
