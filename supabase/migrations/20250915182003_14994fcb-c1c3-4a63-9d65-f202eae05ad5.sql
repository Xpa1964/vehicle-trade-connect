-- Fix critical security vulnerability in vehicle_information table
-- Remove the overly permissive policy that allows public access to all vehicle information

-- Drop the dangerous public policy
DROP POLICY "Users can view vehicle information" ON public.vehicle_information;

-- The existing restrictive policies are good and should remain:
-- 1. "Vehicle owners can manage their vehicle information" - allows full access to vehicle owners
-- 2. "Vehicle owners can view their vehicle information" - allows viewing to vehicle owners  
-- 3. "Users can view vehicle info for vehicles they're involved with" - allows viewing for users in conversations/auctions

-- No additional policies needed as the existing ones properly restrict access to:
-- - Vehicle owners (full access)
-- - Users involved in conversations about the vehicle
-- - Users involved in auctions for the vehicle
-- - Admins (through existing admin policies)