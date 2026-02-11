

## Plan: Eliminar mascaras, agregar card API Key y resolver carrusel de vehiculos

### Problema 1: Mascaras en titulos y textos de las paginas interiores

Actualmente, 17 paginas dentro del panel de control usan contenedores con `bg-black/20 backdrop-blur-sm` (mascaras semitransparentes) sobre los titulos y subtitulos en las secciones hero. Se eliminaran estas mascaras de todas las paginas afectadas, dejando el texto directamente sobre la imagen con `text-shadow` o `drop-shadow` para mantener la legibilidad.

**Paginas afectadas:**
- `src/pages/APIManagement.tsx`
- `src/pages/BlogMainPage.tsx`
- `src/pages/VehicleReports.tsx`
- `src/pages/VehicleReportsInfoPage.tsx`
- `src/pages/Transport.tsx`
- `src/pages/TransportQuoteManagement.tsx`
- `src/pages/ExchangeForm.tsx`
- `src/pages/ExchangesInfoPage.tsx`
- `src/pages/RequestReport.tsx`
- `src/pages/CommissionCalculatorPage.tsx`
- `src/pages/MessagingInfoPage.tsx`
- `src/pages/auctions/PublishAuctionPage.tsx`
- Y otras paginas con el mismo patron

**Cambio:** Reemplazar los `div` con `bg-black/XX backdrop-blur-sm rounded-lg p-4 border border-white/10` por contenedores sin fondo, aplicando `drop-shadow-lg` al texto para legibilidad.

---

### Problema 2: Card de API Key en el Panel de Control

El panel de control (`src/pages/admin/ControlPanel.tsx`) ya tiene una entrada para "Gestion de APIs" en la seccion "Administracion" (linea 201), pero usa `imageId: 'admin.apikeys'` en lugar de un icono. Se cambiara para usar el icono `Key` que ya esta importado pero no se usa.

**Cambio:** Reemplazar `imageId: 'admin.apikeys'` por `icon: Key` en el item de API Management.

---

### Problema 3: Carrusel de vehiculos no funciona

La tabla `vehicle_images` esta **completamente vacia**. Los 5 vehiculos migrados solo tienen la imagen principal (`thumbnailurl`) pero no se importaron las imagenes adicionales a la tabla `vehicle_images`. Por eso el carrusel no aparece (solo se muestra cuando hay mas de 1 imagen).

**Solucion:** Crear registros en `vehicle_images` a partir de las URLs de `thumbnailurl` existentes para que al menos la imagen principal aparezca en la galeria. Ademas, las imagenes apuntan al storage de otro proyecto Supabase (`inqqnsvlimtpjxjxuzaf`), por lo que seguiran funcionando como enlaces externos pero no podran gestionarse localmente.

Se insertaran los 5 registros correspondientes con `is_primary = true` para cada vehiculo existente.

---

### Detalles tecnicos

1. **Mascaras** - Editar ~15 archivos `.tsx` eliminando los contenedores `bg-black/XX backdrop-blur-sm` y aplicando clases de sombra al texto (`drop-shadow-lg`, `[text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]`).

2. **Card API Key** - Edicion minima en `ControlPanel.tsx`, linea 201: cambiar `imageId` por `icon: Key`.

3. **Vehicle images** - Migracion SQL para insertar 5 registros en `vehicle_images` usando los `thumbnailurl` de los vehiculos existentes, con `is_primary = true` y `display_order = 0`.

