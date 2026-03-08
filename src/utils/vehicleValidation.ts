
import { z } from 'zod';
import { getCurrentYear } from './dateUtils';

// Generic validation messages
const REQUIRED_MESSAGE = 'This field is required';
const POSITIVE_NUMBER = 'Must be a positive number';
const NONNEGATIVE_NUMBER = 'Must be zero or greater';

// Vehicle validation schema
export const vehicleValidationSchema = {
  brand: z.string().min(1, REQUIRED_MESSAGE),
  model: z.string().min(1, REQUIRED_MESSAGE),
  year: z.coerce
    .number()
    .min(1900, 'Year must be 1900 or later')
    .max(getCurrentYear() + 1, 'Year cannot be in the future'),
  price: z.coerce.number().positive(POSITIVE_NUMBER),
  currency: z.string().default('EUR'),
  mileage: z.coerce.number().nonnegative(NONNEGATIVE_NUMBER),
  mileageUnit: z.enum(['km', 'mi']).default('km'),
  units: z.coerce.number().int().nonnegative(NONNEGATIVE_NUMBER),
  fuel: z.string().min(1, REQUIRED_MESSAGE),
  transmission: z.string().min(1, REQUIRED_MESSAGE),
  location: z.string().min(1, REQUIRED_MESSAGE),
  country: z.string().min(1, REQUIRED_MESSAGE),
  countryCode: z.string().min(1, REQUIRED_MESSAGE),
  ivaStatus: z.enum(['included', 'notIncluded', 'deductible', 'rebu']),
  cocStatus: z.boolean(),
  status: z.enum(['available', 'reserved', 'sold', 'draft']).default('available'),
  images: z.any().optional(),
  additionalFiles: z.any().optional(),
  equipment: z.array(z.string()).default([]),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  vin: z.string()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
      message: 'El VIN debe tener exactamente 17 caracteres y no puede contener las letras I, O ni Q.'
    })
    .optional()
    .or(z.literal('')),
  licensePlate: z.string().max(20).optional().or(z.literal('')),
  registrationDate: z.string().optional().or(z.literal('')),
  vehicleType: z.string().optional().or(z.literal('')),
  transactionType: z.string().optional().or(z.literal('')),
  acceptsExchange: z.boolean().optional(),
  engineSize: z.coerce.number().optional(),
  enginePower: z.coerce.number().optional(),
  color: z.string().optional().or(z.literal('')),
  doors: z.coerce.number().optional(),
};
