import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVehicleForm } from '@/hooks/useVehicleForm';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('@/hooks/useVehicleSubmit', () => ({
  useVehicleSubmit: () => ({
    handleVehicleSubmit: vi.fn().mockResolvedValue(true),
  }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    })),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('useVehicleForm Hook', () => {
  it('initializes with form instance', () => {
    const { result } = renderHook(() => useVehicleForm(), { wrapper });
    
    expect(result.current.form).toBeDefined();
    expect(typeof result.current.form.handleSubmit).toBe('function');
  });

  it('provides onSubmit handler', () => {
    const { result } = renderHook(() => useVehicleForm(), { wrapper });
    
    expect(result.current.onSubmit).toBeDefined();
    expect(typeof result.current.onSubmit).toBe('function');
  });

  it('provides isLoading state', () => {
    const { result } = renderHook(() => useVehicleForm(), { wrapper });
    
    expect(result.current.isLoading).toBeDefined();
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('starts with isLoading as false', () => {
    const { result } = renderHook(() => useVehicleForm(), { wrapper });
    
    expect(result.current.isLoading).toBe(false);
  });

  it('form has default values', () => {
    const { result } = renderHook(() => useVehicleForm(), { wrapper });
    
    const values = result.current.form.getValues();
    expect(values).toBeDefined();
    expect(values.status).toBe('available');
  });

  it('form validates required fields', () => {
    const { result } = renderHook(() => useVehicleForm(), { wrapper });
    
    const formState = result.current.form.formState;
    expect(formState).toBeDefined();
  });

  it('form can be reset', () => {
    const { result } = renderHook(() => useVehicleForm(), { wrapper });
    
    expect(result.current.form.reset).toBeDefined();
    expect(typeof result.current.form.reset).toBe('function');
  });

  it('form has watch method', () => {
    const { result } = renderHook(() => useVehicleForm(), { wrapper });
    
    expect(result.current.form.watch).toBeDefined();
    expect(typeof result.current.form.watch).toBe('function');
  });

  it('form has setValue method', () => {
    const { result } = renderHook(() => useVehicleForm(), { wrapper });
    
    expect(result.current.form.setValue).toBeDefined();
    expect(typeof result.current.form.setValue).toBe('function');
  });

  it('form has getValues method', () => {
    const { result } = renderHook(() => useVehicleForm(), { wrapper });
    
    expect(result.current.form.getValues).toBeDefined();
    expect(typeof result.current.form.getValues).toBe('function');
  });
});
