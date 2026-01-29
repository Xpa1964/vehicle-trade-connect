
# Image Control Center - Rediseño a Grid de Tarjetas

## Resumen

Rediseñar el Image Control Center para mostrar **todas las imágenes en un grid de tarjetas** (similar al diseño de referencia), donde cada imagen tiene sus propios controles de generación, eliminación y carga manual.

---

## Diseño Visual (Basado en Screenshots de Referencia)

```text
┌────────────────────────────────────────────────────────────────────────────┐
│  🎨 IMAGE CONTROL CENTER                                                   │
│  Gestiona y regenera imágenes estáticas del producto                       │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ◉ Probar Nuevo Estilo (Sin guardar)                                │   │
│  │  Prueba diferentes prompts para ver el resultado antes de aplicar   │   │
│  │                                                                      │   │
│  │  Prompt Global:                                                      │   │
│  │  ┌───────────────────────────────────────────────────────────────┐  │   │
│  │  │ Dark, cinematic automotive marketplace style, premium...       │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  │                                                                      │   │
│  │  Categoría de Prueba:  [▼ Home Page        ]                        │   │
│  │                                                                      │   │
│  │  [            ◉ Probar Estilo             ]                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  Estado de las Imágenes:  45 de 52 imágenes tienen archivo                 │
│                                                                            │
│  [ 🎨 Generar Todas las Faltantes ] [ 🗑️ Eliminar Todas las Imágenes ]    │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│  GRID DE IMÁGENES (2-4 columnas responsive)                               │
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │  home.hero       │  │  services.show   │  │  dashboard.veh   │         │
│  │  ✓ Con imagen    │  │  ✓ Con imagen    │  │  ⚠ Sin imagen    │         │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌──────────────┐ │         │
│  │ │              │ │  │ │              │ │  │ │  placeholder │ │         │
│  │ │   [imagen]   │ │  │ │   [imagen]   │ │  │ │              │ │         │
│  │ │              │ │  │ │              │ │  │ │              │ │         │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ └──────────────┘ │         │
│  │                  │  │                  │  │                  │         │
│  │ Zoom: ──●── 100% │  │ Zoom: ──●── 100% │  │ Zoom: ──●── 100% │         │
│  │ [Guardar zoom  ] │  │ [Guardar zoom  ] │  │ [Guardar zoom  ] │         │
│  │                  │  │                  │  │                  │         │
│  │ [🗑️ Eliminar   ] │  │ [🗑️ Eliminar   ] │  │ [🗑️ Eliminar   ] │         │
│  │ [📤 Subir      ] │  │ [📤 Subir      ] │  │ [📤 Subir      ] │         │
│  │ [✨ Generar IA ] │  │ [✨ Generar IA ] │  │ [✨ Generar IA ] │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Componentes del Nuevo Diseño

### 1. Sección Superior: Probar Nuevo Estilo

- **Prompt Global** - Textarea con el estilo común para todas las generaciones
- **Categoría de Prueba** - Dropdown para seleccionar qué categoría probar
- **Botón "Probar Estilo"** - Genera una imagen de ejemplo de esa categoría

### 2. Estado y Acciones Masivas

- **Contador** - "X de Y imágenes tienen archivo"
- **Generar Todas las Faltantes** - Genera con IA todas las que no tienen imagen
- **Eliminar Todas** - Elimina todas las imágenes (con confirmación)

### 3. Grid de Tarjetas de Imagen

Cada tarjeta incluye:

| Elemento | Descripción |
|----------|-------------|
| **ID** | Nombre técnico (ej: `home.hero`) |
| **Categoría** | Badge con la categoría |
| **Badge estado** | "✓ Con imagen" (verde) o "⚠ Sin imagen" (naranja) |
| **Preview** | La imagen actual o placeholder |
| **Slider de Zoom** | Control 0-200% para ajustar visualización |
| **Botón Guardar zoom** | Persiste el nivel de zoom |
| **Botón Eliminar** | Elimina la imagen actual (rojo) |
| **Botón Subir** | Permite subir imagen manualmente (input file) |
| **Botón Generar IA** | Abre modal para escribir prompt específico y generar |

---

## Modal de Generación Individual

Cuando el usuario hace clic en "Generar IA" en una tarjeta:

```text
┌─────────────────────────────────────────────────────────────┐
│  ✨ Generar imagen: home.hero                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────┐     ┌────────────────────┐         │
│  │   IMAGEN ACTUAL    │     │  IMAGEN GENERADA   │         │
│  │                    │     │                    │         │
│  └────────────────────┘     └────────────────────┘         │
│                                                             │
│  Prompt específico para esta imagen:                        │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Luxury sports car in dramatic spotlight...             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ℹ️ El prompt global se añade automáticamente              │
│                                                             │
│  [ Cancelar ]  [ Regenerar ]  [ ✓ Aceptar y Reemplazar ]   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de Trabajo

1. **Ver todas las imágenes** → Grid muestra estado actual de cada una
2. **Identificar faltantes** → Badge naranja "Sin imagen"
3. **Generar individual** → Clic en "Generar IA" → Modal con prompt → Generar → Aceptar/Rechazar
4. **Subir manual** → Clic en "Subir" → Selector de archivos → Upload
5. **Eliminar** → Clic en "Eliminar" → Confirmación → Elimina de storage
6. **Acciones masivas** → Generar todas las faltantes o eliminar todas

---

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/pages/admin/ImageControlCenter.tsx` | Rediseño completo: Grid de tarjetas + sección superior + modal de generación |
| `src/components/admin/ImageGenerationModal.tsx` | Ya existe, se reutiliza para el modal individual |

---

## Persistencia de Datos

| Dato | Almacenamiento |
|------|----------------|
| Prompt global | localStorage (`imageControlCenter_globalStyle`) |
| Prompts individuales | localStorage (`imageControlCenter_imagePrompts`) |
| Niveles de zoom | localStorage (`imageControlCenter_zoomLevels`) |
| Imágenes | Supabase Storage (`static-images` bucket) |

---

## Sección Técnica

### Detección de "Con imagen" vs "Sin imagen"

Se validará si la imagen carga correctamente:

```typescript
const [imageStatus, setImageStatus] = useState<Record<string, boolean>>({});

// Al cargar cada imagen
<img 
  onLoad={() => setImageStatus(prev => ({...prev, [img.id]: true}))}
  onError={() => setImageStatus(prev => ({...prev, [img.id]: false}))}
/>
```

### Upload Manual de Imagen

```typescript
const handleManualUpload = async (file: File, imageId: string) => {
  const { data, error } = await supabase.storage
    .from('static-images')
    .upload(`manual/${imageId}/${file.name}`, file, { upsert: true });
  // Actualizar registry path...
};
```

### Slider de Zoom (CSS Transform)

```typescript
<div style={{ transform: `scale(${zoomLevel / 100})` }}>
  <img src={imagePath} />
</div>
```
