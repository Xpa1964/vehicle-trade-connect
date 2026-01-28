import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/use-toast';

describe('useToast Hook', () => {
  it('initializes with empty toasts array', () => {
    const { result } = renderHook(() => useToast());
    
    expect(result.current.toasts).toEqual([]);
  });

  it('provides toast function to show notifications', () => {
    const { result } = renderHook(() => useToast());
    
    expect(result.current.toast).toBeDefined();
    expect(typeof result.current.toast).toBe('function');
  });

  it('adds a toast when toast function is called', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'This is a test notification',
      });
    });
    
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
    expect(result.current.toasts[0].description).toBe('This is a test notification');
  });

  it('supports different toast variants', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Success',
        variant: 'default',
      });
    });
    
    expect(result.current.toasts[0].variant).toBe('default');
  });

  it('provides dismiss function', () => {
    const { result } = renderHook(() => useToast());
    
    expect(result.current.dismiss).toBeDefined();
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('can dismiss all toasts', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
    });
    
    expect(result.current.toasts.length).toBe(2);
    
    act(() => {
      result.current.dismiss();
    });
    
    expect(result.current.toasts.length).toBe(0);
  });
});
