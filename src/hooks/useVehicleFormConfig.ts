
import { z } from 'zod';
import { vehicleValidationSchema } from '@/utils/vehicleValidation';

// Schema para daños individuales
const damageSchema = z.object({
  id: z.string().optional(),
  damage_type: z.enum(['exterior', 'interior', 'mechanical']),
  title: z.string().min(1, 'Título es requerido'),
  description: z.string().optional(),
  severity: z.enum(['minor', 'moderate', 'severe']).default('minor'),
  location: z.string().optional(),
  estimated_cost: z.number().optional(),
  images: z.array(z.any()).optional() // FileList convertido a array
});

// Extender el schema principal para incluir daños
export const vehicleSchema = z.object({
  ...vehicleValidationSchema,
  damages: z.array(damageSchema).optional()
});

// Define default form values with proper types
export const defaultFormValues = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  currency: 'EUR',
  mileage: 0,
  mileageUnit: 'km' as 'km' | 'mi',
  units: 1,
  fuel: 'gasoline',
  transmission: 'manual',
  location: '',
  country: 'España',
  countryCode: 'es',
  ivaStatus: 'included' as 'included' | 'notIncluded' | 'deductible' | 'rebu',
  cocStatus: true,
  status: 'available' as 'available' | 'reserved' | 'sold',
  equipment: [] as string[],
  description: '',
  
  // New fields with default values
  vin: '',
  licensePlate: '',
  registrationDate: undefined as Date | undefined,
  vehicleType: '',
  transactionType: 'national' as 'national' | 'import' | 'export',
  acceptsExchange: false,
  engineSize: undefined as number | undefined,
  enginePower: undefined as number | undefined,
  color: '',
  doors: undefined as number | undefined,
  
  // New fields for emissions and commission sales
  euroStandard: undefined as 'euro1' | 'euro2' | 'euro3' | 'euro4' | 'euro5' | 'euro6' | 'euro6d' | 'euro7' | undefined,
  co2Emissions: undefined as number | undefined,
  commissionSale: false,
  publicSalePrice: undefined as number | undefined,
  commissionAmount: undefined as number | undefined,
  commissionQuery: '',
  
  // New damages field
  damages: [] as Array<{
    id?: string;
    damage_type: 'exterior' | 'interior' | 'mechanical';
    title: string;
    description?: string;
    severity: 'minor' | 'moderate' | 'severe';
    location?: string;
    estimated_cost?: number;
    images?: File[];
  }>
};

export type VehicleFormSchema = z.infer<typeof vehicleSchema>;
