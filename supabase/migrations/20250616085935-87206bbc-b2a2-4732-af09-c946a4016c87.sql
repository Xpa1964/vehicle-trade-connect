
-- Crear tabla para almacenar daños de vehículos
CREATE TABLE public.vehicle_damages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  damage_type TEXT NOT NULL CHECK (damage_type IN ('exterior', 'interior', 'mechanical')),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'minor' CHECK (severity IN ('minor', 'moderate', 'severe')),
  location TEXT,
  estimated_cost NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para imágenes de daños
CREATE TABLE public.vehicle_damage_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  damage_id UUID NOT NULL REFERENCES public.vehicle_damages(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.vehicle_damages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_damage_images ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para vehicle_damages
CREATE POLICY "Users can view damages of their vehicles" 
  ON public.vehicle_damages 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.vehicles v 
    WHERE v.id = vehicle_id AND v.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert damages for their vehicles" 
  ON public.vehicle_damages 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.vehicles v 
    WHERE v.id = vehicle_id AND v.user_id = auth.uid()
  ));

CREATE POLICY "Users can update damages of their vehicles" 
  ON public.vehicle_damages 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.vehicles v 
    WHERE v.id = vehicle_id AND v.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete damages of their vehicles" 
  ON public.vehicle_damages 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.vehicles v 
    WHERE v.id = vehicle_id AND v.user_id = auth.uid()
  ));

-- Políticas RLS para vehicle_damage_images
CREATE POLICY "Users can view damage images of their vehicles" 
  ON public.vehicle_damage_images 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.vehicle_damages vd 
    JOIN public.vehicles v ON v.id = vd.vehicle_id 
    WHERE vd.id = damage_id AND v.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert damage images for their vehicles" 
  ON public.vehicle_damage_images 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.vehicle_damages vd 
    JOIN public.vehicles v ON v.id = vd.vehicle_id 
    WHERE vd.id = damage_id AND v.user_id = auth.uid()
  ));

CREATE POLICY "Users can update damage images of their vehicles" 
  ON public.vehicle_damage_images 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.vehicle_damages vd 
    JOIN public.vehicles v ON v.id = vd.vehicle_id 
    WHERE vd.id = damage_id AND v.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete damage images of their vehicles" 
  ON public.vehicle_damage_images 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.vehicle_damages vd 
    JOIN public.vehicles v ON v.id = vd.vehicle_id 
    WHERE vd.id = damage_id AND v.user_id = auth.uid()
  ));

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_vehicle_damages_vehicle_id ON public.vehicle_damages(vehicle_id);
CREATE INDEX idx_vehicle_damages_type ON public.vehicle_damages(damage_type);
CREATE INDEX idx_vehicle_damage_images_damage_id ON public.vehicle_damage_images(damage_id);
