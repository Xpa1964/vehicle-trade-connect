import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePassword, safeSignOut, sendRegistrationConfirmationEmail, notifyAdminsAboutRegistration } from '@/utils/authUtils';

describe('authUtils', () => {
  describe('generatePassword', () => {
    it('generates password with exactly 12 characters', () => {
      const password = generatePassword();
      expect(password).toHaveLength(12);
    });

    it('includes letters, numbers and special characters', () => {
      const password = generatePassword();
      
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*()\-_=+]/.test(password);
      
      expect(hasLetter).toBe(true);
      expect(hasNumber).toBe(true);
      expect(hasSpecial).toBe(true);
    });

    it('generates different passwords each time', () => {
      const password1 = generatePassword();
      const password2 = generatePassword();
      const password3 = generatePassword();
      
      expect(password1).not.toBe(password2);
      expect(password2).not.toBe(password3);
      expect(password1).not.toBe(password3);
    });

    it('only uses allowed characters', () => {
      const password = generatePassword();
      const allowedChars = /^[a-zA-Z0-9!@#$%^&*()\-_=+]+$/;
      
      expect(allowedChars.test(password)).toBe(true);
    });
  });

  describe('safeSignOut', () => {
    let mockSupabaseClient: any;

    beforeEach(() => {
      localStorage.clear();
      mockSupabaseClient = {
        auth: {
          signOut: vi.fn()
        }
      };
    });

    it('clears localStorage token before signing out', async () => {
      localStorage.setItem('supabase.auth.token', 'test-token');
      mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null });
      
      await safeSignOut(mockSupabaseClient);
      
      expect(localStorage.getItem('supabase.auth.token')).toBeNull();
    });

    it('calls supabase signOut method', async () => {
      mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null });
      
      await safeSignOut(mockSupabaseClient);
      
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalledTimes(1);
    });

    it('returns true on successful sign out', async () => {
      mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null });
      
      const result = await safeSignOut(mockSupabaseClient);
      
      expect(result).toBe(true);
    });

    it('handles sign out errors gracefully', async () => {
      const mockError = new Error('Sign out failed');
      mockSupabaseClient.auth.signOut.mockResolvedValue({ error: mockError });
      
      const result = await safeSignOut(mockSupabaseClient);
      
      // Should still return true to indicate client-side cleanup happened
      expect(result).toBe(true);
    });

    it('returns true even if signOut throws exception', async () => {
      mockSupabaseClient.auth.signOut.mockRejectedValue(new Error('Network error'));
      
      const result = await safeSignOut(mockSupabaseClient);
      
      expect(result).toBe(true);
    });
  });

  describe('sendRegistrationConfirmationEmail', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('calls correct edge function endpoint', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      await sendRegistrationConfirmationEmail('test@example.com', 'Test Company');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://inqqnsvlimtpjxjxuzaf.supabase.co/functions/v1/registration-emails',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('sends correct payload for confirmation email', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      await sendRegistrationConfirmationEmail('user@test.com', 'My Company');

      const callArgs = (global.fetch as any).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);

      expect(body).toEqual({
        type: 'confirmation',
        data: {
          email: 'user@test.com',
          companyName: 'My Company'
        }
      });
    });

    it('throws error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 500
      });

      await expect(
        sendRegistrationConfirmationEmail('test@example.com', 'Test Company')
      ).rejects.toThrow('Failed to send confirmation email');
    });

    it('throws error on network failure', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(
        sendRegistrationConfirmationEmail('test@example.com', 'Test Company')
      ).rejects.toThrow();
    });
  });

  describe('notifyAdminsAboutRegistration', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('sends notification to admin email', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      await notifyAdminsAboutRegistration('newuser@test.com', 'New Company');

      const callArgs = (global.fetch as any).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);

      expect(body).toEqual({
        type: 'notification',
        data: {
          email: 'admin@example.com',
          companyName: 'New Company'
        }
      });
    });

    it('returns true on successful notification', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      const result = await notifyAdminsAboutRegistration('test@test.com', 'Test Co');

      expect(result).toBe(true);
    });

    it('returns false but does not throw on fetch failure', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 500
      });

      const result = await notifyAdminsAboutRegistration('test@test.com', 'Test Co');

      expect(result).toBe(false);
    });

    it('returns false on network error without throwing', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const result = await notifyAdminsAboutRegistration('test@test.com', 'Test Co');

      expect(result).toBe(false);
    });
  });
});
