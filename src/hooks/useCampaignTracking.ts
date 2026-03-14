import { useRef, useCallback } from 'react';

interface CampaignParams {
  video_language: string;
  campaign: string;
  dealer?: string;
  contact?: string;
}

type TrackingEventField = 'video_started' | 'video_completed' | 'popup_shown' | 'register_clicked';

const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-campaign`;

const trackCall = async (body: Record<string, unknown>) => {
  console.log('[CampaignTracking] → fetch', body);

  const res = await fetch(EDGE_FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  console.log('[CampaignTracking] ← response', { status: res.status, ...json });

  if (!res.ok || !json.success) {
    throw new Error(json.error || `HTTP ${res.status}`);
  }

  return json;
};

// ── Deduplication ──────────────────────────────────────────
const visitedKeys = new Set<string>();

const buildVisitKey = (p: CampaignParams) =>
  [p.campaign, p.video_language, p.dealer, p.contact]
    .map((v) => (v || '').trim().toLowerCase())
    .join('|');

// ── Hook ───────────────────────────────────────────────────
export const useCampaignTracking = () => {
  const sessionId = useRef('');
  const insertDone = useRef(false);
  const insertPromise = useRef<Promise<void>>(Promise.resolve());

  const logVisit = useCallback(async (params: CampaignParams) => {
    // Already logged in this component instance
    if (insertDone.current) {
      await insertPromise.current;
      return;
    }

    const key = buildVisitKey(params);

    // Already logged in another instance with same params
    if (visitedKeys.has(key)) {
      // We don't have the sessionId from the other instance,
      // but we also don't want to create a duplicate.
      insertDone.current = true;
      return;
    }

    const newSessionId = crypto.randomUUID();
    sessionId.current = newSessionId;
    insertDone.current = true;
    visitedKeys.add(key);

    const promise = trackCall({
      action: 'visit',
      session_id: newSessionId,
      video_language: params.video_language,
      campaign: params.campaign,
      dealer: params.dealer || null,
      contact: params.contact || null,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    }).catch((err) => {
      console.error('[CampaignTracking] logVisit FAILED', err);
      // Reset so a retry is possible
      insertDone.current = false;
      sessionId.current = '';
      visitedKeys.delete(key);
    });

    insertPromise.current = promise.then(() => undefined);
    await insertPromise.current;
  }, []);

  const updateEvent = useCallback(async (field: TrackingEventField) => {
    console.log('[CampaignTracking] updateEvent CALLED', { field, sessionId: sessionId.current });

    // Wait for INSERT to finish
    await insertPromise.current;

    const sid = sessionId.current;
    if (!sid) {
      console.error('[CampaignTracking] updateEvent ABORTED: no sessionId after insert', { field });
      return;
    }

    try {
      await trackCall({ action: 'event', session_id: sid, field });
    } catch (err) {
      console.error('[CampaignTracking] updateEvent FAILED', { field, sessionId: sid, err });
    }
  }, []);

  const updateContact = useCallback(async (companyName: string, interests?: string[]) => {
    const clean = companyName.trim();
    if (!clean && (!interests || interests.length === 0)) return;

    await insertPromise.current;

    const sid = sessionId.current;
    if (!sid) return;

    try {
      const payload: Record<string, unknown> = { action: 'contact', session_id: sid, interests: interests || [] };
      if (clean) payload.contact = clean;
      await trackCall(payload);
    } catch (err) {
      console.error('[CampaignTracking] updateContact FAILED', err);
    }
  }, []);

  return { sessionId: sessionId.current, logVisit, updateEvent, updateContact };
};
