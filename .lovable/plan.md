

## Plan: Fix VideoPlayerModal — Robust Player with Iframe Fallback

### Problem
The YT IFrame API player uses a static `iframeId` ref and has no fallback if the API fails to load or the target div gets stale. This causes "video not available" errors on both button clicks and URL-param auto-opens.

### Fix — Rewrite `src/components/home/VideoPlayerModal.tsx`

**Three changes to the player initialization logic:**

1. **Fresh iframe ID per open** — Replace `useRef(`yt-player-${Date.now()}`)` with a `useState` counter that increments each time `isOpen` becomes `true`. The rendered div uses `id={`yt-player-${openCount}`}`, guaranteeing a fresh DOM target every time.

2. **Promise-based API init with 3s timeout** — Wrap YT API readiness in a helper that resolves when `YT.Player` is available or rejects after 3 seconds. On timeout, set a `useFallback` state flag.

3. **Fallback iframe** — When `useFallback` is true, render a standard `<iframe>` instead of the API-managed div:
   ```
   src="https://www.youtube.com/embed/{VIDEO_ID}?autoplay=1&mute=1&rel=0"
   ```
   This guarantees the video always loads. Campaign tracking callbacks (`onVideoStarted`, `onVideoCompleted`) won't fire in fallback mode, but the video plays.

**Cleanup:** `destroyPlayer` will also reset the fallback flag on close so next open tries the API again.

**No changes** to `AudioPresentationSection.tsx`, `Home.tsx`, tracking hook, or admin dashboard — the bug is entirely in the modal's player lifecycle.

### Single file change

| Action | File |
|--------|------|
| Rewrite player logic | `src/components/home/VideoPlayerModal.tsx` |

