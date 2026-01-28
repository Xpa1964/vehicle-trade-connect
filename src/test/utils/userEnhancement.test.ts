import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhanceUser } from '@/utils/userEnhancement';
import type { User } from '@supabase/supabase-js';

// Mock Supabase client
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mockFrom,
  },
}));

describe('userEnhancement Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mock chain
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
  });

  it('enhances user with profile data', async () => {
    const mockUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
    };

    const mockProfile = {
      company_name: 'Test Company',
      role: 'admin',
      business_type: 'buyer',
    };

    mockSingle.mockResolvedValueOnce({
      data: mockProfile,
      error: null,
    });

    const result = await enhanceUser(mockUser);
    
    expect(result).toBeDefined();
    expect(result?.id).toBe('user-123');
    expect(result?.email).toBe('test@example.com');
  });

  it('queries correct table with user id', async () => {
    const mockUser: User = {
      id: 'user-456',
      email: 'test2@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
    };

    mockSingle.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    await enhanceUser(mockUser);
    
    expect(mockFrom).toHaveBeenCalledWith('profiles');
    expect(mockEq).toHaveBeenCalledWith('id', 'user-456');
  });

  it('handles missing profile gracefully', async () => {
    const mockUser: User = {
      id: 'user-789',
      email: 'test3@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
    };

    mockSingle.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    const result = await enhanceUser(mockUser);
    
    // Should still return enhanced user even without profile
    expect(result).toBeDefined();
    expect(result?.id).toBe('user-789');
  });

  it('handles database error gracefully', async () => {
    const mockUser: User = {
      id: 'user-error',
      email: 'error@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
    };

    mockSingle.mockResolvedValueOnce({
      data: null,
      error: new Error('Database error'),
    });

    const result = await enhanceUser(mockUser);
    
    // Should handle error and still return enhanced user
    expect(result).toBeDefined();
  });

  it('returns null for null user input', async () => {
    const result = await enhanceUser(null as any);
    
    expect(result).toBeNull();
  });
});
