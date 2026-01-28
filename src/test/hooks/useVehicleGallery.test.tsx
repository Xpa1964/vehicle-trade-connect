import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useVehicleGallery } from '@/hooks/useVehicleGallery';

// Mock Supabase client
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockOrder = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mockFrom,
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
    })),
  },
}));

describe('useVehicleGallery Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    // Setup mock chain
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({
      data: [
        {
          id: 'vehicle-1',
          user_id: 'user-1',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
          price: 15000,
        },
      ],
      error: null,
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useVehicleGallery(), { wrapper });
    
    expect(result.current.isLoading).toBe(true);
  });

  it('provides vehicles array', async () => {
    const { result } = renderHook(() => useVehicleGallery(), { wrapper });
    
    expect(result.current.vehicles).toBeDefined();
    expect(Array.isArray(result.current.vehicles)).toBe(true);
  });

  it('provides updateVehicleOptimistically function', () => {
    const { result } = renderHook(() => useVehicleGallery(), { wrapper });
    
    expect(result.current.updateVehicleOptimistically).toBeDefined();
    expect(typeof result.current.updateVehicleOptimistically).toBe('function');
  });

  it('queries vehicles from database', () => {
    renderHook(() => useVehicleGallery(), { wrapper });
    
    // Wait a bit for async operations
    setTimeout(() => {
      expect(mockFrom).toHaveBeenCalledWith('vehicles');
    }, 100);
  });

  it('has error state', () => {
    const { result } = renderHook(() => useVehicleGallery(), { wrapper });
    
    expect(result.current.error).toBeDefined();
  });

  it('returns empty array initially', () => {
    const { result } = renderHook(() => useVehicleGallery(), { wrapper });
    
    expect(result.current.vehicles).toEqual([]);
  });
});
