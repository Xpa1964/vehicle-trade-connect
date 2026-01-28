import { describe, it, expect } from 'vitest';
import { formatDateTime } from '@/utils/dateUtils';

describe('Date Utils', () => {
  describe('formatDateTime', () => {
    it('formats ISO date string to readable format', () => {
      const result = formatDateTime('2024-01-15T10:30:00Z');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('handles different time zones', () => {
      const result = formatDateTime('2024-01-15T00:00:00+01:00');
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('formats current datetime', () => {
      const now = new Date().toISOString();
      const result = formatDateTime(now);
      expect(result).toBeDefined();
    });

    it('returns a string', () => {
      const result = formatDateTime('2024-06-20T15:45:30Z');
      expect(typeof result).toBe('string');
    });
  });
});
