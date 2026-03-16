import { VehicleFormData, Vehicle } from '@/types/vehicle';

const normalizeLocation = (location?: string | null, country?: string | null) => {
  const trimmedLocation = location?.trim() || '';
  const trimmedCountry = country?.trim() || '';

  if (!trimmedLocation) return '';
  if (!trimmedCountry) return trimmedLocation;

  const normalizedLocation = trimmedLocation.toLowerCase();
  const normalizedCountry = trimmedCountry.toLowerCase();
  const countrySuffix = `, ${normalizedCountry}`;

  if (normalizedLocation === normalizedCountry) {
    return '';
  }

  if (normalizedLocation.endsWith(countrySuffix)) {
    return trimmedLocation.slice(0, trimmedLocation.length - countrySuffix.length).trim();
  }

  return trimmedLocation;
};

export const mapFormDataToVehicle = (formData: VehicleFormData) => {
  let registrationDateString = null;

  if (formData.registrationDate) {
    if (formData.registrationDate instanceof Date) {
      registrationDateString = formData.registrationDate.toISOString().split('T')[0];
    } else if (typeof formData.registrationDate === 'string') {
      registrationDateString = formData.registrationDate;
    }
  }

  return {
    brand: formData.brand,
    model: formData.model,
    year: formData.year,
    price: formData.price,
    mileage: formData.mileage,
    fuel: formData.fuel,
    transmission: formData.transmission,
    location: formData.location?.trim() || null,
    country: formData.country?.trim() || null,
    country_code: formData.countryCode,
    status: formData.status,
    description: formData.description || '',
    vin: formData.vin || '',
    license_plate: formData.licensePlate || '',
    registration_date: registrationDateString,
    vehicle_type: formData.vehicleType || '',
    transaction_type: formData.transactionType || 'national',
    accepts_exchange: formData.acceptsExchange || false,
    engine_size: formData.engineSize || null,
    engine_power: formData.enginePower || null,
    color: formData.color || '',
    doors: formData.doors || null,
    commission_sale: formData.commissionSale || false,
    public_sale_price: formData.publicSalePrice || null,
    commission_amount: formData.commissionAmount || null,
    commission_query: formData.commissionQuery || null,
    version: formData.version?.trim() || null,
  };
};

export const mapVehicleToFormData = (vehicle: Vehicle): VehicleFormData => {
  let registrationDate: Date | undefined;

  if (vehicle.registrationDate) {
    registrationDate = new Date(vehicle.registrationDate);
  }

  return {
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    price: vehicle.price || 0,
    currency: 'EUR',
    mileage: vehicle.mileage || 0,
    mileageUnit: 'km',
    units: 1,
    fuel: vehicle.fuel || '',
    transmission: vehicle.transmission || '',
    location: normalizeLocation(vehicle.location, vehicle.country),
    country: vehicle.country || '',
    countryCode: vehicle.countryCode || vehicle.country_code || 'es',
    ivaStatus: 'included',
    cocStatus: false,
    status: (vehicle.status as 'available' | 'reserved' | 'sold' | 'draft') || 'available',
    description: vehicle.description || '',
    version: vehicle.version || '',
    vin: vehicle.vin || '',
    licensePlate: vehicle.licensePlate || '',
    registrationDate,
    vehicleType: vehicle.vehicleType || '',
    transactionType: (vehicle.transactionType as 'national' | 'import' | 'export') || 'national',
    acceptsExchange: vehicle.acceptsExchange || false,
    engineSize: typeof vehicle.engineSize === 'string' ? parseFloat(vehicle.engineSize) || undefined : vehicle.engineSize || undefined,
    enginePower: vehicle.enginePower || undefined,
    color: vehicle.color || '',
    doors: vehicle.doors || undefined,
    euroStandard: undefined,
    co2Emissions: undefined,
    commissionSale: vehicle.commissionSale || false,
    publicSalePrice: vehicle.publicSalePrice || undefined,
    commissionAmount: vehicle.commissionAmount || undefined,
    commissionQuery: vehicle.commissionQuery || '',
    equipment: [],
    damages: [],
  };
};

export const mapDatabaseToFormData = (dbData: any): VehicleFormData => {
  let registrationDate: Date | undefined;

  if (dbData.registration_date) {
    registrationDate = new Date(dbData.registration_date);
  }

  return {
    brand: dbData.brand || '',
    model: dbData.model || '',
    year: dbData.year || new Date().getFullYear(),
    price: dbData.price || 0,
    currency: 'EUR',
    mileage: dbData.mileage || 0,
    mileageUnit: 'km',
    units: 1,
    fuel: dbData.fuel || '',
    transmission: dbData.transmission || '',
    location: normalizeLocation(dbData.location, dbData.country),
    country: dbData.country || '',
    countryCode: dbData.country_code || 'es',
    ivaStatus: 'included',
    cocStatus: false,
    status: (dbData.status as 'available' | 'reserved' | 'sold' | 'draft') || 'available',
    description: dbData.description || '',
    version: dbData.version || '',
    vin: dbData.vin || '',
    licensePlate: dbData.license_plate || '',
    registrationDate,
    vehicleType: dbData.vehicle_type || '',
    transactionType: (dbData.transaction_type as 'national' | 'import' | 'export') || 'national',
    acceptsExchange: dbData.accepts_exchange || false,
    engineSize: dbData.engine_size || undefined,
    enginePower: dbData.engine_power || undefined,
    color: dbData.color || '',
    doors: dbData.doors || undefined,
    euroStandard: undefined,
    co2Emissions: undefined,
    commissionSale: dbData.commission_sale || false,
    publicSalePrice: dbData.public_sale_price || undefined,
    commissionAmount: dbData.commission_amount || undefined,
    commissionQuery: dbData.commission_query || '',
    equipment: [],
    damages: [],
  };
};

export const mapMetadataToDatabase = (formData: VehicleFormData, vehicleId: string) => {
  return {
    vehicle_id: vehicleId,
    mileage_unit: formData.mileageUnit || 'km',
    units: formData.units || 1,
    iva_status: formData.ivaStatus || 'included',
    coc_status: formData.cocStatus || false,
    fuel_type: formData.fuel,
    transmission: formData.transmission,
  };
};

export const mapTechnicalSpecsToDatabase = (formData: VehicleFormData) => {
  const technicalSpecs: any = {};

  if (formData.euroStandard) {
    technicalSpecs.euro_standard = formData.euroStandard;
  }
  if (formData.co2Emissions) {
    technicalSpecs.co2_emissions = formData.co2Emissions;
  }

  return technicalSpecs;
};

export const validateFormData = (formData: VehicleFormData): boolean => {
  return !!(formData.brand && formData.model && formData.year);
};