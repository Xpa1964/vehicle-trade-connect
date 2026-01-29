-- Add missing columns to vehicles table for commission sale functionality
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS commission_sale boolean DEFAULT false;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS public_sale_price numeric;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS commission_amount numeric;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS commission_query text;

-- Change engine_size to text type if it's not already (to match code expectations)
ALTER TABLE public.vehicles ALTER COLUMN engine_size TYPE text USING engine_size::text;

-- Add seller_id to vehicles if missing (required by bulk upload)
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS seller_id uuid;

-- Create vehicle_damage_images table if not exists
CREATE TABLE IF NOT EXISTS public.vehicle_damage_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  damage_id uuid REFERENCES public.vehicle_damages(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on vehicle_damage_images
ALTER TABLE public.vehicle_damage_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for vehicle_damage_images
DROP POLICY IF EXISTS "Anyone can view damage images" ON public.vehicle_damage_images;
CREATE POLICY "Anyone can view damage images" ON public.vehicle_damage_images
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated can insert damage images" ON public.vehicle_damage_images;
CREATE POLICY "Authenticated can insert damage images" ON public.vehicle_damage_images
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Add file_size and file_url to vehicle_documents if missing
ALTER TABLE public.vehicle_documents ADD COLUMN IF NOT EXISTS file_size integer;
ALTER TABLE public.vehicle_documents ADD COLUMN IF NOT EXISTS file_url text;

-- Add is_active column to performance_alerts if missing
ALTER TABLE public.performance_alerts ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add conversation_id to exchanges table if missing
ALTER TABLE public.exchanges ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.conversations(id);

-- Update create_system_notification function to accept the correct parameters
CREATE OR REPLACE FUNCTION public.create_system_notification(
  p_user_id uuid, 
  p_title text, 
  p_message text DEFAULT NULL, 
  p_type text DEFAULT 'info', 
  p_link text DEFAULT NULL, 
  p_subject text DEFAULT NULL,
  p_content text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.user_notifications (user_id, title, message, type, link, subject, content)
  VALUES (p_user_id, COALESCE(p_subject, p_title), COALESCE(p_content, p_message), p_type, p_link, p_subject, p_content)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Update validate_profile_data_transfer to only require p_user_id
CREATE OR REPLACE FUNCTION public.validate_profile_data_transfer(p_user_id uuid, p_registration_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN jsonb_build_object('valid', true, 'success', true, 'user_id', p_user_id, 'registration_id', p_registration_id);
END;
$$;