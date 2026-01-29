# Memory: architecture/static-image-registry
Updated: just now

The Static Image Platform is a **core infrastructure primitive** that centralizes ALL product/UI images. It is NOT a feature - it is foundational architecture that CANNOT be bypassed.

## Platform Enforcement Layers

1. **ESLint Rule** (`eslint-rules/no-unregistered-images.cjs`) - Compile-time blocking of direct paths
2. **Runtime Guard** (`src/lib/devImageGuard.ts`) - Dev-only detection of unregistered images
3. **Auto-Preload** (`src/lib/criticalImagePreloader.ts`) - Critical images preload on boot
4. **Registry Freeze** - Production `Object.freeze(STATIC_IMAGE_REGISTRY)`
5. **Type Safety** - `StaticImageId` and `StaticImageKey` types for compile-time validation

## Core Files

| File | Purpose |
|------|---------|
| `src/config/staticImageRegistry.ts` | Source of truth |
| `src/components/shared/SafeImage.tsx` | Production-grade component |
| `src/hooks/useStaticImage.ts` | React hook |
| `docs/STATIC_IMAGE_PLATFORM.md` | Full documentation |

## Forbidden Paths (User Content - NEVER Include)
- `/uploads/`, `/vehicles/`, `/auctions/`, `/user-content/`
- All external storage URLs

## Usage

```typescript
// Component usage
<SafeImage imageId="home.hero" alt="Hero" />

// Hook usage
const { src, fallback } = useStaticImage('home.hero');

// Non-hook (data files)
const path = getStaticImagePath('services.showroom');
```

## Migrated Components (Phase 1)
- ✅ HeroSection.tsx - Home hero + logo
- ✅ servicesData.ts - All 9 service cards
- ✅ ControlPanel.tsx - All dashboard action cards
