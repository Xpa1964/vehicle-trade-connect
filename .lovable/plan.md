
# Image Control Center - Plan de Implementación

## Resumen Ejecutivo

Crear un panel de control de imágenes de producto ubicado en `/admin/image-control` que permite:

1. Visualizar todas las imágenes estáticas del producto
2. Generar reemplazos usando AI (Lovable AI Gateway)
3. Reemplazar imágenes en storage con el mismo URL para actualización instantánea

---

## Arquitectura del Sistema

```text
┌─────────────────────────────────────────────────────────────────┐
│                    IMAGE CONTROL CENTER                          │
│                    /admin/image-control                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  GLOBAL STYLE PROMPT                                        │ │
│  │  "dark UI, premium lighting, cinematic, high contrast..."   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ IMAGE    │  │ IMAGE    │  │ IMAGE    │  │ IMAGE    │  ...   │
│  │ CARD     │  │ CARD     │  │ CARD     │  │ CARD     │        │
│  │          │  │          │  │          │  │          │        │
│  │ [Preview]│  │ [Preview]│  │ [Preview]│  │ [Preview]│        │
│  │ ID       │  │ ID       │  │ ID       │  │ ID       │        │
│  │ Usage    │  │ Usage    │  │ Usage    │  │ Usage    │        │
│  │ [Edit]   │  │ [Edit]   │  │ [Edit]   │  │ [Edit]   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GENERATION MODAL                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐     ┌─────────────────────┐            │
│  │   CURRENT IMAGE     │     │  GENERATED PREVIEW  │            │
│  │                     │     │                     │            │
│  │                     │     │                     │            │
│  └─────────────────────┘     └─────────────────────┘            │
│                                                                  │
│  [Prompt textarea: "Luxury automotive showroom..."]             │
│                                                                  │
│  [✓ Replace]  [↻ Regenerate]  [✕ Cancel]                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              EDGE FUNCTION: generate-static-image               │
├─────────────────────────────────────────────────────────────────┤
│  1. Recibe: imageId, prompt, globalStylePrompt                  │
│  2. Combina: globalStyle + localPrompt                          │
│  3. Llama: Lovable AI Gateway (gemini-2.5-flash-image)          │
│  4. Retorna: base64 imageData                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              EDGE FUNCTION: replace-static-image                │
├─────────────────────────────────────────────────────────────────┤
│  1. Recibe: imageId, base64Data, originalPath                   │
│  2. Sube: a bucket "static-images" con mismo nombre             │
│  3. Actualiza: cache headers para invalidación                  │
│  4. Retorna: publicUrl (mismo path, archivo nuevo)              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fuente de Datos: Static Image Registry

Ya existe `src/config/staticImageRegistry.ts` con todas las imágenes de producto registradas. Este archivo será la fuente de datos:

- 50+ imágenes registradas
- Cada una tiene: id, currentPath, usage, purpose, aiEditable
- Solo imágenes con `aiEditable: true` aparecerán en el panel
- Ninguna imagen de usuario (vehicles, uploads, avatars, etc.)

---

## Componentes a Crear

### 1. Página Principal: ImageControlCenter.tsx

**Ubicación:** `src/pages/admin/ImageControlCenter.tsx`

**Estructura:**
- Header con título "Image Control Center"
- Global Style Prompt (textarea persistente en localStorage)
- Grid de tarjetas de imagen (responsive: 2-4 columnas)
- Cada tarjeta muestra: thumbnail, ID, ubicación de uso
- Botón "Edit" en cada tarjeta abre el modal de generación

### 2. Modal de Generación: ImageGenerationModal.tsx

**Ubicación:** `src/components/admin/ImageGenerationModal.tsx`

**Flujo:**
1. Vista lado a lado: Current vs Generated
2. Textarea para prompt específico
3. Botón "Generate" → llama edge function
4. Preview del resultado
5. Acciones: Replace | Regenerate | Cancel

### 3. Edge Function: replace-static-image

**Ubicación:** `supabase/functions/replace-static-image/index.ts`

**Responsabilidades:**
- Recibir base64 + metadata
- Convertir a archivo binario
- Subir a Supabase Storage bucket "static-images"
- Usar `upsert: true` para sobrescribir
- Retornar URL pública

---

## Flujo de Reemplazo de Imagen

```text
1. Admin escribe prompt
2. Click "Generate"
3. Edge function llama Lovable AI → base64
4. Se muestra preview lado a lado
5. Admin click "Replace"
6. Edge function sube a storage con upsert
7. URL permanece igual, archivo es nuevo
8. Cache invalidation automática
9. Toda la plataforma ve la nueva imagen
```

---

## Storage Bucket: static-images

Se creará un nuevo bucket público para almacenar las imágenes de producto:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('static-images', 'static-images', true, 10485760)
ON CONFLICT (id) DO NOTHING;
```

Políticas RLS:
- Lectura pública (cualquier usuario puede ver)
- Escritura solo para admins autenticados

---

## Archivos a Crear/Modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/pages/admin/ImageControlCenter.tsx` | **Crear** | Página principal del panel |
| `src/components/admin/ImageGenerationModal.tsx` | **Crear** | Modal de generación y preview |
| `supabase/functions/replace-static-image/index.ts` | **Crear** | Edge function para upload a storage |
| `supabase/config.toml` | **Modificar** | Registrar nueva edge function |
| `src/routes/AppRoutes.tsx` | **Modificar** | Agregar ruta /admin/image-control |
| `supabase/migrations/[timestamp].sql` | **Crear** | Bucket y políticas RLS |

---

## Estilo Visual

Diseño premium inspirado en Stripe/Linear/Vercel:

- Fondo oscuro con cards elevadas
- Bordes sutiles, shadows suaves
- Tipografía limpia y espaciosa
- Transiciones suaves en hover
- Loading states con skeleton/spinner
- Feedback visual claro (toasts)

---

## Lo Que NO Se Modificará

- Ningún componente de UI existente
- Ninguna ruta de usuario
- Ningún sistema de almacenamiento de vehículos/auctions
- Ningún archivo fuera del alcance admin
- Cero efectos secundarios en el producto principal

---

## Sección Técnica

### Edge Function: generate-static-image (existente)

Ya existe y funciona correctamente. Usa:
- `LOVABLE_API_KEY` (auto-configurado)
- `google/gemini-2.5-flash-image`
- Retorna base64 imageData

### Edge Function: replace-static-image (nueva)

```typescript
// Pseudocódigo
serve(async (req) => {
  const { imageId, base64Data, targetPath } = await req.json();
  
  // Convertir base64 a blob
  const blob = base64ToBlob(base64Data);
  
  // Subir a storage con upsert
  const { data, error } = await supabase.storage
    .from('static-images')
    .upload(targetPath, blob, {
      upsert: true,
      contentType: 'image/png',
      cacheControl: '0' // Sin cache para ver cambios inmediatos
    });
  
  // Retornar URL pública
  return { publicUrl: supabase.storage.from('static-images').getPublicUrl(targetPath) };
});
```

### Persistencia del Global Style

- Almacenado en localStorage
- Key: `imageControlCenter_globalStyle`
- Se precarga al abrir la página
- Se aplica automáticamente a cada generación

