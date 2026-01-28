import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '@/utils/logger';

describe('Logger Utility', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('provides log method', () => {
    expect(logger.log).toBeDefined();
    expect(typeof logger.log).toBe('function');
  });

  it('provides error method', () => {
    expect(logger.error).toBeDefined();
    expect(typeof logger.error).toBe('function');
  });

  it('provides warn method', () => {
    expect(logger.warn).toBeDefined();
    expect(typeof logger.warn).toBe('function');
  });

  it('provides info method', () => {
    expect(logger.info).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('provides debug method', () => {
    expect(logger.debug).toBeDefined();
    expect(typeof logger.debug).toBe('function');
  });

  it('logger methods accept multiple arguments', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    logger.log('test', 123, { key: 'value' });
    
    // In development, it should call console.log
    if (import.meta.env.DEV) {
      expect(spy).toHaveBeenCalledWith('test', 123, { key: 'value' });
    }
    
    spy.mockRestore();
  });

  it('error method accepts error objects', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const error = new Error('Test error');
    logger.error(error);
    
    if (import.meta.env.DEV) {
      expect(spy).toHaveBeenCalledWith(error);
    }
    
    spy.mockRestore();
  });

  it('all methods are callable without throwing', () => {
    expect(() => {
      logger.log('test');
      logger.error('error');
      logger.warn('warning');
      logger.info('info');
      logger.debug('debug');
    }).not.toThrow();
  });
});
