# Memory: architecture/static-image-registry
Updated: just now

Static UI images are centralized in `src/config/staticImageRegistry.ts` to provide a single source of truth for assets like logos, banners, and hero backgrounds. This registry tracks metadata—including ID, path, usage, and AI-editability—to facilitate a future AI-powered image management dashboard while strictly excluding dynamic content such as vehicle listings, auctions, or user-uploaded documents.

## Key Features
- **source: "product"** field enforces separation from user-generated content
- **Path validation** rejects forbidden patterns (`/uploads/`, `/vehicles/`, `/auctions/`, `/user-content/`)
- **Admin dashboard** at `/admin/static-images` for image management
- **Global style prompt** system for visual consistency across AI-generated images
- **Version history** stored in localStorage for tracking changes

## Forbidden Paths (User Content - NEVER Include)
- `/uploads/`
- `/vehicles/`
- `/auctions/`
- `/user-content/`
- `/user-uploads/`
- `/attachments/`
- `/documents/`
- `/avatars/`
- External storage URLs

## Usage

### Hook-based (for React components)
```typescript
import { useStaticImage } from '@/hooks/useStaticImage';

const { src, fallback, isValid } = useStaticImage('home.hero');
<img src={src} onError={(e) => e.currentTarget.src = fallback} />
```

### Component-based (simplest)
```typescript
import RegistryImage from '@/components/shared/RegistryImage';

<RegistryImage imageId="home.hero" alt="Hero background" className="w-full" />
```

### Non-hook (for data files)
```typescript
import { getStaticImagePath } from '@/hooks/useStaticImage';

const bgImage = getStaticImagePath('services.showroom');
```

## Migrated Components (Phase 1)
- ✅ HeroSection.tsx - Home hero + logo
- ✅ servicesData.ts - All 9 service cards
- ✅ ControlPanel.tsx - All dashboard action cards
