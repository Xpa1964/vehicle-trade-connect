import { VehicleFormData, Vehicle } from '@/types/vehicle';

export const mapFormDataToVehicle = (formData: VehicleFormData) => {
  
  
  // Handle registration date properly - check if it's a Date object or string
  let registrationDateString = null;
  if (formData.registrationDate) {
    if (formData.registrationDate instanceof Date) {
      registrationDateString = formData.registrationDate.toISOString().split('T')[0];
    } else if (typeof formData.registrationDate === 'string') {
      registrationDateString = formData.registrationDate;
    }
  }
  
  // Only map fields that belong to the vehicles table (using snake_case for database)
  const mappedData = {
    brand: formData.brand,
    model: formData.model,
    year: formData.year,
    price: formData.price,
    mileage: formData.mileage,
    fuel: formData.fuel,
    transmission: formData.transmission,
    location: formData.location,
    country: formData.country,
    country_code: formData.countryCode,
    status: formData.status,
    description: formData.description || '',
    
    // Campos de identificación que SÍ están en vehicles (usando snake_case)
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
    
    // Campos de venta comisionada que SÍ están en vehicles (usando snake_case)
    commission_sale: formData.commissionSale || false,
    public_sale_price: formData.publicSalePrice || null,
    commission_amount: formData.commissionAmount || null,
    commission_query: formData.commissionQuery || null,
  };
  
  return mappedData;
};

export const mapVehicleToFormData = (vehicle: Vehicle): VehicleFormData => {
  
  
  // Handle registration date - use camelCase properties from Vehicle interface
  let registrationDate: Date | undefined;
  if (vehicle.registrationDate) {
    registrationDate = new Date(vehicle.registrationDate);
  }
  
  const formData: VehicleFormData = {
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    price: vehicle.price || 0,
    currency: 'EUR', // Default currency
    mileage: vehicle.mileage || 0,
    mileageUnit: 'km', // Default mileage unit
    units: 1, // Default units
    fuel: vehicle.fuel || '',
    transmission: vehicle.transmission || '',
    location: vehicle.location || '',
    country: vehicle.country || '',
    countryCode: vehicle.countryCode || vehicle.country_code || 'es',
    ivaStatus: 'included', // Default IVA status
    cocStatus: false, // Default COC status
    status: (vehicle.status as 'available' | 'reserved' | 'sold') || 'available',
    description: vehicle.description || '',
    
    // Campos de identificación - using camelCase properties
    vin: vehicle.vin || '',
    licensePlate: vehicle.licensePlate || '',
    registrationDate: registrationDate,
    vehicleType: vehicle.vehicleType || '',
    transactionType: (vehicle.transactionType as 'national' | 'import' | 'export') || 'national',
    acceptsExchange: vehicle.acceptsExchange || false,
    engineSize: typeof vehicle.engineSize === 'string' ? parseFloat(vehicle.engineSize) || undefined : vehicle.engineSize || undefined,
    enginePower: vehicle.enginePower || undefined,
    color: vehicle.color || '',
    doors: vehicle.doors || undefined,
    
    // Campos de emisiones y venta comisionada - using camelCase properties
    euroStandard: undefined, // Will be loaded from vehicle_information
    co2Emissions: undefined, // Will be loaded from vehicle_information
    commissionSale: vehicle.commissionSale || false,
    publicSalePrice: vehicle.publicSalePrice || undefined,
    commissionAmount: vehicle.commissionAmount || undefined,
    commissionQuery: vehicle.commissionQuery || '',
    
    // Campos adicionales del formulario
    equipment: [],
    damages: []
  };
  
  return formData;
};

// Función específica para mapear datos de la base de datos (snake_case) a formulario (camelCase)
export const mapDatabaseToFormData = (dbData: any): VehicleFormData => {
  console.log('🔧 [vehicleDataMapper] Mapping database data to form data:', dbData);
  
  // Handle registration date
  let registrationDate: Date | undefined;
  if (dbData.registration_date) {
    registrationDate = new Date(dbData.registration_date);
  }
  
  const formData: VehicleFormData = {
    brand: dbData.brand || '',
    model: dbData.model || '',
    year: dbData.year || new Date().getFullYear(),
    price: dbData.price || 0,
    currency: 'EUR', // Will be set from metadata
    mileage: dbData.mileage || 0,
    mileageUnit: 'km', // Will be set from metadata
    units: 1, // Will be set from metadata
    fuel: dbData.fuel || '',
    transmission: dbData.transmission || '',
    location: dbData.location || '',
    country: dbData.country || '',
    countryCode: dbData.country_code || 'es',
    ivaStatus: 'included', // Will be set from metadata
    cocStatus: false, // Will be set from metadata
    status: (dbData.status as 'available' | 'reserved' | 'sold') || 'available',
    description: dbData.description || '',
    
    // Campos de identificación - mapping from snake_case to camelCase
    vin: dbData.vin || '',
    licensePlate: dbData.license_plate || '',
    registrationDate: registrationDate,
    vehicleType: dbData.vehicle_type || '',
    transactionType: (dbData.transaction_type as 'national' | 'import' | 'export') || 'national',
    acceptsExchange: dbData.accepts_exchange || false,
    engineSize: dbData.engine_size || undefined,
    enginePower: dbData.engine_power || undefined,
    color: dbData.color || '',
    doors: dbData.doors || undefined,
    
    // Campos de emisiones y venta comisionada - mapping from snake_case to camelCase
    euroStandard: undefined, // Will be loaded separately from vehicle_information
    co2Emissions: undefined, // Will be loaded separately from vehicle_information
    commissionSale: dbData.commission_sale || false,
    publicSalePrice: dbData.public_sale_price || undefined,
    commissionAmount: dbData.commission_amount || undefined,
    commissionQuery: dbData.commission_query || '',
    
    // Campos adicionales del formulario
    equipment: [],
    damages: []
  };
  
  return formData;
};

// Función para mapear metadata a la base de datos
export const mapMetadataToDatabase = (formData: VehicleFormData, vehicleId: string) => {
  return {
    vehicle_id: vehicleId,
    mileage_unit: formData.mileageUnit || 'km',
    units: formData.units || 1,
    iva_status: formData.ivaStatus || 'included',
    coc_status: formData.cocStatus || false,
    fuel_type: formData.fuel,
    transmission: formData.transmission
  };
};

// Función para mapear información técnica a la base de datos
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

// Función simple de validación
export const validateFormData = (formData: VehicleFormData): boolean => {
  return !!(formData.brand && formData.model && formData.year);
};
