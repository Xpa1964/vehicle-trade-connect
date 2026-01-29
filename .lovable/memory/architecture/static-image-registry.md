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
```typescript
import { STATIC_IMAGE_REGISTRY, getImageById } from '@/config/staticImageRegistry';
import { useStaticImageRegistry } from '@/hooks/useStaticImageRegistry';

// Get image by ID
const heroImage = getImageById('home.hero');

// Use hook for full functionality
const { filteredImages, globalStyle, composeFinalPrompt } = useStaticImageRegistry();
```
