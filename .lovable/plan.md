

## Diagnosis

I've identified the root cause by reading the code — no need for console logs.

**The problem is unstable callback references causing an infinite player destroy/recreate loop.**

Here's the chain:

1. `Home.tsx` passes **inline arrow functions** as callbacks: `() => updateEvent('video_started')`. These create **new function references on every render**.

2. In `VideoPlayerModal.tsx`, `handleStateChange` is a `useCallback` with `[onVideoStarted, onVideoCompleted]` as dependencies. Since those references change every render, `handleStateChange` gets recreated every render.

3. The YouTube player `useEffect` (line 238) has `handleStateChange` in its dependency array (line 315). So every render triggers the cleanup → **destroys the player** → creates a new one.

4. The player never stabilizes long enough for YouTube to fire `onStateChange` events. The video may appear to play because the iframe is briefly visible before being destroyed and replaced.

## Plan

### 1. Stabilize callbacks in `VideoPlayerModal.tsx`

Replace the `useCallback`-based `handleStateChange` with a **ref-based pattern**. Store `onVideoStarted` and `onVideoCompleted` in refs so the handler function passed to `YT.Player` never changes:

```typescript
const onVideoStartedRef = useRef(onVideoStarted);
const onVideoCompletedRef = useRef(onVideoCompleted);
useEffect(() => { onVideoStartedRef.current = onVideoStarted; }, [onVideoStarted]);
useEffect(() => { onVideoCompletedRef.current = onVideoCompleted; }, [onVideoCompleted]);
```

The `handleStateChange` function then reads from refs instead of closing over the props. This means it's created once and never changes.

### 2. Remove `handleStateChange` from `useEffect` dependencies

With refs, the YouTube player `useEffect` only depends on `[isOpen, isYouTube, videoIdForEmbed, autoplay]` — all stable values. The player is created once and never destroyed/recreated during playback.

### 3. Memoize callbacks in `Home.tsx`

Wrap the inline callbacks in `useMemo`/`useCallback` so they don't cause unnecessary re-renders downstream:

```typescript
const handleVideoStarted = useCallback(() => {
  if (campaign) updateEvent('video_started');
}, [campaign, updateEvent]);
```

### 4. Add visible diagnostic toast (temporary)

Since the user tests from a tablet, add a temporary `toast.info()` inside `handleStateChange` when PLAYING and ENDED are detected, so the user can visually confirm events fire without needing console access.

### Files to modify
- `src/components/home/VideoPlayerModal.tsx` — ref-based stable callbacks, remove `handleStateChange` from deps
- `src/pages/Home.tsx` — memoize callback props

