import { z } from 'zod';

/**
 * Comprehensive vehicle validation schema with strict rules
 */
export const vehicleSchema = z.object({
  // Required fields
  make: z.string()
    .min(1, { message: 'validation.makeRequired' })
    .max(50, { message: 'validation.makeTooLong' })
    .trim(),
  
  model: z.string()
    .min(1, { message: 'validation.modelRequired' })
    .max(100, { message: 'validation.modelTooLong' })
    .trim(),
  
  year: z.number()
    .int({ message: 'validation.yearMustBeInteger' })
    .min(1900, { message: 'validation.yearTooOld' })
    .max(new Date().getFullYear() + 1, { message: 'validation.yearInFuture' }),
  
  price: z.number()
    .positive({ message: 'validation.priceMustBePositive' })
    .max(10000000, { message: 'validation.priceTooHigh' })
    .multipleOf(0.01, { message: 'validation.priceInvalidDecimals' }),
  
  // Optional fields with validation
  mileage: z.number()
    .int({ message: 'validation.mileageMustBeInteger' })
    .nonnegative({ message: 'validation.mileageMustBePositive' })
    .max(2000000, { message: 'validation.mileageTooHigh' })
    .optional(),
  
  vin: z.string()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, { message: 'validation.vinInvalidFormat' })
    .optional()
    .or(z.literal('')),
  
  license_plate: z.string()
    .max(20, { message: 'validation.licensePlateTooLong' })
    .optional()
    .or(z.literal('')),
  
  description: z.string()
    .max(5000, { message: 'validation.descriptionTooLong' })
    .optional()
    .or(z.literal('')),
  
  // Normalized fields (sent as text, will be normalized on backend)
  status: z.string().optional().or(z.literal('')),
  iva_status: z.string().optional().or(z.literal('')),
  fuel_type: z.string().optional().or(z.literal('')),
  transmission: z.string().optional().or(z.literal('')),
  body_type: z.string().optional().or(z.literal('')),
  color: z.string().optional().or(z.literal('')),
  interior_color: z.string().optional().or(z.literal('')),
  doors: z.string().optional().or(z.literal('')),
  seats: z.string().optional().or(z.literal('')),
  
  // Arrays
  images: z.array(z.string().url({ message: 'validation.invalidImageUrl' }))
    .max(25, { message: 'validation.tooManyImages' })
    .optional(),
  
  videos: z.array(z.string().url({ message: 'validation.invalidVideoUrl' }))
    .max(5, { message: 'validation.tooManyVideos' })
    .optional(),
  
  // Technical specifications
  engine_size: z.number()
    .positive({ message: 'validation.engineSizeMustBePositive' })
    .max(20, { message: 'validation.engineSizeTooLarge' })
    .optional(),
  
  power: z.number()
    .int({ message: 'validation.powerMustBeInteger' })
    .positive({ message: 'validation.powerMustBePositive' })
    .max(2000, { message: 'validation.powerTooHigh' })
    .optional(),
  
  co2_emissions: z.number()
    .nonnegative({ message: 'validation.co2MustBePositive' })
    .max(1000, { message: 'validation.co2TooHigh' })
    .optional(),
}).refine(
  (data) => {
    // Custom validation: If vin is provided, it must be exactly 17 characters
    if (data.vin && data.vin.length > 0 && data.vin.length !== 17) {
      return false;
    }
    return true;
  },
  {
    message: 'validation.vinMustBe17Characters',
    path: ['vin'],
  }
);

export type VehicleFormData = z.infer<typeof vehicleSchema>;

/**
 * Base schema without refinements for partial updates
 */
const vehicleBaseSchema = z.object({
  make: z.string().min(1).max(50).trim(),
  model: z.string().min(1).max(100).trim(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive().max(10000000).multipleOf(0.01),
  mileage: z.number().int().nonnegative().max(2000000).optional(),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/).optional().or(z.literal('')),
  license_plate: z.string().max(20).optional().or(z.literal('')),
  description: z.string().max(5000).optional().or(z.literal('')),
  status: z.string().optional().or(z.literal('')),
  iva_status: z.string().optional().or(z.literal('')),
  fuel_type: z.string().optional().or(z.literal('')),
  transmission: z.string().optional().or(z.literal('')),
  body_type: z.string().optional().or(z.literal('')),
  color: z.string().optional().or(z.literal('')),
  interior_color: z.string().optional().or(z.literal('')),
  doors: z.string().optional().or(z.literal('')),
  seats: z.string().optional().or(z.literal('')),
  images: z.array(z.string().url()).max(25).optional(),
  videos: z.array(z.string().url()).max(5).optional(),
  engine_size: z.number().positive().max(20).optional(),
  power: z.number().int().positive().max(2000).optional(),
  co2_emissions: z.number().nonnegative().max(1000).optional(),
});

/**
 * Partial schema for vehicle updates (all fields optional)
 */
export const vehicleUpdateSchema = vehicleBaseSchema.partial();

/**
 * Schema for quick vehicle search/filter
 */
export const vehicleSearchSchema = z.object({
  query: z.string().max(200).optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  minYear: z.number().int().min(1900).optional(),
  maxYear: z.number().int().max(new Date().getFullYear() + 1).optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
  maxMileage: z.number().nonnegative().optional(),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
}).refine(
  (data) => {
    // Ensure min values are less than max values
    if (data.minYear && data.maxYear && data.minYear > data.maxYear) {
      return false;
    }
    if (data.minPrice && data.maxPrice && data.minPrice > data.maxPrice) {
      return false;
    }
    return true;
  },
  {
    message: 'validation.minMaxInvalid',
  }
);

export type VehicleSearchData = z.infer<typeof vehicleSearchSchema>;
