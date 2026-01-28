
import * as z from 'zod';

export const registerSchema = z.object({
  // Company information
  companyName: z.string().min(3, { message: 'Company name must be at least 3 characters' }),
  companyLogo: z.any().optional(),
  city: z.string().min(2, { message: 'City name is required' }),
  country: z.string().min(2, { message: 'Country name is required' }),
  postalCode: z.string().min(1, { message: 'Postal code is required' }),
  managerName: z.string().min(3, { message: 'Manager name is required' }),
  
  // Contact information
  contactPerson: z.string().min(3, { message: 'Contact person name is required' }),
  phone: z.string().min(6, { message: 'Valid phone number is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Password confirmation is required' }),
  
  // Business details
  businessType: z.string().min(1, { message: 'Business type is required' }),
  traderType: z.string().min(1, { message: 'Trader type is required' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  
  // Documentation - make it optional to not block form submission
  documents: z.any().optional(),
  
  // Terms
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
