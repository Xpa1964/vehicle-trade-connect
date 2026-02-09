

# Plan: Migración Completa de Imágenes al Image Control Center + Dark Theme en Formulario de Vehículos

## Resumen Ejecutivo

Se realizará una auditoría y corrección total en **2 frentes** según lo solicitado:

1. **Tema Dark en Publicar Vehículo**: Reemplazar todas las clases `bg-white`, `bg-gray-*`, `text-gray-*`, `bg-blue-*`, `bg-green-*` por tokens semánticos del design system (bg-card, bg-muted, text-muted-foreground, bg-primary, bg-success, etc.)

2. **Integrar TODAS las imágenes de producto al Image Control Center**: Cada página interior del panel (ver/publicar vehículo, subastas, intercambios, tablón, transporte, informes, calculadoras, blog) pasará de rutas hardcodeadas (`/lovable-uploads/...`, `/images/...`, `@/assets/...`) a usar `SafeImage` o `useStaticImage` con IDs del registro.

---

## Parte 1: Formulario de Vehículo — Dark Theme

### Archivos a modificar (13 archivos)

| Archivo | Cambios principales |
|---------|---------------------|
| `VehicleFormScrollSections.tsx` | Reemplazar `bg-white`, `text-gray-*`, `bg-blue-*`, `bg-green-*` por tokens |
| `BottomNavigation.tsx` | `bg-white` → `bg-card`, `border-gray-*` → `border-border`, `bg-blue-500` → `bg-primary` |
| `FormTabs.tsx` | `text-green-*` → `text-success`, `bg-green-50` → `bg-success/10`, `text-gray-*` → `text-muted-foreground` |
| `MultipleImageUpload.tsx` | `border-gray-300` → `border-border`, `text-gray-*` → `text-muted-foreground` |
| `FileUpload.tsx` | `bg-gray-50` → `bg-muted` |
| `DamagesSection.tsx` | `bg-gray-100 text-gray-800` → `bg-muted text-muted-foreground` |
| `TabNavigation.tsx` | `bg-green-100` → `bg-success/10`, `text-gray-400` → `text-muted-foreground` |
| `ImagePreviewGrid.tsx` | `border-gray-200` → `border-border` |
| `EquipmentCategoryList.tsx` | `text-gray-500` → `text-muted-foreground` |
| `UploadForm.tsx` | `bg-white` → `bg-card` |

### Mapeo de tokens

```text
bg-white              → bg-card
bg-gray-50            → bg-muted
border-gray-200/300   → border-border
text-gray-400/500/600 → text-muted-foreground
text-gray-900         → text-foreground
bg-blue-500           → bg-primary
bg-green-500          → bg-success
text-green-600        → text-success
bg-green-50           → bg-success/10
```

---

## Parte 2: Integración de Imágenes al Registry (26 páginas)

### Nuevas entradas del registro (a añadir)

Se añadirán las siguientes entradas en `staticImageRegistry.ts`:

```text
ID                         | Página(s)                    | Ruta actual
---------------------------|------------------------------|-----------------------------
hero.transport             | Transport.tsx                | /lovable-uploads/04839c38...
hero.transport.express     | TransportExpressPage.tsx     | @/assets/transport-image.png
hero.transport.quotes      | TransportQuoteManagement.tsx | @/assets/transport-quotes-image.png
hero.bulletin              | BulletinHero.tsx             | /images/bulletin-board.png
hero.bulletin.publish      | PublishAnnouncementPage.tsx  | @/assets/announcement-image.png
hero.reports               | VehicleReportsInfoPage.tsx   | /images/vehicle-reports-hero.png
hero.reports.delivery      | VehicleReports.tsx           | @/assets/report-delivery-image.png
hero.reports.request       | RequestReport.tsx            | (misma imagen)
hero.exchange.form         | ExchangeForm.tsx             | /lovable-uploads/exchange-header.png
hero.import.calculator     | ImportCalculator.tsx         | /lovable-uploads/ba9a7ade...
hero.commission.calculator | CommissionCalculatorPage.tsx | /lovable-uploads/379e75ed...
hero.blog                  | BlogMainPage.tsx             | /lovable-uploads/eec67196...
hero.messaging             | MessagingInfoPage.tsx        | /images/messaging-chat.png
hero.api.management        | APIManagement.tsx (admin)    | @/assets/api-keys-image.png
logo.form                  | VehicleFormHeader.tsx        | LOGO_IMAGES.primary
hero.dashboard.header      | DashboardHeader.tsx          | /lovable-uploads/e8bcfe5d...
info.gallery.view          | VehicleGalleryInfoPage.tsx   | (ya existe)
info.gallery.detail        | VehicleGalleryInfoPage.tsx   | (ya existe)
info.gallery.form          | VehicleGalleryInfoPage.tsx   | (ya existe)
```

### Páginas a migrar (resumen por sección del panel)

**Vehículos**
- `VehicleManagement.tsx` ✅ ya usa `useStaticImage('hero.vehicles')`
- `VehicleGalleryInfoPage.tsx` ✅ ya usa registry (showroom, gallery.view, gallery.detail, gallery.form)

**Subastas**
- `LiveAuctionsPage.tsx` ✅ ya usa `useStaticImage('hero.auctions')`
- `PublishAuctionPage.tsx` ✅ ya usa `SafeImage imageId="hero.auctions"`
- `AuctionsInfoPage.tsx` ⚠️ usa `/images/auctions-hero.png` hardcodeado → migrar

**Intercambios**
- `Exchanges.tsx` ✅ ya usa `SafeImage imageId="hero.exchanges"`
- `ExchangeForm.tsx` ⚠️ usa `/lovable-uploads/exchange-header.png` → migrar
- `ExchangesInfoPage.tsx` ✅ ya usa `useStaticImage('services.exchanges')`

**Tablón de Anuncios**
- `BulletinBoard.tsx` ✅ delega al componente `BulletinHero` (necesita verificar)
- `PublishAnnouncementPage.tsx` ⚠️ usa `@/assets/announcement-image.png` → migrar
- `BulletinInfoPage.tsx` ✅ ya usa `useStaticImage('services.bulletin')`

**Transporte**
- `Transport.tsx` ⚠️ usa `/lovable-uploads/04839c38...` hardcodeado → migrar
- `TransportExpressPage.tsx` ⚠️ usa `@/assets/transport-image.png` → migrar
- `TransportQuoteManagement.tsx` ⚠️ usa `@/assets/transport-quotes-image.png` → migrar

**Informes**
- `VehicleReports.tsx` ⚠️ usa `@/assets/report-delivery-image.png` → migrar
- `RequestReport.tsx` ⚠️ misma imagen → migrar
- `VehicleReportsInfoPage.tsx` ⚠️ usa `/images/vehicle-reports-hero.png` → migrar

**Calculadoras**
- `ImportCalculator.tsx` ⚠️ usa `/lovable-uploads/ba9a7ade...` → migrar
- `CommissionCalculatorPage.tsx` ⚠️ usa `/lovable-uploads/379e75ed...` → migrar

**Blog**
- `BlogMainPage.tsx` ⚠️ usa `/lovable-uploads/eec67196...` → migrar

**Mensajería**
- `MessagingInfoPage.tsx` ⚠️ usa `/images/messaging-chat.png` → migrar

**Admin**
- `APIManagement.tsx` ⚠️ usa `@/assets/api-keys-image.png` → migrar
- `DashboardHeader.tsx` ⚠️ usa `/lovable-uploads/e8bcfe5d...` → migrar

---

## Parte 3: Copiar assets de src/assets a public/assets

Para que los paths del registry funcionen con imágenes bundleadas, se copiarán estos archivos a `public/assets`:

- `transport-image.png`
- `transport-quotes-image.png`
- `report-delivery-image.png`
- `announcement-image.png`
- `api-keys-image.png`

Y se actualizará el registry con paths `"/assets/..."`.

---

## Secuencia de Implementación

### Batch 1: Dark Theme (Formulario de Vehículos)
1. Modificar `VehicleFormScrollSections.tsx`
2. Modificar `BottomNavigation.tsx`
3. Modificar `FormTabs.tsx`
4. Modificar `MultipleImageUpload.tsx`
5. Modificar `FileUpload.tsx`, `DamagesSection.tsx`, etc.

### Batch 2: Registry + Páginas (Imágenes)
1. Añadir 18 nuevas entradas al registry
2. Copiar assets a `public/assets`
3. Migrar cada página (usar `SafeImage imageId` o `useStaticImage`)
4. Eliminar imports de `@/assets/...` y `@/constants/imageAssets`

### Batch 3: Validación
1. Verificar que Image Control Center muestra todas las nuevas imágenes
2. Verificar que el formulario de vehículos es Dark Pro
3. Probar navegación en móvil

---

## Notas Técnicas

### Sobre rutas `src/assets/`
El bundler de Vite no expone `src/assets` como rutas en runtime. Por eso:
- Si el registry usa `currentPath: "/assets/foo.png"`, ese archivo debe existir en `public/assets/foo.png`
- O se puede usar imports ES6 y asignar al registry como string

### Sobre cache-busting
El sistema ya usa `?v=fileName` para cache-busting. Se mantendrá ese patrón.

### Sobre el preloader
El `criticalImagePreloader.ts` ya omite paths `src/assets/`. No se requieren cambios allí.

