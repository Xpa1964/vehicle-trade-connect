import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuthSession } from '@/hooks/useAuthSession';

// Mock Supabase client
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}));

// Mock user enhancement
vi.mock('@/utils/userEnhancement', () => ({
  enhanceUser: vi.fn((user) => ({
    ...user,
    id: user.id,
    email: user.email,
    role: 'user',
  })),
}));

describe('useAuthSession Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('initializes with null user and loading true', () => {
    const { result } = renderHook(() => useAuthSession());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('provides setUser function', () => {
    const { result } = renderHook(() => useAuthSession());
    
    expect(result.current.setUser).toBeDefined();
    expect(typeof result.current.setUser).toBe('function');
  });

  it('fetches session on mount', async () => {
    renderHook(() => useAuthSession());
    
    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockGetSession).toHaveBeenCalled();
  });

  it('sets up auth state listener', async () => {
    renderHook(() => useAuthSession());
    
    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockOnAuthStateChange).toHaveBeenCalled();
  });

  it('handles user session correctly', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
    };

    mockGetSession.mockResolvedValueOnce({
      data: {
        session: {
          user: mockUser,
          access_token: 'token',
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useAuthSession());
    
    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 200));
    expect(result.current.isLoading).toBe(false);
  });

  it('handles session error gracefully', async () => {
    mockGetSession.mockResolvedValueOnce({
      data: { session: null },
      error: new Error('Session error'),
    });

    const { result } = renderHook(() => useAuthSession());
    
    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 200));
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
