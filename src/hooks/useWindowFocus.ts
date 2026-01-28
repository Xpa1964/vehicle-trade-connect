
import { useState, useEffect, useCallback } from 'react';

export const useWindowFocus = () => {
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [hasReturnedFromExternal, setHasReturnedFromExternal] = useState(false);

  useEffect(() => {
    const handleFocus = () => {
      setIsWindowFocused(true);
      // Si acabamos de volver de una ventana externa, marcarlo
      if (!isWindowFocused) {
        setHasReturnedFromExternal(true);
        // Auto-limpiar después de 3 segundos
        setTimeout(() => setHasReturnedFromExternal(false), 3000);
      }
    };

    const handleBlur = () => {
      setIsWindowFocused(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      } else {
        handleBlur();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isWindowFocused]);

  const resetReturnedFlag = useCallback(() => {
    setHasReturnedFromExternal(false);
  }, []);

  return {
    isWindowFocused,
    hasReturnedFromExternal,
    resetReturnedFlag
  };
};
