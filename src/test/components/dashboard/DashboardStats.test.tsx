import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock Supabase
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOr = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mockFrom,
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
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
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderDashboardStats = () => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <DashboardStats />
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('DashboardStats Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mock chain
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq, or: mockOr });
    mockEq.mockResolvedValue({ count: 5, error: null });
    mockOr.mockResolvedValue({ count: 3, error: null });
  });

  it('renders stats cards', () => {
    const { container } = renderDashboardStats();
    
    // Should render multiple stat cards
    const cards = container.querySelectorAll('[class*="Card"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('displays vehicle stats', async () => {
    const { findByText } = renderDashboardStats();
    
    // Should show vehicle-related text
    const vehicleText = await findByText(/vehicle/i, {}, { timeout: 3000 });
    expect(vehicleText).toBeDefined();
  });

  it('displays message stats', async () => {
    const { findByText } = renderDashboardStats();
    
    // Should show message-related text
    const messageText = await findByText(/message/i, {}, { timeout: 3000 });
    expect(messageText).toBeDefined();
  });

  it('uses grid layout', () => {
    const { container } = renderDashboardStats();
    
    const grid = container.querySelector('.grid');
    expect(grid).toBeDefined();
  });

  it('queries user vehicles', async () => {
    renderDashboardStats();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockFrom).toHaveBeenCalledWith('vehicles');
  });

  it('queries user conversations', async () => {
    renderDashboardStats();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockFrom).toHaveBeenCalledWith('conversations');
  });

  it('queries user announcements', async () => {
    renderDashboardStats();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockFrom).toHaveBeenCalledWith('announcements');
  });
});
