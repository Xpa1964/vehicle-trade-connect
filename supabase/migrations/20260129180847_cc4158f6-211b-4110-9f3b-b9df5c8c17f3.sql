-- Final batch of missing tables

-- 1. Vehicle images
CREATE TABLE IF NOT EXISTS public.vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view vehicle images" ON public.vehicle_images FOR SELECT USING (true);
CREATE POLICY "Vehicle owners can manage images" ON public.vehicle_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.vehicles WHERE id = vehicle_id AND seller_id = auth.uid())
);

-- 2. Exchanges table
CREATE TABLE IF NOT EXISTS public.exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_id UUID NOT NULL,
  receiver_id UUID,
  offered_vehicle_id UUID REFERENCES public.vehicles(id),
  requested_vehicle_id UUID REFERENCES public.vehicles(id),
  status TEXT DEFAULT 'pending',
  message TEXT,
  cash_difference DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.exchanges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own exchanges" ON public.exchanges FOR SELECT USING (initiator_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can create exchanges" ON public.exchanges FOR INSERT WITH CHECK (initiator_id = auth.uid());
CREATE POLICY "Users can update own exchanges" ON public.exchanges FOR UPDATE USING (initiator_id = auth.uid() OR receiver_id = auth.uid());

-- 3. Add missing columns to vehicles
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'España',
ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'ES',
ADD COLUMN IF NOT EXISTS thumbnailurl TEXT,
ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'used',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EUR',
ADD COLUMN IF NOT EXISTS plate_country TEXT,
ADD COLUMN IF NOT EXISTS seller_country TEXT,
ADD COLUMN IF NOT EXISTS seller_city TEXT,
ADD COLUMN IF NOT EXISTS body_type TEXT,
ADD COLUMN IF NOT EXISTS engine_size TEXT,
ADD COLUMN IF NOT EXISTS co2_emissions INTEGER,
ADD COLUMN IF NOT EXISTS warranty_months INTEGER,
ADD COLUMN IF NOT EXISTS previous_owners INTEGER,
ADD COLUMN IF NOT EXISTS service_history BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- 4. Workshop services
CREATE TABLE IF NOT EXISTS public.workshop_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration_hours DECIMAL(4,2),
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.workshop_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active services" ON public.workshop_services FOR SELECT USING (is_active = true);
CREATE POLICY "Workshops can manage own services" ON public.workshop_services FOR ALL USING (workshop_id = auth.uid());

-- 5. Workshop bookings
CREATE TABLE IF NOT EXISTS public.workshop_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  service_id UUID REFERENCES public.workshop_services(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  scheduled_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  total_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.workshop_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.workshop_bookings FOR SELECT USING (customer_id = auth.uid() OR workshop_id = auth.uid());
CREATE POLICY "Customers can create bookings" ON public.workshop_bookings FOR INSERT WITH CHECK (customer_id = auth.uid());

-- 6. Transporter services
CREATE TABLE IF NOT EXISTS public.transporter_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transporter_id UUID NOT NULL,
  service_type TEXT,
  coverage_area JSONB DEFAULT '[]',
  base_price DECIMAL(10,2),
  price_per_km DECIMAL(6,2),
  max_vehicle_weight INTEGER,
  vehicle_types JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.transporter_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active transporter services" ON public.transporter_services FOR SELECT USING (is_active = true);
CREATE POLICY "Transporters can manage own services" ON public.transporter_services FOR ALL USING (transporter_id = auth.uid());

-- 7. Inspection requests
CREATE TABLE IF NOT EXISTS public.inspection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id),
  inspector_id UUID,
  inspection_type TEXT DEFAULT 'basic',
  status TEXT DEFAULT 'pending',
  scheduled_date TIMESTAMPTZ,
  report_url TEXT,
  notes TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.inspection_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own inspections" ON public.inspection_requests FOR SELECT USING (requester_id = auth.uid() OR inspector_id = auth.uid());
CREATE POLICY "Users can create inspection requests" ON public.inspection_requests FOR INSERT WITH CHECK (requester_id = auth.uid());

-- 8. Static images storage
CREATE TABLE IF NOT EXISTS public.static_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_key TEXT UNIQUE NOT NULL,
  image_url TEXT,
  storage_path TEXT,
  category TEXT,
  purpose TEXT,
  ai_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.static_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view static images" ON public.static_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage static images" ON public.static_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 9. Fleet vehicles
CREATE TABLE IF NOT EXISTS public.fleet_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fleet_manager_id UUID NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id),
  driver_id UUID,
  status TEXT DEFAULT 'available',
  current_location TEXT,
  next_service_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Fleet managers can manage own vehicles" ON public.fleet_vehicles FOR ALL USING (fleet_manager_id = auth.uid());

-- 10. Contact messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID,
  recipient_id UUID,
  subject TEXT,
  content TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own contact messages" ON public.contact_messages FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Anyone can send contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);