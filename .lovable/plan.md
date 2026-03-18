

## Problem

On mobile, the post-video overlay (contact form with checkboxes + submit button) is inside a `div` with `aspect-video` dimensions. The overlay has `overflow-y-auto` but the user doesn't realize they can scroll — the checkboxes and "OK, me interesa" button are cut off below the fold with no visual indication.

## Solution

Replace the current overlay positioning so it **breaks out of the aspect-video container** on mobile and uses the full modal height. Add a subtle animated scroll indicator (bouncing chevron) that appears when content overflows, and auto-hides once the user scrolls.

### Changes in `src/components/home/VideoPlayerModal.tsx`:

1. **Move the overlay outside the `aspect-video` div** — When `showOverlay` is true, hide the video area and show the form in the main modal body instead, giving it the full `max-h-[90vh]` space rather than being constrained to the 16:9 aspect ratio.

2. **Add a scroll indicator** — A small animated bouncing chevron (▼) at the bottom of the overlay that:
   - Only shows when content overflows (using a `ResizeObserver` or scroll check)
   - Disappears after the user scrolls down
   - Uses Tailwind's `animate-bounce` for attention

3. **Make the form more compact on mobile** — Reduce logo size further on small screens (`w-14 h-14`), tighten gaps (`gap-2`), so more of the actionable content (checkboxes + button) is visible above the fold.

### Structural change (simplified):

```
// Current: overlay is INSIDE aspect-video div (constrained)
<div className="aspect-video">
  <player/>
  {showOverlay && <overlay/>}  ← cramped
</div>

// New: overlay REPLACES video area in the flex column
<div className="flex flex-col">
  {!showOverlay && <div className="aspect-video"><player/></div>}
  {showOverlay && <overlay with full height + scroll indicator/>}
</div>
```

This ensures the form gets the full modal height (~90vh) on mobile instead of being locked to the small 16:9 video area.

