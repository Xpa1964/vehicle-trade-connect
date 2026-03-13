
import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CampaignParams {
  video_language: string;
  campaign: string;
  dealer?: string;
}

export const useCampaignTracking = () => {
  const sessionId = useRef(crypto.randomUUID());
  const logged = useRef(false);

  const logVisit = useCallback(async (params: CampaignParams) => {
    if (logged.current) return;
    logged.current = true;

    let visitorCountry: string | null = null;
    try {
      const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      visitorCountry = data.country_name || data.country || null;
    } catch { /* fallback */ }

    await supabase.from('campaign_events' as any).insert({
      session_id: sessionId.current,
      video_language: params.video_language,
      campaign: params.campaign,
      dealer: params.dealer || null,
      visitor_country: visitorCountry,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    });
  }, []);

  const updateEvent = useCallback(async (field: 'video_started' | 'video_completed' | 'popup_shown' | 'register_clicked') => {
    await supabase
      .from('campaign_events' as any)
      .update({ [field]: true })
      .eq('session_id', sessionId.current);
  }, []);

  return { sessionId: sessionId.current, logVisit, updateEvent };
};
