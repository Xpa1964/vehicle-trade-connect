import { useState, useEffect } from 'react';

/**
 * Hook personalizado para aplicar debounce a valores
 * Útil para optimizar búsquedas y filtros que causan re-renders frecuentes
 * 
 * @param value - Valor a aplicar debounce
 * @param delay - Retardo en milisegundos (default: 300ms)
 * @returns Valor con debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establecer timeout para actualizar el valor con debounce
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar timeout si el valor cambia antes del delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
