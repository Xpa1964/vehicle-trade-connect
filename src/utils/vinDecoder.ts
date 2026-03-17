/**
 * Client-side VIN decoder.
 * Extracts manufacturer (WMI), model year, and basic attributes from a 17-char VIN.
 * Falls back gracefully — never blocks the user.
 */

export interface VinDecodedData {
  brand: string | null;
  model: string | null;
  year: number | null;
  fuel: string | null;
  transmission: string | null;
  country: string | null;
  engineSize: number | null;
  enginePower: number | null;
  doors: number | null;
  vehicleType: string | null;
}

const WMI_BRAND_MAP: Record<string, string> = {
  'WBA': 'BMW', 'WBS': 'BMW', 'WBY': 'BMW', 'WBW': 'BMW',
  'WUA': 'AUDI', 'WAU': 'AUDI', 'WA1': 'AUDI',
  'WDB': 'MERCEDES-BENZ', 'WDC': 'MERCEDES-BENZ', 'WDD': 'MERCEDES-BENZ', 'W1K': 'MERCEDES-BENZ', 'W1N': 'MERCEDES-BENZ',
  'WVW': 'VOLKSWAGEN', 'WV1': 'VOLKSWAGEN', 'WV2': 'VOLKSWAGEN', 'WV3': 'VOLKSWAGEN',
  'WF0': 'FORD', 'WF1': 'FORD',
  'W0L': 'OPEL',
  'WP0': 'PORSCHE', 'WP1': 'PORSCHE',
  'VF1': 'RENAULT', 'VF2': 'RENAULT', 'VF6': 'RENAULT',
  'VF3': 'PEUGEOT', 'VF7': 'PEUGEOT',
  'VF8': 'CITROEN', 'VR7': 'CITROEN',
  'VF9': 'DACIA',
  'ZAR': 'ALFA ROMEO',
  'ZFA': 'FIAT', 'ZFC': 'FIAT',
  'ZLA': 'LANCIA',
  'ZAM': 'MASERATI',
  'ZFF': 'FERRARI',
  'ZHW': 'LAMBORGHINI',
  'VSS': 'SEAT',
  'TMB': 'SKODA',
  'YV1': 'VOLVO', 'YV4': 'VOLVO',
  'JTD': 'TOYOTA', 'JTE': 'TOYOTA', 'JTH': 'TOYOTA',
  'JN1': 'NISSAN', 'JN3': 'NISSAN',
  'JHM': 'HONDA', 'JHL': 'HONDA',
  'JMZ': 'MAZDA', 'JM1': 'MAZDA',
  'JA3': 'MITSUBISHI', 'JA4': 'MITSUBISHI', 'JMB': 'MITSUBISHI',
  'JF1': 'SUBARU', 'JF2': 'SUBARU',
  'JS1': 'SUZUKI', 'JS3': 'SUZUKI',
  'KMH': 'HYUNDAI', 'KNA': 'KIA', 'KNC': 'KIA',
  '1FA': 'FORD', '1FT': 'FORD', '2FA': 'FORD', '3FA': 'FORD',
  '1G1': 'CHEVROLET', '1GC': 'CHEVROLET',
  '1GY': 'CADILLAC',
  '1G4': 'BUICK',
  '1GT': 'GMC',
  '2C3': 'CHRYSLER', '2C4': 'CHRYSLER',
  '2B3': 'DODGE', '2D3': 'DODGE',
  '1J4': 'JEEP', '1C4': 'JEEP',
  '1LN': 'LINCOLN',
  '19U': 'ACURA',
  'JNK': 'INFINITI',
  'JTJ': 'LEXUS',
  '5YJ': 'TESLA', '7SA': 'TESLA',
  'SAJ': 'JAGUAR', 'SAL': 'LAND ROVER',
  'UU1': 'DACIA',
  'JAA': 'ISUZU',
  // Turkish manufacturers
  'NLH': 'HYUNDAI', 'NLE': 'HYUNDAI',
  'NMT': 'TOYOTA', 'NM0': 'FORD', 'NM4': 'FORD',
  'NMA': 'FIAT',
  'U5Y': 'KIA', 'KNE': 'KIA',
  'SJN': 'NISSAN',
  // Additional European
  'TRU': 'AUDI', 'TK9': 'SKODA',
  'LVS': 'FORD', 'LVG': 'FORD',
  'MEE': 'RENAULT',
  'VNE': 'RENAULT',
};

const YEAR_CODES: Record<string, number> = {
  'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
  'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
  'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
  'S': 2025, 'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029,
  'Y': 2030,
  '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
  '6': 2006, '7': 2007, '8': 2008, '9': 2009,
};

export const isValidVin = (vin: string): boolean => {
  if (!vin || vin.length !== 17) return false;
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
};

export const decodeVin = (vin: string): VinDecodedData => {
  const result: VinDecodedData = {
    brand: null,
    model: null,
    year: null,
    fuel: null,
    transmission: null,
    country: null,
    engineSize: null,
    enginePower: null,
    doors: null,
    vehicleType: null,
  };

  if (!isValidVin(vin)) return result;

  const upper = vin.toUpperCase();
  const wmi = upper.substring(0, 3);
  result.brand = WMI_BRAND_MAP[wmi] || null;

  if (!result.brand) {
    const wmi2 = upper.substring(0, 2);
    for (const [key, brand] of Object.entries(WMI_BRAND_MAP)) {
      if (key.startsWith(wmi2)) {
        result.brand = brand;
        break;
      }
    }
  }

  const yearChar = upper.charAt(9);
  result.year = YEAR_CODES[yearChar] || null;

  const firstChar = upper.charAt(0);
  if (['1', '4', '5'].includes(firstChar)) result.country = 'Estados Unidos';
  else if (firstChar === '2') result.country = 'Canada';
  else if (firstChar === '3') result.country = 'Mexico';
  else if (firstChar === 'J') result.country = 'Japan';
  else if (firstChar === 'K') result.country = 'Korea';
  else if (['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].includes(firstChar)) result.country = 'Europa';

  return result;
};

interface NHTSAResult {
  Variable: string;
  Value: string | null;
  ValueId: string | null;
}

const NHTSA_FUEL_MAP: Record<string, string> = {
  'Gasoline': 'gasolina',
  'Diesel': 'diesel',
  'Electric': 'electrico',
  'Compressed Natural Gas (CNG)': 'gas_natural',
  'Ethanol (E85)': 'gasolina',
  'Flexible Fuel Vehicle (FFV)': 'gasolina',
  'Hydrogen Fuel Cell': 'hidrogeno',
  'Plug-in Hybrid Electric Vehicle (PHEV)': 'hibrido_enchufable',
  'Hybrid': 'hibrido',
};

const FUEL_ES_MAP: Record<string, string> = {
  gasoline: 'gasolina',
  diesel: 'diesel',
  electric: 'electrico',
  hybrid: 'hibrido',
  hydrogen: 'hidrogeno',
  gas: 'gas_natural',
  cng: 'gas_natural',
  lpg: 'glp',
  phev: 'hibrido_enchufable',
  'plug-in hybrid': 'hibrido_enchufable',
};

const fetchWithTimeout = async (url: string, timeoutMs = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const decodeVinAsync = async (vin: string): Promise<VinDecodedData> => {
  const local = decodeVin(vin);

  if (!isValidVin(vin)) return local;

  try {
    const response = await fetchWithTimeout(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
    );

    if (!response.ok) return local;

    const data = await response.json();
    const results: NHTSAResult[] = data.Results || [];

    const getValue = (variableNames: string | string[]) => {
      const names = Array.isArray(variableNames) ? variableNames : [variableNames];

      for (const variableName of names) {
        const item = results.find((result) => result.Variable === variableName);
        const value = item?.Value?.trim();
        if (value && value !== 'Not Applicable') {
          return value;
        }
      }

      return null;
    };

    const brand = getValue('Make') || local.brand;
    const model = getValue('Model') || local.model;
    const yearStr = getValue('Model Year');
    const year = yearStr ? parseInt(yearStr, 10) : local.year;

    const fuelType = getValue(['Fuel Type - Primary', 'Fuel Type - Secondary']);
    let fuel = local.fuel;
    if (fuelType) {
      fuel = NHTSA_FUEL_MAP[fuelType] || FUEL_ES_MAP[fuelType.toLowerCase()] || fuelType.toLowerCase();
    }

    const transmissionStyle = getValue(['Transmission Style', 'Transmission Speeds']);
    let transmission = local.transmission;
    if (transmissionStyle) {
      const normalizedTransmission = transmissionStyle.toLowerCase();
      if (normalizedTransmission.includes('auto')) transmission = 'automatic';
      else if (normalizedTransmission.includes('manual')) transmission = 'manual';
    }

    const engineSizeStr = getValue(['Displacement (L)', 'Displacement (CC)']);
    const engineSize = engineSizeStr ? parseFloat(engineSizeStr) : local.engineSize;

    const enginePowerStr = getValue(['Engine Brake (hp) From', 'Engine HP']);
    const enginePower = enginePowerStr ? parseInt(enginePowerStr, 10) : local.enginePower;

    const doorsStr = getValue('Doors');
    const doors = doorsStr ? parseInt(doorsStr, 10) : local.doors;

    const vehicleType = getValue(['Body Class', 'Vehicle Type']) || local.vehicleType;

    return {
      brand: brand?.toUpperCase() || null,
      model: model?.toUpperCase() || null,
      year: year && !Number.isNaN(year) ? year : null,
      fuel,
      transmission,
      country: local.country,
      engineSize: engineSize && !Number.isNaN(engineSize) ? engineSize : null,
      enginePower: enginePower && !Number.isNaN(enginePower) ? enginePower : null,
      doors: doors && !Number.isNaN(doors) ? doors : null,
      vehicleType,
    };
  } catch (error) {
    console.warn('[VIN Decoder] NHTSA API failed, using local decode:', error);
    return local;
  }
};