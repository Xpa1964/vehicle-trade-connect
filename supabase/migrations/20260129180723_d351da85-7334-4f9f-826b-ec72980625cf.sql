-- =============================================
-- COMPLETE SCHEMA FOR KONTACT VO
-- =============================================

-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM (
  'admin',
  'dealer', 
  'professional',
  'individual',
  'user',
  'fleet_manager',
  'transporter',
  'workshop'
);

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT,
  company_name TEXT,
  contact_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  tax_id TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 4. Registration requests
CREATE TABLE public.registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email TEXT NOT NULL,
  company_name TEXT,
  contact_name TEXT,
  phone TEXT,
  requested_role public.app_role DEFAULT 'dealer',
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create registration request" ON public.registration_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all requests" ON public.registration_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update requests" ON public.registration_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 5. Activity logs
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view logs" ON public.activity_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- 6. Vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT,
  year INTEGER,
  price DECIMAL(12,2),
  mileage INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  color TEXT,
  doors INTEGER,
  power_hp INTEGER,
  description TEXT,
  status TEXT DEFAULT 'available',
  images JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  location TEXT,
  vin TEXT,
  license_plate TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view available vehicles" ON public.vehicles FOR SELECT USING (status = 'available' OR seller_id = auth.uid());
CREATE POLICY "Sellers can manage own vehicles" ON public.vehicles FOR ALL USING (seller_id = auth.uid());

-- 7. Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id),
  status TEXT DEFAULT 'active',
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view conversations" ON public.conversations FOR SELECT USING (seller_id = auth.uid() OR buyer_id = auth.uid());
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- 8. Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (seller_id = auth.uid() OR buyer_id = auth.uid()))
);
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- 9. Vehicle report requests
CREATE TABLE public.vehicle_report_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id),
  license_plate TEXT,
  vin TEXT,
  report_type TEXT DEFAULT 'basic',
  status TEXT DEFAULT 'pending',
  budget_amount DECIMAL(10,2),
  budget_breakdown JSONB,
  budget_notes TEXT,
  budget_sent_at TIMESTAMPTZ,
  estimated_delivery_date TEXT,
  report_url TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicle_report_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own requests" ON public.vehicle_report_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create requests" ON public.vehicle_report_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage requests" ON public.vehicle_report_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 10. User notifications
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.user_notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.user_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.user_notifications FOR UPDATE USING (user_id = auth.uid());

-- 11. API Keys
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  permissions JSONB DEFAULT '[]',
  rate_limit INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own keys" ON public.api_keys FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own keys" ON public.api_keys FOR ALL USING (user_id = auth.uid());

-- 12. API request logs
CREATE TABLE public.api_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES public.api_keys(id),
  action TEXT,
  endpoint TEXT,
  method TEXT,
  status_code INTEGER,
  response_time_ms INTEGER,
  error_message TEXT,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  vehicle_count INTEGER DEFAULT 0,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.api_request_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Key owners can view logs" ON public.api_request_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.api_keys WHERE id = api_key_id AND user_id = auth.uid())
);

-- 13. API key requests
CREATE TABLE public.api_key_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT,
  purpose TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.api_key_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own requests" ON public.api_key_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create requests" ON public.api_key_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage requests" ON public.api_key_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 14. Favorites
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, vehicle_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (user_id = auth.uid());

-- 15. Transport quotes
CREATE TABLE public.transport_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL,
  transporter_id UUID,
  vehicle_id UUID REFERENCES public.vehicles(id),
  origin TEXT,
  destination TEXT,
  distance_km INTEGER,
  quote_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  notes TEXT,
  response_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.transport_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own quotes" ON public.transport_quotes FOR SELECT USING (requester_id = auth.uid() OR transporter_id = auth.uid());
CREATE POLICY "Users can create quotes" ON public.transport_quotes FOR INSERT WITH CHECK (requester_id = auth.uid());

-- 16. Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();