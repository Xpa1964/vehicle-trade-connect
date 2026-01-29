# Static Image Platform

## Overview

The Static Image Platform is a **core infrastructure primitive** that centralizes management of all product/UI images in the application.

This is NOT a feature. It is **foundational architecture**.

---

## Why This System Exists

### The Problem

Without centralization:
- Image paths are scattered across hundreds of files
- Changing a single image requires hunting through the codebase
- No visibility into which images are used where
- No way to batch-update visual identity
- AI-powered image generation becomes impossible
- Performance optimization requires manual work per image

### The Solution

One registry. One source of truth. Total control.

```
┌─────────────────────────────────────────────────────────┐
│                 STATIC IMAGE REGISTRY                    │
│           src/config/staticImageRegistry.ts              │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  home   │  │ layout  │  │dashboard│  │services │    │
│  │ .hero   │  │ .navbar │  │.vehicles│  │.showroom│    │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │
└───────┼────────────┼────────────┼────────────┼──────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
   ┌─────────────────────────────────────────────────┐
   │              useStaticImage() / SafeImage        │
   │                 ONLY ACCESS POINT                │
   └─────────────────────────────────────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
   HeroSection   Navbar      Dashboard    Services
```

---

## Non-Bypass Rule

### ⚠️ CRITICAL: Images MUST go through the registry

Direct image paths are **BLOCKED**:

```tsx
// ❌ FORBIDDEN - Will trigger ESLint error
<img src="/images/hero.png" />
<img src="/lovable-uploads/abc123.png" />
style={{ backgroundImage: 'url(/assets/bg.jpg)' }}

// ✅ CORRECT - Uses registry
<SafeImage imageId="home.hero" alt="Hero background" />
const { src } = useStaticImage('home.hero');
```

### Why No Bypass?

1. **Single Source of Truth**: One place to update = zero hunting
2. **AI-Ready**: Future AI image generation needs registry metadata
3. **Performance**: Critical images auto-preload on boot
4. **Monitoring**: Know exactly which images exist and where they're used
5. **Fallback Chain**: Automatic fallbacks prevent broken images

---

## How to Add Images

### Step 1: Add to Registry

```typescript
// src/config/staticImageRegistry.ts

export const STATIC_IMAGE_REGISTRY = {
  // Add your new image
  MY_NEW_IMAGE: {
    id: "feature.myImage",           // Dot-notation ID
    currentPath: "/images/my-image.png",  // Actual path
    usage: "MyComponent.tsx",        // Where it's used
    purpose: "Description of image", // What it shows
    critical: false,                 // true = preloaded on boot
    aiEditable: true,                // true = can be AI-regenerated
    category: "dashboard",           // Category for filtering
    source: "product"                // MUST be "product"
  },
  // ...
};
```

### Step 2: Use in Component

```tsx
// Option A: SafeImage component (recommended)
import SafeImage from '@/components/shared/SafeImage';

<SafeImage 
  imageId="feature.myImage" 
  alt="Description for accessibility"
  className="w-full h-auto"
/>

// Option B: useStaticImage hook
import { useStaticImage } from '@/hooks/useStaticImage';

const MyComponent = () => {
  const { src, fallback, isCritical } = useStaticImage('feature.myImage');
  
  return (
    <img 
      src={src} 
      alt="Description"
      onError={(e) => e.currentTarget.src = fallback}
    />
  );
};

// Option C: Non-hook version (for data files)
import { getStaticImagePath } from '@/hooks/useStaticImage';

const imageUrl = getStaticImagePath('feature.myImage');
```

---

## SafeImage Component

Production-grade image component with:

| Feature | Description |
|---------|-------------|
| **Auto-retry** | Retries once on failure before fallback |
| **Fallback chain** | Registry fallback → Custom fallback → Global placeholder |
| **Silent production** | No console errors for users |
| **LCP optimization** | `preload` prop for critical images |
| **Registry integration** | Automatic path resolution |

```tsx
<SafeImage
  imageId="home.hero"           // Registry ID
  alt="Hero background"         // Required for a11y
  className="w-full"            // Styling
  preload={true}                // Add to <head> preload
  fetchPriority="high"          // Browser priority hint
  onImageLoad={() => {}}        // Success callback
  onAllFailed={() => {}}        // All fallbacks exhausted
/>
```

---

## Critical Flag

Images marked `critical: true` are **automatically preloaded on app boot**.

### What Makes an Image Critical?

- Above-the-fold content (hero, navbar logo)
- LCP candidates (largest visible element)
- Essential branding
- First-paint visibility

### How It Works

```
App Boot
    │
    ▼
initCriticalImagePreload()
    │
    ▼
Get all critical: true images
    │
    ▼
Create <link rel="preload"> for each
    │
    ▼
Browser fetches with high priority
    │
    ▼
Images ready before component render
```

**Zero developer action required** - infrastructure handles it.

---

## AI-Ready Design

Images marked `aiEditable: true` can be regenerated through the admin dashboard.

### Future Capabilities

1. **Prompt-based regeneration**: Describe what you want → AI generates
2. **Style consistency**: Global style prompt applies to all generations
3. **Version history**: Track all image versions, rollback if needed
4. **Batch generation**: Regenerate entire categories at once

### Registry Metadata for AI

```typescript
{
  id: "services.showroom",
  purpose: "Vehicle gallery with luxury cars in showroom setting",
  aiEditable: true,
  // AI can use 'purpose' as context for generation
}
```

---

## Registry Structure

```typescript
interface StaticImageEntry {
  id: string;           // Unique identifier (e.g., "home.hero")
  currentPath: string;  // Current file path
  usage: string;        // Component(s) using this image
  purpose: string;      // What the image shows
  critical: boolean;    // Preload on boot?
  aiEditable: boolean;  // Can AI regenerate?
  fallback?: string;    // Fallback path if main fails
  category: ImageCategory;  // For filtering/grouping
  source: 'product';    // MUST be 'product' (not user content)
}
```

### Categories

| Category | Description |
|----------|-------------|
| `home` | Home page images (hero, sections) |
| `layout` | Navigation, footer, global UI |
| `dashboard` | Control panel, user dashboard |
| `services` | Service cards, feature illustrations |
| `messaging` | Chat, messaging UI |
| `legal` | Legal pages, policies |
| `marketing` | Promotional, landing pages |
| `auth` | Login, signup, auth flows |

---

## Enforcement Layers

### 1. ESLint Rule (Compile-time)

```javascript
// eslint-rules/no-unregistered-images.cjs
// Blocks: <img src="/images/..." />
// Error, not warning
```

### 2. Runtime Guard (Dev only)

```typescript
// src/lib/devImageGuard.ts
// Detects images without registry at runtime
// Logs grouped warning (no spam)
```

### 3. Type Safety

```typescript
import { StaticImageId, StaticImageKey } from '@/config/staticImageRegistry';

// Compile-time validation
const id: StaticImageId = 'home.hero'; // ✅
const id: StaticImageId = 'typo.here'; // ❌ Type error
```

### 4. Registry Freeze (Production)

```typescript
// Registry is frozen in production
// Cannot be mutated at runtime
Object.freeze(STATIC_IMAGE_REGISTRY);
```

---

## User-Generated Content

### ⚠️ This system is ONLY for product images

**NEVER include** in the registry:
- Vehicle uploads
- Auction images
- User avatars
- Attachments
- Documents
- Any user-uploaded content

### Forbidden Paths (Auto-rejected)

```
/uploads/
/vehicles/
/auctions/
/user-content/
/user-uploads/
/attachments/
/documents/
/avatars/
storage.googleapis.com
supabase.co/storage
```

---

## Quick Reference

### Add New Image
1. Add entry to `staticImageRegistry.ts`
2. Use `<SafeImage imageId="..." />` in component

### Mark as Critical
```typescript
critical: true  // Auto-preloads on boot
```

### Enable AI Editing
```typescript
aiEditable: true  // Available in admin dashboard
```

### Check Registration
```typescript
import { isValidImageId } from '@/config/staticImageRegistry';
isValidImageId('home.hero'); // true
```

---

## File Locations

| File | Purpose |
|------|---------|
| `src/config/staticImageRegistry.ts` | Registry (source of truth) |
| `src/components/shared/SafeImage.tsx` | Production-grade component |
| `src/hooks/useStaticImage.ts` | React hook for registry access |
| `src/lib/criticalImagePreloader.ts` | Auto-preload on boot |
| `src/lib/devImageGuard.ts` | Runtime violation detection |
| `src/lib/registryIntegrityCheck.ts` | Startup validation |
| `eslint-rules/no-unregistered-images.cjs` | Compile-time enforcement |
| `docs/STATIC_IMAGE_PLATFORM.md` | This documentation |

---

## Contact

For questions about the Static Image Platform, consult this documentation or review the source files. This is core infrastructure - treat it with the same care as database access or authentication.
