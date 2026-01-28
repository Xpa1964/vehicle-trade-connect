import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VehicleComparisonCard from '@/components/exchanges/VehicleComparisonCard';
import { LanguageProvider } from '@/contexts/LanguageContext';

const mockOfferedVehicle = {
  id: 'vehicle-1',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  price: 15000,
};

const mockRequestedVehicle = {
  id: 'vehicle-2',
  brand: 'Honda',
  model: 'Civic',
  year: 2021,
  price: 18000,
};

const renderCard = () => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <VehicleComparisonCard 
          offeredVehicle={mockOfferedVehicle}
          requestedVehicle={mockRequestedVehicle}
          compensation={2000}
          status="pending"
          onViewDetails={vi.fn()}
        />
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('VehicleComparisonCard Component', () => {
  it('renders without crashing', () => {
    const { container } = renderCard();
    expect(container).toBeDefined();
  });

  it('displays offered vehicle information', () => {
    const { getByText } = renderCard();
    expect(getByText(/Toyota Corolla/i)).toBeDefined();
  });

  it('displays requested vehicle information', () => {
    const { getByText } = renderCard();
    expect(getByText(/Honda Civic/i)).toBeDefined();
  });

  it('shows compensation amount', () => {
    const { container } = renderCard();
    expect(container.textContent).toContain('2');
  });

  it('renders comparison layout', () => {
    const { container } = renderCard();
    const cards = container.querySelectorAll('[class*="Card"]');
    expect(cards.length).toBeGreaterThan(0);
  });
});
