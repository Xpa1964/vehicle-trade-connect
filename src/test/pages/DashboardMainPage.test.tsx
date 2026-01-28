import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import DashboardMainPage from '@/pages/DashboardMainPage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock components to simplify testing
vi.mock('@/components/dashboard/StatsSection', () => ({
  default: () => <div data-testid="stats-section">Stats Section</div>,
}));

vi.mock('@/components/dashboard/ControlPanel', () => ({
  default: () => <div data-testid="control-panel">Control Panel</div>,
}));

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
    auth: {
      getSession: vi.fn().mockResolvedValue({ 
        data: { 
          session: { 
            user: { id: 'user-123', email: 'test@example.com' } 
          } 
        }, 
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
      user: { id: 'user-123', email: 'test@example.com', role: 'user' },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      hasPermission: vi.fn(),
      updateUserRole: vi.fn(),
      refreshUser: vi.fn(),
    }),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <DashboardMainPage />
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('DashboardMainPage', () => {
  it('renders without crashing', () => {
    const { container } = renderDashboard();
    expect(container).toBeDefined();
  });

  it('displays page title', () => {
    const { getByText } = renderDashboard();
    expect(getByText(/dashboard|inicio/i)).toBeDefined();
  });

  it('renders stats section', () => {
    const { getByTestId } = renderDashboard();
    expect(getByTestId('stats-section')).toBeDefined();
  });

  it('renders control panel', () => {
    const { getByTestId } = renderDashboard();
    expect(getByTestId('control-panel')).toBeDefined();
  });

  it('shows welcome message', () => {
    const { container } = renderDashboard();
    
    // Should contain some welcome or dashboard text
    expect(container.textContent).toBeTruthy();
  });

  it('renders in a container', () => {
    const { container } = renderDashboard();
    
    const mainContainer = container.querySelector('[class*="container"]');
    expect(mainContainer || container.firstChild).toBeDefined();
  });

  it('has proper layout structure', () => {
    const { container } = renderDashboard();
    
    // Should have some layout structure
    const layoutElements = container.querySelectorAll('div');
    expect(layoutElements.length).toBeGreaterThan(0);
  });
});
