import { useRef, useCallback } from 'react';

interface CampaignParams {
  video_language: string;
  campaign: string;
  dealer?: string;
  contact?: string;
}

type TrackingEventField = 'video_started' | 'video_completed' | 'popup_shown' | 'register_clicked';

type StoredVisitSession = {
  sessionId: string;
  timestamp: number;
};

const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-campaign`;
const VISIT_DEDUP_MS = 15_000;
const VISIT_STORAGE_PREFIX = 'campaign-visit-session:';

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
// Store recent sessionId per visit key so remounted components and quick reloads recover it
const visitedSessions = new Map<string, StoredVisitSession>();

const buildVisitKey = (p: CampaignParams) =>
  [p.campaign, p.video_language, p.dealer, p.contact]
    .map((v) => (v || '').trim().toLowerCase())
    .join('|');

const getStorageKey = (visitKey: string) => `${VISIT_STORAGE_PREFIX}${visitKey}`;

const getValidStoredSession = (visitKey: string): string | null => {
  const now = Date.now();
  const memorySession = visitedSessions.get(visitKey);

  if (memorySession) {
    if (now - memorySession.timestamp <= VISIT_DEDUP_MS) {
      return memorySession.sessionId;
    }
    visitedSessions.delete(visitKey);
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(visitKey));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredVisitSession;
    if (!parsed?.sessionId || typeof parsed.timestamp !== 'number') {
      window.localStorage.removeItem(getStorageKey(visitKey));
      return null;
    }

    if (now - parsed.timestamp > VISIT_DEDUP_MS) {
      window.localStorage.removeItem(getStorageKey(visitKey));
      return null;
    }

    visitedSessions.set(visitKey, parsed);
    return parsed.sessionId;
  } catch {
    return null;
  }
};

const persistSession = (visitKey: string, sessionId: string) => {
  const value = { sessionId, timestamp: Date.now() };
  visitedSessions.set(visitKey, value);

  try {
    window.localStorage.setItem(getStorageKey(visitKey), JSON.stringify(value));
  } catch {
    // ignore storage issues
  }
};

const clearSession = (visitKey: string) => {
  visitedSessions.delete(visitKey);

  try {
    window.localStorage.removeItem(getStorageKey(visitKey));
  } catch {
    // ignore storage issues
  }
};

// ── Hook ───────────────────────────────────────────────────
export const useCampaignTracking = () => {
  const sessionId = useRef('');
  const insertDone = useRef(false);
  const insertPromise = useRef<Promise<void>>(Promise.resolve());
  const sentEvents = useRef<Set<TrackingEventField>>(new Set());

  const logVisit = useCallback(async (params: CampaignParams) => {
    if (insertDone.current) {
      await insertPromise.current;
      return;
    }

    const key = buildVisitKey(params);
    const existingSession = getValidStoredSession(key);

    if (existingSession) {
      sessionId.current = existingSession;
      insertDone.current = true;
      sentEvents.current.clear();
      console.log('[CampaignTracking] visit deduplicated', { sessionId: existingSession, key });
      return;
    }

    const newSessionId = crypto.randomUUID();
    sessionId.current = newSessionId;
    insertDone.current = true;
    sentEvents.current.clear();
    persistSession(key, newSessionId);

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
      insertDone.current = false;
      sessionId.current = '';
      clearSession(key);
    });

    insertPromise.current = promise.then(() => undefined);
    await insertPromise.current;
  }, []);

  const updateEvent = useCallback(async (field: TrackingEventField) => {
    console.log('[CampaignTracking] updateEvent CALLED', { field, sessionId: sessionId.current });

    if (sentEvents.current.has(field)) {
      console.log('[CampaignTracking] updateEvent SKIPPED duplicate', { field, sessionId: sessionId.current });
      return;
    }

    await insertPromise.current;

    const sid = sessionId.current;
    if (!sid) {
      console.error('[CampaignTracking] updateEvent ABORTED: no sessionId after insert', { field });
      return;
    }

    try {
      await trackCall({ action: 'event', session_id: sid, field });
      sentEvents.current.add(field);
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
