import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CampaignParams {
  video_language: string;
  campaign: string;
  dealer?: string;
  contact?: string;
}

type TrackingEventField = 'video_started' | 'video_completed' | 'popup_shown' | 'register_clicked';

interface VisitState {
  sessionId: string;
  ready: Promise<void>;
  createdAt: number;
}

const VISIT_STATE_TTL_MS = 15_000;
const visitStateByKey = new Map<string, VisitState>();

const normalizeParam = (value?: string | null) => (value || '').trim().toLowerCase();

const buildVisitKey = (params: CampaignParams) => [
  normalizeParam(params.campaign),
  normalizeParam(params.video_language),
  normalizeParam(params.dealer),
  normalizeParam(params.contact),
].join('|');

const cleanupExpiredVisitState = () => {
  const now = Date.now();
  for (const [key, state] of visitStateByKey.entries()) {
    if (now - state.createdAt > VISIT_STATE_TTL_MS) {
      visitStateByKey.delete(key);
    }
  }
};

export const useCampaignTracking = () => {
  const sessionId = useRef('');
  const logged = useRef(false);
  const visitReady = useRef<Promise<void>>(Promise.resolve());

  const logVisit = useCallback(async (params: CampaignParams) => {
    cleanupExpiredVisitState();

    if (logged.current) {
      await visitReady.current;
      return;
    }

    const visitKey = buildVisitKey(params);
    const existingState = visitStateByKey.get(visitKey);

    if (existingState) {
      sessionId.current = existingState.sessionId;
      visitReady.current = existingState.ready;
      logged.current = true;
      await visitReady.current;
      return;
    }

    const currentSessionId = crypto.randomUUID();
    sessionId.current = currentSessionId;
    logged.current = true;

    const ready = (async () => {
      console.log('[CampaignTracking] logVisit start', {
        sessionId: currentSessionId,
        campaign: params.campaign,
        videoLanguage: params.video_language,
      });

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
        throw error;
      }

      console.log('[CampaignTracking] logVisit inserted', { sessionId: currentSessionId });

      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        const visitorCountry = data.country_name || data.country || null;

        if (visitorCountry) {
          const { error: countryError } = await supabase
            .from('campaign_events' as any)
            .update({ visitor_country: visitorCountry })
            .eq('session_id', currentSessionId);

          if (countryError) {
            console.warn('[CampaignTracking] visitor_country update failed', countryError);
          }
        }
      } catch {
        // fallback without country
      }
    })()
      .catch((error) => {
        console.error('[CampaignTracking] logVisit failed', { sessionId: currentSessionId, error });
        logged.current = false;
        visitStateByKey.delete(visitKey);
      })
      .finally(() => {
        const state = visitStateByKey.get(visitKey);
        if (state?.sessionId === currentSessionId) {
          state.createdAt = Date.now();
        }
      });

    visitReady.current = ready;
    visitStateByKey.set(visitKey, {
      sessionId: currentSessionId,
      ready,
      createdAt: Date.now(),
    });

    await visitReady.current;
  }, []);

  const updateEvent = useCallback(async (field: TrackingEventField) => {
    await visitReady.current;

    const currentSessionId = sessionId.current;
    if (!currentSessionId) return;

    console.log('[CampaignTracking] updateEvent', { field, sessionId: currentSessionId });

    const { error } = await supabase
      .from('campaign_events' as any)
      .update({ [field]: true })
      .eq('session_id', currentSessionId);

    if (error) {
      console.error('[CampaignTracking] updateEvent failed', { field, sessionId: currentSessionId, error });
      return;
    }

    console.log('[CampaignTracking] updateEvent success', { field, sessionId: currentSessionId });
  }, []);

  const updateContact = useCallback(async (companyName: string) => {
    const cleanCompanyName = companyName.trim();
    if (!cleanCompanyName) return;

    await visitReady.current;

    const currentSessionId = sessionId.current;
    if (!currentSessionId) return;

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
