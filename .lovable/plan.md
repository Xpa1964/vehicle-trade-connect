

## Plan: Campaign Tracking System with URL-Driven Video Playback

### Overview
Add URL parameter support for video auto-selection/autoplay on the home page, create a database table for campaign event tracking, and build an admin dashboard at `/admin/campaigns` with table, filters, and charts.

---

### 1. Database Migration

Create a `campaign_events` table:

```sql
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

-- Public insert (anonymous visitors, no auth required)
CREATE POLICY "Anyone can insert campaign events"
  ON public.campaign_events FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Admin-only read
CREATE POLICY "Admins can view campaign events"
  ON public.campaign_events FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  ));
```

---

### 2. Home Page — URL Parameter Handling

**File: `src/pages/Home.tsx`**

- Read `video`, `autoplay`, `campaign`, `dealer` from `useSearchParams()`.
- Pass `video` language and `autoplay` flag down to `AudioPresentationSection`.
- If `campaign` param exists, log a campaign event immediately (insert row with `session_id`, `video_language`, `campaign`, `dealer`).
- Use a shared `sessionId` (UUID generated once per page load) to update the same row as events progress.

**File: `src/components/home/AudioPresentationSection.tsx`**

- Accept new props: `initialVideoLanguage?: string`, `autoplay?: boolean`, `campaignSessionId?: string`.
- If `initialVideoLanguage` is set, auto-open `VideoPlayerModal` on mount with the corresponding video.
- If `autoplay` is true, pass it through to the modal.
- When user clicks a language button, also update URL params via `window.history.replaceState` (no reload).

**File: `src/components/home/VideoPlayerModal.tsx`**

- Accept `autoplay` prop (already uses `autoplay: 1` in YT player config — just make it conditional).
- Accept `onVideoStarted`, `onVideoCompleted`, `onPopupShown`, `onRegisterClicked` callback props.
- Fire `onVideoStarted` when YT player state changes to PLAYING.
- Fire `onVideoCompleted` when state is ENDED (already detected).
- Fire `onPopupShown` when overlay renders.
- Fire `onRegisterClicked` in `handleContactClick`.

---

### 3. Campaign Event Tracking Hook

**New file: `src/hooks/useCampaignTracking.ts`**

- Generates a `sessionId` (UUID) on init.
- `logVisit(params)` — inserts initial row into `campaign_events`.
- `updateEvent(field)` — updates the existing row (e.g., `video_started = true`).
- Uses `supabase` client for inserts/updates.
- Fetches approximate country via a free IP geolocation API (`https://ipapi.co/json/`) or falls back to `navigator.language`.

---

### 4. Admin Campaigns Page

**New file: `src/pages/admin/Campaigns.tsx`**

Panel at `/admin/campaigns` with:

**Filters bar:**
- Campaign (text/select)
- Language (select from 9 languages)
- Dealer (text input)
- Date range (from/to date pickers)

**Results table** (columns):
- Campaign | Language | Dealer | Visits | Video Plays | Completions | Popup Views | Register Clicks

Data aggregated via a grouped query on `campaign_events`.

**Charts section** (using existing recharts dependency):
- Bar chart: visits by language
- Bar chart: visits by campaign
- Line chart: daily visits over time
- Funnel/bar: play → complete → popup → register ratio

---

### 5. Route Registration

**File: `src/routes/AppRoutes.tsx`**

- Add lazy import for `AdminCampaigns`.
- Add route `<Route path="campaigns" element={<AdminCampaigns />} />` inside the admin routes block.

---

### 6. Admin Navigation Link

Add "Campaigns" entry to `AdminNavigation` component so admins can access the panel from the sidebar.

---

### Summary of Files

| Action | File |
|--------|------|
| Migration | `campaign_events` table + RLS |
| Edit | `src/pages/Home.tsx` — read URL params, init tracking |
| Edit | `src/components/home/AudioPresentationSection.tsx` — accept props, auto-open video |
| Edit | `src/components/home/VideoPlayerModal.tsx` — event callbacks |
| Create | `src/hooks/useCampaignTracking.ts` — tracking logic |
| Create | `src/pages/admin/Campaigns.tsx` — admin dashboard |
| Edit | `src/routes/AppRoutes.tsx` — add route |
| Edit | `AdminNavigation` — add menu entry |

