-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'España',
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS trader_type TEXT;

-- Add missing columns to api_keys table  
ALTER TABLE public.api_keys
ADD COLUMN IF NOT EXISTS api_key TEXT,
ADD COLUMN IF NOT EXISTS request_count INTEGER DEFAULT 0;

-- Add action column to api_request_logs
ALTER TABLE public.api_request_logs 
ALTER COLUMN action TYPE TEXT;