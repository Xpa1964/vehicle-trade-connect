/**
 * Client-side VIN decoder.
 * Extracts manufacturer (WMI), model year, and basic attributes from a 17-char VIN.
 * Falls back gracefully — never blocks the user.
 */

export interface VinDecodedData {
  brand: string | null;
  year: number | null;
  fuel: string | null;
  transmission: string | null;
  country: string | null;
}

// ──────────── WMI → Brand mapping (first 3 chars of VIN) ────────────

const WMI_BRAND_MAP: Record<string, string> = {
  // German
  'WBA': 'BMW', 'WBS': 'BMW', 'WBY': 'BMW', 'WBW': 'BMW',
  'WUA': 'AUDI', 'WAU': 'AUDI', 'WA1': 'AUDI',
  'WDB': 'MERCEDES-BENZ', 'WDC': 'MERCEDES-BENZ', 'WDD': 'MERCEDES-BENZ', 'W1K': 'MERCEDES-BENZ', 'W1N': 'MERCEDES-BENZ',
  'WVW': 'VOLKSWAGEN', 'WV1': 'VOLKSWAGEN', 'WV2': 'VOLKSWAGEN', 'WV3': 'VOLKSWAGEN',
  'WF0': 'FORD', 'WF1': 'FORD',
  'W0L': 'OPEL',
  'WP0': 'PORSCHE', 'WP1': 'PORSCHE',
  // French
  'VF1': 'RENAULT', 'VF2': 'RENAULT', 'VF6': 'RENAULT',
  'VF3': 'PEUGEOT', 'VF7': 'PEUGEOT',
  'VF8': 'CITROEN', 'VR7': 'CITROEN',
  'VF9': 'DACIA',
  // Italian
  'ZAR': 'ALFA ROMEO',
  'ZFA': 'FIAT', 'ZFC': 'FIAT',
  'ZLA': 'LANCIA',
  'ZAM': 'MASERATI',
  'ZFF': 'FERRARI',
  'ZHW': 'LAMBORGHINI',
  // Spanish
  'VSS': 'SEAT',
  // Czech
  'TMB': 'SKODA',
  // Swedish
  'YV1': 'VOLVO', 'YV4': 'VOLVO',
  // Japanese
  'JTD': 'TOYOTA', 'JTE': 'TOYOTA', 'JTH': 'TOYOTA',
  'JN1': 'NISSAN', 'JN3': 'NISSAN',
  'JHM': 'HONDA', 'JHL': 'HONDA',
  'JMZ': 'MAZDA', 'JM1': 'MAZDA',
  'JA3': 'MITSUBISHI', 'JA4': 'MITSUBISHI', 'JMB': 'MITSUBISHI',
  'JF1': 'SUBARU', 'JF2': 'SUBARU',
  'JS1': 'SUZUKI', 'JS3': 'SUZUKI',
  // Korean
  'KMH': 'HYUNDAI', 'KNA': 'KIA', 'KNC': 'KIA',
  // USA
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
  // Tesla
  '5YJ': 'TESLA', '7SA': 'TESLA',
  // British
  'SAJ': 'JAGUAR', 'SAL': 'LAND ROVER',
  // Romanian
  'UU1': 'DACIA',
  // Isuzu
  'JAA': 'ISUZU',
};

// ──────────── Model Year from VIN position 10 ────────────

const YEAR_CODES: Record<string, number> = {
  'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
  'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
  'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
  'S': 2025, 'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029,
  'Y': 2030,
  '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
  '6': 2006, '7': 2007, '8': 2008, '9': 2009,
};

// ──────────── Public API ────────────

export const isValidVin = (vin: string): boolean => {
  if (!vin || vin.length !== 17) return false;
  // VIN must be alphanumeric, no I, O, Q
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
};

export const decodeVin = (vin: string): VinDecodedData => {
  const result: VinDecodedData = {
    brand: null,
    year: null,
    fuel: null,
    transmission: null,
    country: null,
  };

  if (!isValidVin(vin)) return result;

  const upper = vin.toUpperCase();
  const wmi = upper.substring(0, 3);

  // Brand from WMI
  result.brand = WMI_BRAND_MAP[wmi] || null;

  // If exact 3-char match fails, try first 2 chars
  if (!result.brand) {
    const wmi2 = upper.substring(0, 2);
    for (const [key, brand] of Object.entries(WMI_BRAND_MAP)) {
      if (key.startsWith(wmi2)) {
        result.brand = brand;
        break;
      }
    }
  }

  // Year from position 10 (index 9)
  const yearChar = upper.charAt(9);
  result.year = YEAR_CODES[yearChar] || null;

  // Country of origin from first char
  const firstChar = upper.charAt(0);
  if (['1', '4', '5'].includes(firstChar)) result.country = 'Estados Unidos';
  else if (firstChar === '2') result.country = 'Canada';
  else if (firstChar === '3') result.country = 'Mexico';
  else if (firstChar === 'J') result.country = 'Japan';
  else if (firstChar === 'K') result.country = 'Korea';
  else if (['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].includes(firstChar)) result.country = 'Europa';

  return result;
};
