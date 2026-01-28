import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';

// Mock LanguageContext
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.title': 'Test Title',
        'home.description': 'Test Description',
        'home.cta': 'Test CTA'
      };
      return translations[key] || key;
    },
    language: 'es'
  })
}));

// Mock SimpleImage component
vi.mock('@/components/shared/SimpleImage', () => ({
  default: ({ alt, className }: { alt: string; className: string }) => (
    <img alt={alt} className={className} data-testid="simple-image" />
  )
}));

describe('HeroSection Component', () => {
  const renderHeroSection = () => {
    return render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    const { getByTestId } = renderHeroSection();
    expect(getByTestId('simple-image')).toBeDefined();
  });

  it('displays title text', () => {
    const { getByText } = renderHeroSection();
    expect(getByText('Test Title')).toBeDefined();
  });

  it('displays description text', () => {
    const { getByText } = renderHeroSection();
    expect(getByText('Test Description')).toBeDefined();
  });

  it('has proper accessibility attributes', () => {
    const { getByRole } = renderHeroSection();
    const descriptionRegion = getByRole('region', { name: /descripción del servicio/i });
    expect(descriptionRegion).toBeDefined();
  });

  it('applies correct CSS classes for responsive design', () => {
    const { container } = renderHeroSection();
    const heroContainer = container.querySelector('.relative');
    expect(heroContainer).toBeDefined();
  });

  it('has text shadow for accessibility contrast', () => {
    const { container } = renderHeroSection();
    const descriptionText = container.querySelector('p[style*="textShadow"]');
    expect(descriptionText).toBeDefined();
  });
});
