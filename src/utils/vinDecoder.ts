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
  const wmi2 = upper.substring(0, 2);
  
  // European country mapping (detailed)
  if (firstChar === 'W') result.country = 'Alemania';
  else if (['SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG', 'SH', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SR', 'SS', 'ST'].includes(wmi2) || firstChar === 'S') result.country = 'Reino Unido';
  else if (['VF', 'VG', 'VH', 'VJ', 'VK', 'VL', 'VM', 'VN', 'VP', 'VR', 'VS'].includes(wmi2)) {
    if (wmi2 === 'VS') result.country = 'España';
    else result.country = 'Francia';
  }
  else if (firstChar === 'Z') result.country = 'Italia';
  else if (['TM', 'TK', 'TJ'].includes(wmi2) || firstChar === 'T') result.country = 'República Checa';
  else if (['TR', 'TW'].includes(wmi2)) result.country = 'Hungría';
  else if (wmi2 === 'UU') result.country = 'Rumanía';
  else if (['XL', 'XW', 'X4', 'X9'].includes(wmi2)) result.country = 'Rusia';
  else if (['YV', 'YK'].includes(wmi2)) result.country = 'Suecia';
  else if (['YB', 'YC', 'YF'].includes(wmi2)) result.country = 'Finlandia';
  else if (wmi2 === 'YS') result.country = 'Noruega';
  else if (['NL', 'NM', 'NP'].includes(wmi2)) result.country = 'Turquía';
  else if (firstChar === 'J') result.country = 'Japón';
  else if (firstChar === 'K') result.country = 'Corea del Sur';
  else if (firstChar === 'L') result.country = 'China';
  else if (['1', '4', '5'].includes(firstChar)) result.country = 'Estados Unidos';

  return result;
};

/**
 * Async VIN decoder - uses local decode only (European market).
 * No dependency on NHTSA (US market API).
 */
export const decodeVinAsync = async (vin: string): Promise<VinDecodedData> => {
  return decodeVin(vin);
};