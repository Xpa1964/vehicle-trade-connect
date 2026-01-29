-- Final batch of missing tables and columns

-- 1. API sync logs
CREATE TABLE IF NOT EXISTS public.api_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
  action TEXT,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  vehicle_count INTEGER DEFAULT 0,
  details JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.api_sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Key owners can view sync logs" ON public.api_sync_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.api_keys WHERE id = api_key_id AND user_id = auth.uid())
);

-- 2. Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'pending',
  reference TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (user_id = auth.uid());

-- 3. Ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID NOT NULL,
  rated_id UUID NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON public.ratings FOR INSERT WITH CHECK (rater_id = auth.uid());

-- 4. Translation cache
CREATE TABLE IF NOT EXISTS public.translation_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text TEXT NOT NULL,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.translation_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read translation cache" ON public.translation_cache FOR SELECT USING (true);
CREATE POLICY "System can insert translations" ON public.translation_cache FOR INSERT WITH CHECK (true);

-- 5. Add missing columns to conversations
ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS is_admin_conversation BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_sender_name TEXT,
ADD COLUMN IF NOT EXISTS source_type TEXT,
ADD COLUMN IF NOT EXISTS source_title TEXT;

-- 6. Add missing columns to user_notifications
ALTER TABLE public.user_notifications
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- 7. Add missing columns to messages
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS original_language TEXT DEFAULT 'es';

-- 8. Add missing columns to auctions
ALTER TABLE public.auctions
ADD COLUMN IF NOT EXISTS created_by UUID;

-- 9. Fix permissive RLS policies by replacing WITH CHECK (true) with authenticated check
DROP POLICY IF EXISTS "System can insert logs" ON public.activity_logs;
CREATE POLICY "Authenticated can insert logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "System can create notifications" ON public.user_notifications;
CREATE POLICY "Authenticated can create notifications" ON public.user_notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can send contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated can send contact messages" ON public.contact_messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can log views" ON public.vehicle_views;
CREATE POLICY "Authenticated can log views" ON public.vehicle_views FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "System can insert translations" ON public.translation_cache;
CREATE POLICY "Authenticated can insert translations" ON public.translation_cache FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can create registration request" ON public.registration_requests;
CREATE POLICY "Anyone can create registration request" ON public.registration_requests FOR INSERT WITH CHECK (true);