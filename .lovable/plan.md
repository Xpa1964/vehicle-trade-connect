
# Plan: Auditoría del Image Control Center + Corrección de Estilo Dark

## Problema 1: Cards del Panel de Control con Estilo Claro

### Diagnóstico
El componente `DashboardServiceCard.tsx` usa `bg-card`, que según el CSS debería ser dark (#161B2A). Si aparece claro, necesitamos verificar que no haya conflictos de estilos.

### Solución
Forzar explícitamente el estilo dark en el componente para garantizar consistencia:
```tsx
// Antes
<div className="group overflow-hidden rounded-xl border border-border bg-card">

// Después - forzar dark theme tokens
<div className="group overflow-hidden rounded-xl border border-border bg-[hsl(222,33%,13%)]">
```

O mejor, añadir clases redundantes para garantizar el tema:
```tsx
<div className="group overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
```

---

## Problema 2: Qué son `messaging.placeholder.es/en/de`

### Explicación
Son imágenes **registradas pero NO usadas**:
- Definidas en `staticImageRegistry.ts` líneas 465-562
- Documentadas para `ChatPlaceholder.tsx`
- El componente real (`EmptyChatPlaceholder.tsx`) usa un icono, NO estas imágenes
- Son ilustraciones localizadas por idioma que **nunca se implementaron**

### Decisión Requerida
Opciones:
1. **Eliminarlas del registry** (si no se van a usar)
2. **Implementar su uso** en EmptyChatPlaceholder (mostrar imagen localizada)

---

## Problema 3: Páginas que Faltan en el Image Control Center

### Imágenes a Añadir al Registry

```text
1. exchanges.hero → /images/exchanges-hero.png
   - Usado en: src/pages/Exchanges.tsx
   - Propósito: Hero de la página de Intercambios

2. auctions.hero → /images/auctions-hero.png (ya existe services.auctions)
   - Usado en: AuctionsInfoPage.tsx, PublishAuctionPage.tsx, LiveAuctionsPage.tsx
   - Propósito: Hero de páginas de subastas

3. reports.hero → /images/vehicle-reports-hero.png
   - Usado en: VehicleReportsInfoPage.tsx
   - Propósito: Hero de informes de vehículos

4. info.gallery.view → /images/gallery-view.png
   - Usado en: VehicleGalleryInfoPage.tsx
   - Propósito: Ilustración de vista de galería

5. info.gallery.detail → /images/vehicle-detail.png
   - Usado en: VehicleGalleryInfoPage.tsx
   - Propósito: Ilustración de detalle de vehículo

6. info.gallery.form → /images/vehicle-form.png
   - Usado en: VehicleGalleryInfoPage.tsx
   - Propósito: Ilustración de formulario de vehículo

7. auth.logo → /lovable-uploads/a645acd2-f5c2-4f99-be3b-9d089c634c3c.png
   - Usado en: Login.tsx, Register.tsx
   - Propósito: Logo en páginas de autenticación

8. error.404 → (nueva imagen a generar)
   - Usado en: NotFound.tsx
   - Propósito: Ilustración de página no encontrada
```

---

## Archivos a Modificar

### 1. `src/config/staticImageRegistry.ts`
- Añadir las 8 nuevas entradas al registry
- (Opcional) Eliminar o marcar como deprecated las imágenes de messaging.placeholder si no se usarán

### 2. `src/components/dashboard/DashboardServiceCard.tsx`
- Garantizar estilo dark explícito
- Añadir `text-card-foreground` para consistencia

### 3. Páginas que usan imágenes hardcodeadas (opcional, fase 2)
- `src/pages/Exchanges.tsx` → usar `useStaticImage('exchanges.hero')`
- `src/pages/auctions/*.tsx` → usar `useStaticImage('auctions.hero')`
- `src/pages/VehicleReportsInfoPage.tsx` → usar `useStaticImage('reports.hero')`
- `src/pages/NotFound.tsx` → rediseñar con estilo dark + imagen del registry

---

## Resumen de Cambios

| Archivo | Cambio |
|---------|--------|
| `staticImageRegistry.ts` | +8 nuevas entradas de imágenes |
| `DashboardServiceCard.tsx` | Forzar estilo dark theme |
| (Fase 2) Páginas con imágenes hardcoded | Migrar a useStaticImage |

---

## Notas Técnicas

### Sobre las imágenes `messaging.placeholder.*`
Estas 9 imágenes (es, en, fr, it, pt, de, nl, pl, dk) fueron registradas para un sistema de placeholders localizados que **nunca se implementó**. El componente `EmptyChatPlaceholder.tsx` usa un simple icono en su lugar.

Ubicación de las imágenes:
- `/lovable-uploads/8d67f46e-d1c0-4b17-89f7-aebb88ccb8d3.png` (ES)
- `/lovable-uploads/8bed91df-a428-49d0-b2cb-d08fc5c92b9e.png` (EN)
- `/lovable-uploads/3ad30d4e-64f5-418a-a430-c3e8f53d72e5.png` (DE)
- etc.

Si se decide implementar, `EmptyChatPlaceholder.tsx` necesitaría:
```tsx
const { currentLanguage } = useLanguage();
const { src } = useStaticImage(`messaging.placeholder.${currentLanguage}`);
// ... mostrar <img src={src} /> en lugar del icono
```
