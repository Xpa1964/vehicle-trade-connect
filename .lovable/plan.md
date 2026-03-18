

## Diagnosis

I've confirmed from the live database and edge function logs that:

- **LinkedIn tracking works perfectly**: session `a3bce066` has all 4 events (start, complete, popup, click) = true
- **organic_web visits ARE being created** in the DB, but events (start, complete, popup, click) remain all false
- **Edge function logs show NO event UPDATE calls for organic_web sessions** -- meaning the frontend is NOT sending event updates for web visits

The root cause is a combination of **3 bugs**:

### Bug 1: Edge function returns "success" even when 0 rows are updated
When `updateEvent` sends an event, the edge function does `UPDATE ... WHERE session_id = $id` and returns `{success: true, rows_updated: 0}` without signaling failure. The frontend treats this as success and marks the event as "sent" -- permanently preventing retries.

### Bug 2: Frontend marks events as "sent" without verifying actual DB update
In `useCampaignTracking.ts`, after calling `trackCall`, the hook does `sentEvents.current.add(field)` regardless of whether the backend actually updated any rows. Combined with Bug 1, events are silently lost forever.

### Bug 3: Service Worker serves stale JavaScript on custom domain
The `sw.js` uses "stale-while-revalidate" for JS files -- meaning kontactvo.com may serve a cached (old) version of the tracking code on first load. The user only gets fresh code on the SECOND visit. This explains why LinkedIn (fresh URL, no cache) works but web (cached SW) doesn't.

## Plan

### 1. Fix the Edge Function to report actual update failures
In `supabase/functions/track-campaign/index.ts`, for the `event` action: if `rows_updated === 0`, return `{success: false, error: "session_not_found"}` with HTTP 404 instead of pretending it worked.

### 2. Fix the frontend to only mark events "sent" on confirmed success
In `src/hooks/useCampaignTracking.ts`:
- After `trackCall` for events, check the response for `rows_updated > 0` before adding to `sentEvents`
- If `rows_updated === 0`, don't add to `sentEvents` so the event can be retried
- Add a small retry mechanism (wait 1-2 seconds and retry once if the visit insert hasn't propagated yet)

### 3. Fix Service Worker JS caching strategy
In `public/sw.js`:
- Change JS/CSS caching from "stale-while-revalidate" to **"network-first"** -- this ensures the latest code is always served, falling back to cache only when offline
- Bump the cache version names to force invalidation of stale caches

This combination of fixes ensures:
- Events are never silently lost
- The custom domain always serves fresh tracking code
- Failed events can be retried instead of being permanently skipped

