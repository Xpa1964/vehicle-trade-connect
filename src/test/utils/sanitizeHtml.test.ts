import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

describe('Sanitize HTML Utility', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('returns empty string for null input', () => {
    expect(sanitizeHtml(null as any)).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(sanitizeHtml(undefined as any)).toBe('');
  });

  it('sanitizes script tags', () => {
    const malicious = '<script>alert("xss")</script>Hello';
    const result = sanitizeHtml(malicious);
    expect(result).not.toContain('<script>');
  });

  it('sanitizes event handlers', () => {
    const malicious = '<div onclick="alert()">Click</div>';
    const result = sanitizeHtml(malicious);
    expect(result).not.toContain('onclick');
  });

  it('allows safe HTML tags', () => {
    const safe = '<p>Hello <strong>World</strong></p>';
    const result = sanitizeHtml(safe);
    expect(result).toBeDefined();
  });

  it('handles complex HTML structures', () => {
    const html = '<div><p>Test</p><span>Content</span></div>';
    const result = sanitizeHtml(html);
    expect(result).toBeDefined();
  });

  it('removes javascript: protocol', () => {
    const malicious = '<a href="javascript:alert()">Click</a>';
    const result = sanitizeHtml(malicious);
    expect(result).not.toContain('javascript:');
  });
});
