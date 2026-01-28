import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Mock user enhancement
vi.mock('@/utils/userEnhancement', () => ({
  enhanceUser: vi.fn((user) => ({
    ...user,
    role: 'user',
  })),
}));

// Mock auth hooks
vi.mock('@/hooks/useAuthSession', () => ({
  useAuthSession: () => ({
    user: null,
    setUser: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useAuthOperations', () => ({
  useAuthOperations: () => ({
    login: vi.fn().mockResolvedValue(true),
    register: vi.fn().mockResolvedValue(true),
    logout: vi.fn().mockResolvedValue(undefined),
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides authentication context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current).toBeDefined();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('provides login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.login).toBeDefined();
    expect(typeof result.current.login).toBe('function');
  });

  it('provides register function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.register).toBeDefined();
    expect(typeof result.current.register).toBe('function');
  });

  it('provides logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.logout).toBe('function');
  });

  it('provides hasPermission function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.hasPermission).toBeDefined();
    expect(typeof result.current.hasPermission).toBe('function');
  });

  it('provides updateUserRole function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.updateUserRole).toBeDefined();
    expect(typeof result.current.updateUserRole).toBe('function');
  });

  it('provides refreshUser function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.refreshUser).toBeDefined();
    expect(typeof result.current.refreshUser).toBe('function');
  });

  it('returns false for hasPermission when user is not authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.hasPermission('users.view')).toBe(false);
  });

  it('starts with loading state as false', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isLoading).toBe(false);
  });
});
