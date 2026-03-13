
CREATE TABLE public.campaign_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  video_language text,
  campaign text,
  dealer text,
  visitor_country text,
  video_started boolean DEFAULT false,
  video_completed boolean DEFAULT false,
  popup_shown boolean DEFAULT false,
  register_clicked boolean DEFAULT false,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.campaign_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert campaign events"
  ON public.campaign_events FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view campaign events"
  ON public.campaign_events FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  ));
