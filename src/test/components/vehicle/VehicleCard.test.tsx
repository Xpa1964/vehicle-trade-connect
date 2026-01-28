import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VehicleCard from '@/components/vehicle/VehicleCard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import type { Vehicle } from '@/types/vehicle';

// Mock hooks
vi.mock('@/hooks/useRatings', () => ({
  useRatings: () => ({
    ratingSummary: {
      average_rating: 4.5,
      total_ratings: 10,
      verified_ratings: 5,
    },
  }),
}));

const mockVehicle: Vehicle = {
  id: 'vehicle-123',
  user_id: 'user-456',
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
  thumbnailUrl: 'https://example.com/image.jpg',
  created_at: '2024-01-01T00:00:00Z',
};

const renderVehicleCard = (vehicle: Vehicle = mockVehicle) => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <VehicleCard vehicle={vehicle} />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('VehicleCard Component', () => {
  it('renders vehicle information correctly', () => {
    const { getByText } = renderVehicleCard();
    
    expect(getByText(/Toyota Corolla/i)).toBeDefined();
    expect(getByText('2020')).toBeDefined();
    expect(getByText(/50,000 km/i)).toBeDefined();
  });

  it('displays price formatted correctly', () => {
    const { container } = renderVehicleCard();
    
    const priceElement = container.querySelector('.text-blue-600');
    expect(priceElement).toBeDefined();
    expect(priceElement?.textContent).toContain('15');
  });

  it('shows vehicle location', () => {
    const { getByText } = renderVehicleCard();
    
    expect(getByText(/Madrid.*Spain/i)).toBeDefined();
  });

  it('displays fuel type and transmission', () => {
    const { getByText } = renderVehicleCard();
    
    expect(getByText(/gasoline/i)).toBeDefined();
    expect(getByText(/automatic/i)).toBeDefined();
  });

  it('shows reserved badge when vehicle is reserved', () => {
    const reservedVehicle = { ...mockVehicle, status: 'reserved' as const };
    const { container } = renderVehicleCard(reservedVehicle);
    
    const badge = container.querySelector('.bg-red-500');
    expect(badge).toBeDefined();
  });

  it('shows in auction badge when vehicle is in auction', () => {
    const auctionVehicle = { ...mockVehicle, status: 'in_auction' as const };
    const { container } = renderVehicleCard(auctionVehicle);
    
    const badge = container.querySelector('.bg-orange-500');
    expect(badge).toBeDefined();
  });

  it('displays vehicle image with fallback', () => {
    const { container } = renderVehicleCard();
    
    const image = container.querySelector('img');
    expect(image).toBeDefined();
    expect(image?.src).toContain('example.com');
  });

  it('shows number of doors', () => {
    const { getByText } = renderVehicleCard();
    
    expect(getByText(/4/i)).toBeDefined();
  });

  it('renders creation date', () => {
    const { container } = renderVehicleCard();
    
    // Should contain date information
    const dateText = container.textContent;
    expect(dateText).toContain('2024');
  });

  it('renders as a link when linkTo prop is provided', () => {
    const { container } = render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <VehicleCard vehicle={mockVehicle} linkTo="/vehicle/123" />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );
    
    const link = container.querySelector('a');
    expect(link).toBeDefined();
    expect(link?.href).toContain('/vehicle/123');
  });
});
