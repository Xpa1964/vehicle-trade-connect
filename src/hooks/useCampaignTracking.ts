
import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CampaignParams {
  video_language: string;
  campaign: string;
  dealer?: string;
  contact?: string;
}

export const useCampaignTracking = () => {
  const sessionId = useRef(crypto.randomUUID());
  const logged = useRef(false);
  const visitReady = useRef<Promise<void> | null>(null);

  const logVisit = useCallback(async (params: CampaignParams) => {
    if (logged.current) {
      await visitReady.current;
      return;
    }

    logged.current = true;
    const currentSessionId = sessionId.current;

    console.log('[CampaignTracking] logVisit start', {
      sessionId: currentSessionId,
      campaign: params.campaign,
      videoLanguage: params.video_language,
    });

    visitReady.current = (async () => {
      const { error } = await supabase.from('campaign_events' as any).insert({
        session_id: currentSessionId,
        video_language: params.video_language,
        campaign: params.campaign,
        dealer: params.dealer || null,
        contact: params.contact || null,
        visitor_country: null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });

      if (error) {
        console.error('[CampaignTracking] logVisit insert failed', error);
        return;
      }

      console.log('[CampaignTracking] logVisit inserted', { sessionId: currentSessionId });
    })();

    await visitReady.current;

    try {
      const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      const visitorCountry = data.country_name || data.country || null;

      if (visitorCountry) {
        const { error } = await supabase
          .from('campaign_events' as any)
          .update({ visitor_country: visitorCountry })
          .eq('session_id', currentSessionId);

        if (error) {
          console.warn('[CampaignTracking] visitor_country update failed', error);
        }
      }
    } catch {
      // fallback without country
    }
  }, []);

  const updateEvent = useCallback(async (field: 'video_started' | 'video_completed' | 'popup_shown' | 'register_clicked') => {
    await visitReady.current;

    const currentSessionId = sessionId.current;
    console.log('[CampaignTracking] updateEvent', { field, sessionId: currentSessionId });

    const { data, error } = await supabase
      .from('campaign_events' as any)
      .update({ [field]: true })
      .eq('session_id', currentSessionId)
      .select('id');

    if (error) {
      console.error('[CampaignTracking] updateEvent failed', { field, sessionId: currentSessionId, error });
      return;
    }

    console.log('[CampaignTracking] updateEvent success', {
      field,
      sessionId: currentSessionId,
      updatedRows: data?.length ?? 0,
    });
  }, []);

  const updateContact = useCallback(async (companyName: string) => {
    const cleanCompanyName = companyName.trim();
    if (!cleanCompanyName) return;

    await visitReady.current;

    const currentSessionId = sessionId.current;
    console.log('[CampaignTracking] updateContact', {
      sessionId: currentSessionId,
      companyName: cleanCompanyName,
    });

    const { error } = await supabase
      .from('campaign_events' as any)
      .update({ contact: cleanCompanyName })
      .eq('session_id', currentSessionId);

    if (error) {
      console.error('[CampaignTracking] updateContact failed', { sessionId: currentSessionId, error });
    }
  }, []);

  return { sessionId: sessionId.current, logVisit, updateEvent, updateContact };
};
