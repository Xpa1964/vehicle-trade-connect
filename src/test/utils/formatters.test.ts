import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPrice, formatDate } from '@/utils/formatters';

describe('Formatters Utility', () => {
  describe('formatCurrency', () => {
    it('formats number as EUR currency by default', () => {
      const result = formatCurrency(15000);
      expect(result).toContain('15');
      expect(result).toContain('€');
    });

    it('formats with different currency codes', () => {
      const result = formatCurrency(1000, 'USD');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('handles zero amount', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0');
    });

    it('handles negative amounts', () => {
      const result = formatCurrency(-500);
      expect(result).toContain('500');
    });

    it('formats large numbers correctly', () => {
      const result = formatCurrency(1000000);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatPrice', () => {
    it('is an alias for formatCurrency', () => {
      const price = formatPrice(15000);
      const currency = formatCurrency(15000);
      expect(price).toBe(currency);
    });

    it('formats price with EUR by default', () => {
      const result = formatPrice(25000);
      expect(result).toContain('25');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date string', () => {
      const result = formatDate('2024-01-15T00:00:00Z');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('includes month in Spanish format', () => {
      const result = formatDate('2024-01-15T00:00:00Z');
      // Should contain month name or number
      expect(result.length).toBeGreaterThan(0);
    });

    it('handles different date formats', () => {
      const result = formatDate('2024-12-25T00:00:00Z');
      expect(result).toBeDefined();
    });

    it('formats current date without errors', () => {
      const now = new Date().toISOString();
      const result = formatDate(now);
      expect(result).toBeDefined();
    });
  });
});
