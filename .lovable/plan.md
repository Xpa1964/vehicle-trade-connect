

## Plan: Adjust Logo Position in Navbar

The logo in `NavbarContainer.tsx` (line 52-60) needs to shift **50px left** and **30px up** from its current position.

### Change
**File: `src/components/layout/navbar/NavbarContainer.tsx`** (line 52)

Add relative positioning with negative margins to the logo container:
```tsx
<div className="flex-shrink-0 touch-manipulation relative" style={{ marginLeft: '-50px', marginTop: '-30px' }}>
```

This uses inline `style` for precise pixel control since Tailwind doesn't have exact 50px/30px utility classes. The `relative` class ensures it doesn't break the navbar flow while visually shifting the logo.

