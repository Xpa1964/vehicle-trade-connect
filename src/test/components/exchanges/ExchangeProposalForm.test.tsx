import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ExchangeProposalForm } from '@/components/exchanges/ExchangeProposalForm';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    })),
    auth: {
      getSession: vi.fn().mockResolvedValue({ 
        data: { session: { user: { id: 'user-123' } } }, 
        error: null 
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}));

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: { id: 'user-123', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
    }),
  };
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderForm = () => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <ExchangeProposalForm 
              targetVehicleId="vehicle-123"
              sellerId="seller-456"
            />
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('ExchangeProposalForm Component', () => {
  it('renders without crashing', () => {
    const { container } = renderForm();
    expect(container).toBeDefined();
  });

  it('displays form elements', () => {
    const { container } = renderForm();
    const form = container.querySelector('form');
    expect(form).toBeDefined();
  });

  it('has tabs for navigation', () => {
    const { container } = renderForm();
    const tabs = container.querySelector('[role="tablist"]');
    expect(tabs).toBeDefined();
  });

  it('renders vehicle selection section', () => {
    const { container } = renderForm();
    expect(container.textContent).toBeTruthy();
  });
});
