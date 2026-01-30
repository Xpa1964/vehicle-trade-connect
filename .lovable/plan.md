
# Plan: Corrección del Sistema de Reemplazo de Imágenes

## Resumen Ejecutivo

He identificado **DOS problemas críticos** que explican por qué las imágenes generadas en el Image Control Center no aparecen en la web:

1. **El componente `AudioPresentationSection.tsx` NO usa el sistema de registro de imágenes**: Importa directamente el archivo estático `@/assets/headphones-listen.png` en lugar de usar el hook `useStaticImage('home.headphones')`. Esto hace que ignore completamente las imágenes guardadas en el storage.

2. **El Prompt Global se guarda en dos claves diferentes de localStorage**: El Image Control Center usa `imageControlCenter_globalStyle` mientras que el hook `useStaticImageRegistry` usa `staticImageRegistry_globalStyle`. Esto causa que el prompt se "pierda" dependiendo de qué pantalla se use.

Adicionalmente, el **Service Worker (PWA)** está cacheando imágenes estáticas agresivamente, lo cual dificulta ver los cambios en tablets sin hacer un "hard refresh".

---

## Verificación del Estado Actual

La imagen `home.headphones` **SÍ está correctamente guardada** en Supabase Storage:
- Ruta: `home/headphones/1769764209885.png`
- Guardada hace ~35 minutos
- Tamaño: 1.13 MB

El problema es que el código del componente nunca busca esta imagen - siempre usa el archivo del bundle.

---

## Cambios Necesarios

### Paso 1: Migrar AudioPresentationSection al Sistema de Registro

Modificar `src/components/home/AudioPresentationSection.tsx`:

**Antes:**
```typescript
import headphonesImage from '@/assets/headphones-listen.png';
// ...
<img src={headphonesImage} alt="..." />
```

**Después:**
```typescript
import { useStaticImage } from '@/hooks/useStaticImage';
// ...
const headphonesImg = useStaticImage('home.headphones');
// ...
<img 
  src={headphonesImg.src} 
  alt="..." 
  onError={(e) => {
    if (headphonesImg.fallback) {
      e.currentTarget.src = headphonesImg.fallback;
    }
  }}
/>
```

Esto permitirá que el componente:
- Primero busque la imagen en el storage de Supabase
- Use fallback al asset estático si no hay imagen en storage
- Se actualice automáticamente cuando se reemplace la imagen

### Paso 2: Unificar la Clave del Prompt Global

Modificar `src/hooks/useStaticImageRegistry.ts`:

Cambiar la clave de localStorage de `staticImageRegistry_globalStyle` a `imageControlCenter_globalStyle` para que ambos sistemas usen la misma fuente de verdad.

### Paso 3: Excluir Imágenes de Supabase del Cache del Service Worker

Modificar `public/sw.js`:

Agregar lógica para que las URLs del bucket `static-images` de Supabase siempre usen "Network First" en lugar de "Cache First". Esto asegura que los cambios se vean inmediatamente.

```text
Antes (línea 87):
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|...)$/)) {
    event.respondWith(cacheFirst(request));

Después:
  // Excluir imágenes de Supabase storage del cache agresivo
  if (url.pathname.match(/\.(png|jpg|...)$/) && !url.origin.includes('supabase.co')) {
    event.respondWith(cacheFirst(request));
```

### Paso 4: Forzar Invalidación de Cache tras Reemplazo

Modificar `src/components/admin/ImageGenerationModal.tsx`:

Después de un reemplazo exitoso, disparar el evento `static-image-updated` para que todos los componentes que usen ese `imageId` se refresquen sin necesidad de recargar la página.

```typescript
// Después de reemplazo exitoso:
window.dispatchEvent(new CustomEvent('static-image-updated', {
  detail: { imageId: image.id }
}));
```

---

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/home/AudioPresentationSection.tsx` | Usar `useStaticImage('home.headphones')` en vez de import estático |
| `src/hooks/useStaticImageRegistry.ts` | Cambiar clave localStorage a `imageControlCenter_globalStyle` |
| `public/sw.js` | Excluir Supabase storage del cache agresivo |
| `src/components/admin/ImageGenerationModal.tsx` | Disparar evento de invalidación tras reemplazo |

---

## Resultado Esperado

Una vez implementados estos cambios:

1. **Imágenes reemplazadas aparecerán inmediatamente** en la web sin necesidad de hacer hard refresh
2. **El Prompt Global se mantendrá fijo** entre sesiones y diferentes pantallas
3. **Las tablets y móviles** verán los cambios sin problemas de cache
4. **El sistema será consistente**: todas las imágenes AI-editables usarán el mismo mecanismo de storage

---

## Sección Técnica

### Flujo de Resolución de Imágenes (después del fix)

```text
useStaticImage('home.headphones')
    │
    ▼
┌─────────────────────────────────────┐
│ 1. Buscar en Supabase Storage       │
│    GET /static-images/home/headphones│
│    - Ordenar por created_at DESC    │
│    - Tomar el más reciente          │
└─────────────────────────────────────┘
    │
    ├─── Si existe ──► Usar URL del storage con cache-buster
    │
    └─── Si no existe ──► Usar currentPath del registro
                          (src/assets/headphones-listen.png)
```

### Claves de localStorage Unificadas

| Propósito | Clave Final |
|-----------|-------------|
| Prompt Global | `imageControlCenter_globalStyle` |
| Zoom por imagen | `imageControlCenter_zoomLevels` |
| Prompts individuales | `imageControlCenter_imagePrompts` |
