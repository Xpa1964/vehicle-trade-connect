import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import VehicleGalleryHero from '@/components/vehicles/VehicleGalleryHero';

// Mock LanguageContext
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'vehicles.galleryTitle': 'Vehicle Gallery',
        'vehicles.galleryDescription': 'Browse our collection'
      };
      return translations[key] || key;
    }
  })
}));

// Mock SimpleImage
vi.mock('@/components/shared/SimpleImage', () => ({
  default: ({ alt, className }: { alt: string; className: string }) => (
    <img alt={alt} className={className} data-testid="gallery-image" />
  )
}));

describe('VehicleGalleryHero Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<VehicleGalleryHero />);
    expect(getByTestId('gallery-image')).toBeDefined();
  });

  it('displays gallery title', () => {
    const { getByText } = render(<VehicleGalleryHero />);
    expect(getByText('Vehicle Gallery')).toBeDefined();
  });

  it('displays gallery description', () => {
    const { getByText } = render(<VehicleGalleryHero />);
    expect(getByText('Browse our collection')).toBeDefined();
  });

  it('has proper styling for text visibility', () => {
    const { container } = render(<VehicleGalleryHero />);
    const textContainer = container.querySelector('.bg-black\\/20');
    expect(textContainer).toBeDefined();
  });

  it('uses SimpleImage for performance', () => {
    const { getByTestId } = render(<VehicleGalleryHero />);
    const image = getByTestId('gallery-image');
    expect(image.getAttribute('alt')).toBe('Vehicle Gallery');
  });
});
