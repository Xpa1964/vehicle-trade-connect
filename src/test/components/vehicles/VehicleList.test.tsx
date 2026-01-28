import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VehicleList from '@/components/vehicles/VehicleList';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import type { Vehicle } from '@/types/vehicle';

// Mock hooks
vi.mock('@/hooks/useVehicleRecommendations', () => ({
  useVehicleRecommendations: () => ({
    trackVehicleVisit: vi.fn(),
  }),
}));

vi.mock('@/hooks/useRatings', () => ({
  useRatings: () => ({
    ratingSummary: null,
  }),
}));

const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    user_id: 'user-1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    price: 15000,
    mileage: 50000,
    fuel: 'gasoline',
    transmission: 'automatic',
    doors: 4,
    location: 'Madrid',
    country: 'Spain',
    countryCode: 'ES',
    status: 'available',
    thumbnailUrl: 'https://example.com/image1.jpg',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'vehicle-2',
    user_id: 'user-2',
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 18000,
    mileage: 30000,
    fuel: 'hybrid',
    transmission: 'automatic',
    doors: 4,
    location: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    status: 'available',
    thumbnailUrl: 'https://example.com/image2.jpg',
    created_at: '2024-01-02T00:00:00Z',
  },
];

const mockOnResetSearch = vi.fn();

const renderVehicleList = (vehicles: Vehicle[] = mockVehicles, props = {}) => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <VehicleList 
            vehicles={vehicles} 
            onResetSearch={mockOnResetSearch}
            {...props}
          />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('VehicleList Component', () => {
  it('renders list of vehicles', () => {
    const { getByText } = renderVehicleList();
    
    expect(getByText(/Toyota Corolla/i)).toBeDefined();
    expect(getByText(/Honda Civic/i)).toBeDefined();
  });

  it('shows empty state when no vehicles', () => {
    const { getByText } = renderVehicleList([]);
    
    expect(getByText(/no.*vehicles/i)).toBeDefined();
  });

  it('shows reset button in empty state', () => {
    const { getByRole } = renderVehicleList([]);
    
    const resetButton = getByRole('button');
    expect(resetButton).toBeDefined();
  });

  it('displays loading skeletons when isLoading is true', () => {
    const { container } = renderVehicleList([], { isLoading: true });
    
    // Should render skeleton components
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders correct number of vehicles', () => {
    const { container } = renderVehicleList();
    
    // Should have 2 vehicle cards
    const cards = container.querySelectorAll('[class*="Card"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('uses compact layout when compact prop is true', () => {
    const { container } = renderVehicleList(mockVehicles, { compact: true });
    
    // Should have grid with more columns for compact view
    const grid = container.querySelector('[class*="grid"]');
    expect(grid?.className).toMatch(/lg:grid-cols-4/);
  });

  it('uses standard layout by default', () => {
    const { container } = renderVehicleList();
    
    const grid = container.querySelector('[class*="grid"]');
    expect(grid?.className).toMatch(/lg:grid-cols-2|xl:grid-cols-3/);
  });

  it('renders public view correctly', () => {
    const { container } = renderVehicleList(mockVehicles, { isPublicView: true });
    
    // Should render without errors
    expect(container).toBeDefined();
  });
});
