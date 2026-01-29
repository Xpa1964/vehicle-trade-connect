
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency?: string;
  mileage: number;
  mileageUnit?: 'km' | 'mi';
  units?: number;
  fuel: string;
  transmission: string;
  location: string;
  country: string;
  countryCode: string;
  country_code?: string; // Added for compatibility with DB
  thumbnailUrl?: string;
  thumbnailurl?: string; // Added for compatibility with DB
  gallery?: string | null;
  ivaStatus?: 'included' | 'notIncluded' | 'deductible' | 'rebu';
  cocStatus?: boolean;
  status?: 'available' | 'reserved' | 'sold' | 'in_auction' | string;
  userId?: string;
  user_id?: string;
  additionalFilesUrls?: string[];
  created_at?: string;
  updated_at?: string;
  type?: string;
  condition?: string;
  description?: string;
  
  // New fields
  vin?: string;
  licensePlate?: string;
  registrationDate?: Date;
  vehicleType?: string;
  transactionType?: 'national' | 'import' | 'export';
  acceptsExchange?: boolean;
  accepts_exchange?: boolean; // Added for DB compatibility
  engineSize?: number | string;
  enginePower?: number;
  color?: string;
  doors?: number;
  
  // New fields for emissions and commission sales
  euroStandard?: 'euro1' | 'euro2' | 'euro3' | 'euro4' | 'euro5' | 'euro6' | 'euro6d' | 'euro7';
  co2Emissions?: number; // CO2 emissions according to seller
  commissionSale?: boolean; // Venta comisionada
  publicSalePrice?: number; // Precio de venta público
  commissionAmount?: number; // Comisión
  commissionQuery?: string; // Campo consultar
  
  // Add vehicle_images property to match database structure
  vehicle_images?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
}

export interface VehicleDamage {
  id?: string;
  damage_type: 'exterior' | 'interior' | 'mechanical';
  title: string;
  description?: string;
  severity: 'minor' | 'moderate' | 'severe';
  location?: string;
  estimated_cost?: number;
  images?: File[];
}

export interface VehicleFormData {
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  mileageUnit: 'km' | 'mi';
  units: number;
  fuel: string;
  transmission: string;
  location: string;
  country: string;
  countryCode: string;
  ivaStatus: 'included' | 'notIncluded' | 'deductible' | 'rebu';
  cocStatus: boolean;
  status: 'available' | 'reserved' | 'sold';
  images?: FileList;
  additionalFiles?: FileList;
  equipment?: string[];
  description?: string;
  
  // New fields
  vin?: string;
  licensePlate?: string;
  registrationDate?: Date;
  vehicleType?: string;
  transactionType?: 'national' | 'import' | 'export';
  acceptsExchange?: boolean;
  engineSize?: number;
  enginePower?: number;
  color?: string;
  doors?: number;
  
  // New fields for emissions and commission sales
  euroStandard?: 'euro1' | 'euro2' | 'euro3' | 'euro4' | 'euro5' | 'euro6' | 'euro6d' | 'euro7';
  co2Emissions?: number; // CO2 emissions according to seller
  commissionSale?: boolean; // Venta comisionada
  publicSalePrice?: number; // Precio de venta público
  commissionAmount?: number; // Comisión
  commissionQuery?: string; // Campo consultar
  
  // Damages field
  damages?: VehicleDamage[];
}
