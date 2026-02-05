/**
 * Transport Price Calculator
 * Reusable pure function for calculating transport prices
 * Base of operations: Province of Barcelona
 */

// ============= TYPES =============

export type VehicleType = 'standard' | 'premium' | 'industrial';

export interface OptionalServices {
  cleaning: boolean;           // +0.5h
  personalizedDelivery: boolean; // +1h
  urgent: boolean;             // +20%
  night: boolean;              // +25%
  holiday: boolean;            // +25%
}

export interface CalculatorInput {
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  vehicleType: VehicleType;
  optionalServices: OptionalServices;
  distanceKm: number;
}

export type ResultType = 'FINAL' | 'ORIENTATIVE' | 'NOT_AVAILABLE';

export interface PriceBreakdown {
  driving: number;
  extras: number;
  return: number;
  insurance: number;
  surcharges: number;
}

export interface CalculationResult {
  type: ResultType;
  price: number | null;
  distanceKm: number;
  drivingTimeHours: number;
  extraHours: number;
  hourlyRate: number;
  returnCost: number;
  insuranceCost: number;
  surchargePercentage: number;
  breakdown: PriceBreakdown;
  warningMessage?: string;
}

// ============= CONSTANTS =============

// Hourly rates by vehicle type
const HOURLY_RATES: Record<VehicleType, number> = {
  standard: 22.5,
  premium: 25,
  industrial: 27.5
};

// Extra hours for optional services
const EXTRA_HOURS = {
  cleaning: 0.5,
  personalizedDelivery: 1
};

// Percentage surcharges
const SURCHARGES = {
  urgent: 0.20,   // +20%
  night: 0.25,    // +25%
  holiday: 0.25   // +25%
};

// Insurance and structure costs
const INSURANCE_COST = {
  national: 15,
  international: 40
};

// Return costs by zone (fixed static values)
// UPDATED: Cataluña = 35€, added Centro = 95€
const RETURN_COSTS = {
  barcelona: 0,
  cataluna: 35,        // Updated from 25
  centro: 95,          // New zone
  espana_norte: 80,
  espana_sur: 120,
  europa_cercana: 200,
  europa_lejana: 350
};

// Barcelona province cities (for validation)
const BARCELONA_CITIES = [
  'barcelona', 'hospitalet', 'badalona', 'terrassa', 
  'sabadell', 'mataro', 'santa coloma', 'cornella',
  'sant boi', 'sant cugat', 'manresa', 'rubi', 
  'vilanova', 'viladecans', 'granollers', 'cerdanyola',
  'mollet', 'esplugues', 'gava', 'igualada',
  'el prat', 'castelldefels', 'montcada', 'vic',
  'berga', 'martorell'
];

// Catalonia cities (excluding Barcelona province)
const CATALUNA_CITIES = [
  'tarragona', 'reus', 'lleida', 'girona', 'figueres',
  'tortosa', 'amposta', 'cambrils', 'salou', 'blanes',
  'lloret', 'roses', 'la seu', 'puigcerda', 'olot'
];

// Centro de España cities
const CENTRO_CITIES = [
  'madrid', 'toledo', 'guadalajara', 'cuenca', 'ciudad real',
  'albacete', 'segovia', 'avila', 'salamanca', 'valladolid',
  'zamora', 'palencia', 'burgos', 'soria', 'aranjuez',
  'alcala', 'getafe', 'mostoles', 'alcorcon', 'leganes',
  'fuenlabrada', 'parla', 'torrejon', 'alcobendas'
];

// Norte de España cities
const NORTE_CITIES = [
  'bilbao', 'san sebastian', 'vitoria', 'pamplona', 'logroño',
  'santander', 'oviedo', 'gijon', 'a coruña', 'vigo',
  'santiago', 'pontevedra', 'lugo', 'orense', 'leon',
  'zaragoza', 'huesca', 'teruel'
];

// Sur de España cities
const SUR_CITIES = [
  'sevilla', 'malaga', 'granada', 'cordoba', 'cadiz',
  'huelva', 'jaen', 'almeria', 'murcia', 'cartagena',
  'alicante', 'valencia', 'castellon', 'elche', 'benidorm',
  'marbella', 'jerez', 'algeciras'
];

// Close European countries
const EUROPA_CERCANA = ['francia', 'france', 'portugal', 'andorra', 'italia', 'italy'];

// ============= HELPER FUNCTIONS =============

function normalizeString(str: string): string {
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function isInBarcelonaProvince(city: string): boolean {
  const normalized = normalizeString(city);
  return BARCELONA_CITIES.some(c => normalized.includes(c) || c.includes(normalized));
}

function isInCataluna(city: string): boolean {
  const normalized = normalizeString(city);
  return CATALUNA_CITIES.some(c => normalized.includes(c) || c.includes(normalized));
}

function isInCentro(city: string): boolean {
  const normalized = normalizeString(city);
  return CENTRO_CITIES.some(c => normalized.includes(c) || c.includes(normalized));
}

function isInNorte(city: string): boolean {
  const normalized = normalizeString(city);
  return NORTE_CITIES.some(c => normalized.includes(c) || c.includes(normalized));
}

function isInSur(city: string): boolean {
  const normalized = normalizeString(city);
  return SUR_CITIES.some(c => normalized.includes(c) || c.includes(normalized));
}

function isSpain(country: string): boolean {
  const normalized = normalizeString(country);
  return normalized === 'spain' || normalized === 'espana' || normalized === 'españa';
}

function isCloseEurope(country: string): boolean {
  const normalized = normalizeString(country);
  return EUROPA_CERCANA.some(c => normalized.includes(c));
}

function isInternational(originCountry: string, destCountry: string): boolean {
  return !isSpain(originCountry) || !isSpain(destCountry);
}

// ============= GEOGRAPHIC VALIDATION =============

interface GeoValidation {
  isValid: boolean;
  resultType: ResultType;
  warningMessage?: string;
}

function validateGeographicRules(input: CalculatorInput): GeoValidation {
  const originIsSpain = isSpain(input.originCountry);
  const destIsSpain = isSpain(input.destinationCountry);
  const originInBarcelona = isInBarcelonaProvince(input.originCity);
  const destInBarcelona = isInBarcelonaProvince(input.destinationCity);

  // NATIONAL (both in Spain)
  if (originIsSpain && destIsSpain) {
    // If neither is in Barcelona → NOT AVAILABLE
    if (!originInBarcelona && !destInBarcelona) {
      return {
        isValid: false,
        resultType: 'NOT_AVAILABLE',
        warningMessage: 'Servicio no disponible: origen y destino fuera de provincia de Barcelona.'
      };
    }
    return { isValid: true, resultType: 'FINAL' };
  }

  // INTERNATIONAL
  // If neither country is Spain → NOT AVAILABLE
  if (!originIsSpain && !destIsSpain) {
    return {
      isValid: false,
      resultType: 'NOT_AVAILABLE',
      warningMessage: 'Solo realizamos trayectos con origen o destino en España.'
    };
  }

  // International with Spain involved
  // If Spanish city is NOT in Barcelona → ORIENTATIVE
  const spanishCityInBarcelona = originIsSpain 
    ? originInBarcelona 
    : destInBarcelona;

  if (!spanishCityInBarcelona) {
    return {
      isValid: true,
      resultType: 'ORIENTATIVE',
      warningMessage: 'Origen o destino fuera de la provincia de Barcelona. El precio mostrado es orientativo. Este servicio puede tener un recargo adicional. Por favor, contáctanos antes de confirmar.'
    };
  }

  return { isValid: true, resultType: 'FINAL' };
}

// ============= RETURN COST CALCULATION =============

function calculateReturnCost(input: CalculatorInput): number {
  // Determine which city we need to return from (the one NOT in Barcelona)
  const originInBarcelona = isInBarcelonaProvince(input.originCity);
  const destInBarcelona = isInBarcelonaProvince(input.destinationCity);
  
  // If destination is Barcelona, no return needed
  if (destInBarcelona) {
    return RETURN_COSTS.barcelona;
  }
  
  // Determine destination zone for return
  const destCity = input.destinationCity;
  const destCountry = input.destinationCountry;
  
  if (isSpain(destCountry)) {
    if (isInBarcelonaProvince(destCity)) return RETURN_COSTS.barcelona;
    if (isInCataluna(destCity)) return RETURN_COSTS.cataluna;
    if (isInCentro(destCity)) return RETURN_COSTS.centro;
    if (isInNorte(destCity)) return RETURN_COSTS.espana_norte;
    if (isInSur(destCity)) return RETURN_COSTS.espana_sur;
    // Default for unknown Spanish cities
    return RETURN_COSTS.centro;
  }
  
  // International
  if (isCloseEurope(destCountry)) {
    return RETURN_COSTS.europa_cercana;
  }
  
  return RETURN_COSTS.europa_lejana;
}

// ============= MAIN CALCULATOR FUNCTION =============

export function calculateTransportPrice(input: CalculatorInput): CalculationResult {
  // 1. Validate geographic rules
  const geoValidation = validateGeographicRules(input);
  
  if (!geoValidation.isValid) {
    return {
      type: 'NOT_AVAILABLE',
      price: null,
      distanceKm: input.distanceKm,
      drivingTimeHours: 0,
      extraHours: 0,
      hourlyRate: 0,
      returnCost: 0,
      insuranceCost: 0,
      surchargePercentage: 0,
      breakdown: {
        driving: 0,
        extras: 0,
        return: 0,
        insurance: 0,
        surcharges: 0
      },
      warningMessage: geoValidation.warningMessage
    };
  }

  // 2. Round distance to nearest 10 km
  const roundedDistance = Math.round(input.distanceKm / 10) * 10;

  // 3. Calculate driving time (hours = km / 95)
  const drivingTimeHours = roundedDistance / 95;

  // 4. Calculate extra hours
  let extraHours = 0;
  if (input.optionalServices.cleaning) extraHours += EXTRA_HOURS.cleaning;
  if (input.optionalServices.personalizedDelivery) extraHours += EXTRA_HOURS.personalizedDelivery;

  // 5. Get hourly rate
  const hourlyRate = HOURLY_RATES[input.vehicleType];

  // 6. Calculate return cost
  const returnCost = calculateReturnCost(input);

  // 7. Determine insurance cost
  const international = isInternational(input.originCountry, input.destinationCountry);
  const insuranceCost = international ? INSURANCE_COST.international : INSURANCE_COST.national;

  // 8. Calculate base price
  const drivingCost = drivingTimeHours * hourlyRate;
  const extrasCost = extraHours * hourlyRate;
  const basePrice = drivingCost + extrasCost + returnCost + insuranceCost;

  // 9. Apply percentage surcharges
  let surchargePercentage = 0;
  if (input.optionalServices.urgent) surchargePercentage += SURCHARGES.urgent;
  if (input.optionalServices.night) surchargePercentage += SURCHARGES.night;
  if (input.optionalServices.holiday) surchargePercentage += SURCHARGES.holiday;

  const surchargeAmount = basePrice * surchargePercentage;
  const finalPrice = basePrice + surchargeAmount;

  return {
    type: geoValidation.resultType,
    price: Math.round(finalPrice * 100) / 100,
    distanceKm: roundedDistance,
    drivingTimeHours: Math.round(drivingTimeHours * 100) / 100,
    extraHours,
    hourlyRate,
    returnCost,
    insuranceCost,
    surchargePercentage,
    breakdown: {
      driving: Math.round(drivingCost * 100) / 100,
      extras: Math.round(extrasCost * 100) / 100,
      return: returnCost,
      insurance: insuranceCost,
      surcharges: Math.round(surchargeAmount * 100) / 100
    },
    warningMessage: geoValidation.warningMessage
  };
}

// ============= DISTANCE ESTIMATION =============

// Static distance estimates from Barcelona (for fallback when API unavailable)
const DISTANCE_ESTIMATES: Record<string, number> = {
  // Cataluña
  'tarragona': 100,
  'lleida': 160,
  'girona': 100,
  // Centro
  'madrid': 620,
  'toledo': 690,
  'valladolid': 660,
  // Norte
  'zaragoza': 310,
  'bilbao': 610,
  'san sebastian': 570,
  'pamplona': 470,
  // Sur
  'valencia': 350,
  'alicante': 520,
  'sevilla': 1000,
  'malaga': 970,
  'granada': 870,
  // Europa
  'paris': 1040,
  'lyon': 550,
  'marsella': 500,
  'milan': 900,
  'roma': 1360,
  'lisboa': 1270,
};

export function getEstimatedDistance(destinationCity: string): number | null {
  const normalized = normalizeString(destinationCity);
  
  for (const [city, distance] of Object.entries(DISTANCE_ESTIMATES)) {
    if (normalized.includes(city) || city.includes(normalized)) {
      return distance;
    }
  }
  
  return null;
}

// Export constants for use in UI
export const VEHICLE_TYPES = [
  { value: 'standard' as VehicleType, rate: 22.5 },
  { value: 'premium' as VehicleType, rate: 25 },
  { value: 'industrial' as VehicleType, rate: 27.5 }
];

export const OPTIONAL_SERVICES = [
  { key: 'cleaning', extraHours: 0.5 },
  { key: 'personalizedDelivery', extraHours: 1 },
  { key: 'urgent', surcharge: 0.20 },
  { key: 'night', surcharge: 0.25 },
  { key: 'holiday', surcharge: 0.25 }
];
