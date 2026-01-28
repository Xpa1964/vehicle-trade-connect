import { describe, it, expect } from 'vitest';
import { imageValidator } from '@/utils/imageValidation';

describe('Image Validation Utility', () => {
  it('exports imageValidator instance', () => {
    expect(imageValidator).toBeDefined();
  });

  it('imageValidator is an object', () => {
    expect(typeof imageValidator).toBe('object');
  });

  it('has validateFile method', () => {
    expect(imageValidator.validateFile).toBeDefined();
    expect(typeof imageValidator.validateFile).toBe('function');
  });

  it('has getConfig method', () => {
    expect(imageValidator.getConfig).toBeDefined();
    expect(typeof imageValidator.getConfig).toBe('function');
  });

  it('validates file format', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await imageValidator.validateFile(mockFile);
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('has configuration', () => {
    const config = imageValidator.getConfig();
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
  });

  it('is a singleton instance', () => {
    expect(imageValidator).toBe(imageValidator);
  });
});
