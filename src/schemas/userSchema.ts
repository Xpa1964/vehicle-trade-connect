import { z } from 'zod';

/**
 * User profile validation schema
 */
export const userProfileSchema = z.object({
  display_name: z.string()
    .min(2, { message: 'validation.displayNameTooShort' })
    .max(50, { message: 'validation.displayNameTooLong' })
    .regex(/^[a-zA-Z0-9\s\-_]+$/, { message: 'validation.displayNameInvalidChars' })
    .trim(),
  
  company_name: z.string()
    .max(100, { message: 'validation.companyNameTooLong' })
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .regex(/^\+?[0-9\s\-()]{8,20}$/, { message: 'validation.phoneInvalidFormat' })
    .optional()
    .or(z.literal('')),
  
  country: z.string()
    .min(2, { message: 'validation.countryRequired' })
    .max(2, { message: 'validation.countryInvalidFormat' })
    .optional(),
  
  city: z.string()
    .max(100, { message: 'validation.cityTooLong' })
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(200, { message: 'validation.addressTooLong' })
    .optional()
    .or(z.literal('')),
  
  postal_code: z.string()
    .max(20, { message: 'validation.postalCodeTooLong' })
    .optional()
    .or(z.literal('')),
  
  bio: z.string()
    .max(500, { message: 'validation.bioTooLong' })
    .optional()
    .or(z.literal('')),
  
  website: z.string()
    .url({ message: 'validation.websiteInvalidUrl' })
    .optional()
    .or(z.literal('')),
  
  tax_id: z.string()
    .max(50, { message: 'validation.taxIdTooLong' })
    .optional()
    .or(z.literal('')),
});

export type UserProfileData = z.infer<typeof userProfileSchema>;

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, { message: 'validation.nameTooShort' })
    .max(100, { message: 'validation.nameTooLong' })
    .trim(),
  
  email: z.string()
    .email({ message: 'validation.emailInvalid' })
    .max(255, { message: 'validation.emailTooLong' })
    .trim()
    .toLowerCase(),
  
  subject: z.string()
    .min(5, { message: 'validation.subjectTooShort' })
    .max(200, { message: 'validation.subjectTooLong' })
    .trim(),
  
  message: z.string()
    .min(20, { message: 'validation.messageTooShort' })
    .max(1000, { message: 'validation.messageTooLong' })
    .trim(),
  
  phone: z.string()
    .regex(/^\+?[0-9\s\-()]{8,20}$/, { message: 'validation.phoneInvalidFormat' })
    .optional()
    .or(z.literal('')),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Auth schemas
 */
export const loginSchema = z.object({
  email: z.string()
    .email({ message: 'validation.emailInvalid' })
    .trim()
    .toLowerCase(),
  
  password: z.string()
    .min(6, { message: 'validation.passwordTooShort' }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string()
    .email({ message: 'validation.emailInvalid' })
    .trim()
    .toLowerCase(),
  
  password: z.string()
    .min(8, { message: 'validation.passwordTooShort' })
    .regex(/[A-Z]/, { message: 'validation.passwordNeedsUppercase' })
    .regex(/[a-z]/, { message: 'validation.passwordNeedsLowercase' })
    .regex(/[0-9]/, { message: 'validation.passwordNeedsNumber' }),
  
  confirmPassword: z.string(),
  
  display_name: z.string()
    .min(2, { message: 'validation.displayNameTooShort' })
    .max(50, { message: 'validation.displayNameTooLong' })
    .trim(),
  
  terms: z.boolean()
    .refine((val) => val === true, {
      message: 'validation.mustAcceptTerms',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwordsDontMatch',
  path: ['confirmPassword'],
});

export type RegisterData = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: 'validation.passwordTooShort' })
    .regex(/[A-Z]/, { message: 'validation.passwordNeedsUppercase' })
    .regex(/[a-z]/, { message: 'validation.passwordNeedsLowercase' })
    .regex(/[0-9]/, { message: 'validation.passwordNeedsNumber' }),
  
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwordsDontMatch',
  path: ['confirmPassword'],
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
