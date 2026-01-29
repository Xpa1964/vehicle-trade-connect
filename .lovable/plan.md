
# Plan para Resolver el Error "Cannot read properties of null (reading 'useState')"

## Diagnóstico del Problema

El error `Cannot read properties of null (reading 'useState')` ocurre cuando React intenta usar hooks pero su estado interno (dispatcher) no está inicializado. Basándome en el análisis del código, el problema tiene **dos causas principales**:

### Causa 1: Inicializaciones Síncronas en main.tsx

En `src/main.tsx` líneas 11-26, hay código que se ejecuta **antes** de que React se monte:

```text
┌─────────────────────────────────────────────────────────┐
│  ORDEN DE EJECUCIÓN ACTUAL (PROBLEMÁTICO)               │
├─────────────────────────────────────────────────────────┤
│  1. import React                                        │
│  2. import App                                          │
│  3. initRegistryIntegrityCheck()  ← Ejecuta ANTES      │
│  4. initCriticalImagePreload()    ← de que React       │
│  5. initDevImageGuard()           ← esté listo         │
│  6. Object.freeze(REGISTRY)                             │
│  7. createRoot().render()         ← React se monta     │
└─────────────────────────────────────────────────────────┘
```

### Causa 2: useToast dentro de useAdminStatistics

El hook `useAdminStatistics` (línea 256) usa `useToast()` que internamente llama a `useState`. Si hay cualquier problema de timing con React, este hook falla.

---

## Solución Propuesta

### Paso 1: Mover las inicializaciones DESPUÉS del render

Las funciones de inicialización del Static Image Platform deben ejecutarse **después** de que React se monte, no antes. Se moverán dentro de un `useEffect` en el componente `App`.

**Archivo:** `src/main.tsx`

Cambios:
- Eliminar las llamadas a `initRegistryIntegrityCheck()`, `initCriticalImagePreload()`, `initDevImageGuard()`
- Mantener solo los imports y el `createRoot().render()`

**Archivo:** `src/App.tsx`

Cambios:
- Mover todas las inicializaciones del Static Image Platform dentro de un `useEffect` separado
- Esto garantiza que React ya está completamente montado

### Paso 2: Proteger useAdminStatistics contra errores de contexto

**Archivo:** `src/hooks/admin-statistics/index.ts`

Cambios:
- Envolver el uso de `useToast` en un try-catch
- Usar `console.error` como fallback si `useToast` falla
- Agregar una guarda de seguridad al inicio del hook

### Paso 3: Agregar guarda defensiva en AdminDashboard

**Archivo:** `src/components/admin/AdminDashboard.tsx`

Cambios:
- Agregar verificación temprana de que React está correctamente inicializado
- Usar ErrorBoundary específico para este componente si es necesario

---

## Detalle Técnico de los Cambios

### main.tsx - Antes vs Después

```text
ANTES:
─────────────────────────────────
import { initRegistryIntegrityCheck } from '...';
initRegistryIntegrityCheck();  // ← Se ejecuta inmediatamente

import { initCriticalImagePreload } from '...';
initCriticalImagePreload();    // ← Se ejecuta inmediatamente

import { initDevImageGuard } from '...';
initDevImageGuard();           // ← Se ejecuta inmediatamente

createRoot(root).render(<App />);

DESPUÉS:
─────────────────────────────────
// Solo imports, sin llamadas inmediatas
import { STATIC_IMAGE_REGISTRY } from '...';

createRoot(root).render(<App />);
// Las inicializaciones se mueven a App.tsx
```

### App.tsx - Nuevo useEffect

```text
useEffect(() => {
  // Static Image Platform - se ejecuta DESPUÉS de que React esté listo
  const initStaticImagePlatform = async () => {
    const { initRegistryIntegrityCheck } = await import('@/lib/registryIntegrityCheck');
    const { initCriticalImagePreload } = await import('@/lib/criticalImagePreloader');
    const { initDevImageGuard } = await import('@/lib/devImageGuard');
    
    initRegistryIntegrityCheck();
    initCriticalImagePreload();
    initDevImageGuard();
    
    // Freeze en producción
    if (!import.meta.env.DEV) {
      Object.freeze(STATIC_IMAGE_REGISTRY);
    }
  };
  
  initStaticImagePlatform();
}, []);
```

### useAdminStatistics - Guarda defensiva

```text
export const useAdminStatistics = () => {
  // Guarda defensiva para contexto de React
  let toastFn: ReturnType<typeof useToast>['toast'] | null = null;
  
  try {
    const { toast } = useToast();
    toastFn = toast;
  } catch (error) {
    console.warn('[useAdminStatistics] Toast not available, using fallback');
  }
  
  // ... resto del hook
};
```

---

## Archivos a Modificar

| Archivo | Acción |
|---------|--------|
| `src/main.tsx` | Eliminar inicializaciones síncronas del Static Image Platform |
| `src/App.tsx` | Mover inicializaciones a useEffect con imports dinámicos |
| `src/hooks/admin-statistics/index.ts` | Agregar guarda defensiva para useToast |

---

## Por Qué Esta Solución Funciona

1. **Respeta el ciclo de vida de React**: Las inicializaciones solo ocurren cuando React ya está completamente montado
2. **Imports dinámicos**: Evitan que el código se ejecute durante la carga del módulo
3. **Guardas defensivas**: Previenen cascadas de errores si algo falla
4. **Cero impacto visual**: No hay cambios en la UI, solo en el orden de ejecución

---

## Lo Que NO Se Modificará

- No se cambia ninguna funcionalidad del Static Image Platform
- No se modifican los componentes de UI
- No se tocan rutas ni navegación
- No se alteran otros hooks o contextos
