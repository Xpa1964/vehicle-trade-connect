-- Additional missing tables

-- 1. Transport quote responses
CREATE TABLE IF NOT EXISTS public.transport_quote_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transport_quote_id UUID REFERENCES public.transport_quotes(id) ON DELETE CASCADE,
  transporter_id UUID NOT NULL,
  quote_amount DECIMAL(10,2),
  estimated_days INTEGER,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.transport_quote_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own responses" ON public.transport_quote_responses FOR SELECT USING (
  transporter_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.transport_quotes WHERE id = transport_quote_id AND requester_id = auth.uid()
  )
);
CREATE POLICY "Transporters can create responses" ON public.transport_quote_responses FOR INSERT WITH CHECK (transporter_id = auth.uid());

-- 2. Announcements (bulletin board)
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  images JSONB DEFAULT '[]',
  contact_info JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active announcements" ON public.announcements FOR SELECT USING (status = 'active' OR user_id = auth.uid());
CREATE POLICY "Users can manage own announcements" ON public.announcements FOR ALL USING (user_id = auth.uid());

-- 3. Partner API keys
CREATE TABLE IF NOT EXISTS public.partner_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  key_prefix TEXT,
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '[]',
  rate_limit INTEGER DEFAULT 1000,
  request_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.partner_api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own partner keys" ON public.partner_api_keys FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own partner keys" ON public.partner_api_keys FOR ALL USING (user_id = auth.uid());

-- 4. Auctions table
CREATE TABLE IF NOT EXISTS public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL,
  title TEXT,
  starting_price DECIMAL(12,2),
  current_price DECIMAL(12,2),
  reserve_price DECIMAL(12,2),
  buy_now_price DECIMAL(12,2),
  bid_increment DECIMAL(10,2) DEFAULT 100,
  status TEXT DEFAULT 'draft',
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  winner_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active auctions" ON public.auctions FOR SELECT USING (status IN ('active', 'ended') OR seller_id = auth.uid());
CREATE POLICY "Sellers can manage own auctions" ON public.auctions FOR ALL USING (seller_id = auth.uid());

-- 5. Bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  is_winning BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view bids on auctions they participate in" ON public.bids FOR SELECT USING (
  bidder_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.auctions WHERE id = auction_id AND (seller_id = auth.uid() OR status = 'active')
  )
);
CREATE POLICY "Users can create bids" ON public.bids FOR INSERT WITH CHECK (bidder_id = auth.uid());

-- 6. Saved searches
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT,
  filters JSONB DEFAULT '{}',
  notify BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own searches" ON public.saved_searches FOR ALL USING (user_id = auth.uid());

-- 7. Add severity to activity_logs
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'info';

-- 8. User notification preferences
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  notification_types JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON public.user_notification_preferences FOR ALL USING (user_id = auth.uid());

-- 9. Vehicle views/analytics
CREATE TABLE IF NOT EXISTS public.vehicle_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  viewer_id UUID,
  view_source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicle_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vehicle owners can view analytics" ON public.vehicle_views FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.vehicles WHERE id = vehicle_id AND seller_id = auth.uid())
);
CREATE POLICY "Anyone can log views" ON public.vehicle_views FOR INSERT WITH CHECK (true);