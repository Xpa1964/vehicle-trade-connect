
import { z } from "zod";

export const formSchema = z.object({
  // Vehicle information
  brand: z.string().min(1, { message: "Brand is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  version: z.string().optional(),
  licensePlate: z.string()
    .min(1, { message: "License plate is required" })
    .max(50, { message: "License plate is too long" }),
  chassisNumber: z.string().min(1, { message: "Chassis number is required" }),
  
  // Transport details - Origin
  originAddress: z.string().min(1, { message: "Origin address is required" }),
  originCity: z.string().min(1, { message: "Origin city is required" }),
  originCountry: z.string().min(1, { message: "Origin country is required" }),
  
  // Transport details - Destination
  destinationAddress: z.string().min(1, { message: "Destination address is required" }),
  destinationCity: z.string().min(1, { message: "Destination city is required" }),
  destinationCountry: z.string().min(1, { message: "Destination country is required" }),
  
  // Contact information - Origin
  originContact: z.string().min(1, { message: "Origin contact person is required" }),
  originEmail: z.string().email({ message: "Invalid email address" }),
  originPhone: z.string().min(1, { message: "Origin phone is required" }),
  
  // Contact information - Destination
  destinationContact: z.string().min(1, { message: "Destination contact person is required" }),
  destinationEmail: z.string().email({ message: "Invalid email address" }),
  destinationPhone: z.string().min(1, { message: "Destination phone is required" }),
  
  date: z.date({ required_error: "Please select a date" }),
});

export type FormValues = z.infer<typeof formSchema>;
