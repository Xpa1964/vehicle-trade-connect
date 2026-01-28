import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ExchangeProposalMessage } from '@/components/exchanges/ExchangeProposalMessage';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    })),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const mockProposal = {
  offeredVehicleId: 'vehicle-1',
  requestedVehicleId: 'vehicle-2',
  compensation: 1000,
  conditions: 'Good condition',
  status: 'pending' as const,
};

const renderMessage = () => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ExchangeProposalMessage 
            proposal={mockProposal}
            currentUserId="user-123"
            senderId="user-456"
            onAccept={vi.fn()}
            onReject={vi.fn()}
            onCounterOffer={vi.fn()}
          />
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('ExchangeProposalMessage Component', () => {
  it('renders without crashing', () => {
    const { container } = renderMessage();
    expect(container).toBeDefined();
  });

  it('displays proposal information', () => {
    const { container } = renderMessage();
    expect(container.textContent).toBeTruthy();
  });

  it('renders card component', () => {
    const { container } = renderMessage();
    const card = container.querySelector('[class*="Card"]');
    expect(card).toBeDefined();
  });
});
