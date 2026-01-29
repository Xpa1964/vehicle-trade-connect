# Plan de Unificación Visual: Tema Oscuro Profesional

## ✅ Estado: IMPLEMENTACIÓN EN PROGRESO (Fase 3)

La migración del tema oscuro continúa. Se ha suavizado el color naranja primario para reducir la intensidad visual.

### 🔧 Correcciones Recientes (Fase 3):
- **Color primario suavizado**: De `25 95% 53%` a `28 80% 52%` (menos saturado)
- **Bulletin components migrados**: `PublishAnnouncementPage`, `AnnouncementList`, `AnnouncementItem`, `AnnouncementForm`
- **AuctionsInfoPage**: Cards migradas a `bg-card` con `border-border`
- **VehicleReports**: Estados de carga y filas migradas a tokens oscuros
- **DashboardNew**: Fondo y texto migrados a tokens semánticos

---

## Fases Completadas

### ✅ Fase 1: Componentes Base UI
- `input.tsx` - Estados de error con `border-destructive bg-destructive/10`
- `card.tsx`, `button.tsx`, `badge.tsx` - Ya correctos

### ✅ Fase 2: Layout Principal  
- `Footer.tsx` - `bg-card`, `text-muted-foreground`, `border-border`
- `NavbarContainer.tsx` - Tokens consistentes
- `UserMenu.tsx` - `hover:bg-secondary`, `text-foreground`
- `MobileMenu.tsx` - Tema oscuro aplicado
- `AdminLayout.tsx` - `bg-background`, `bg-card`

### ✅ Fase 3: Páginas Principales
- `Register.tsx` - `bg-background`, alertas con `bg-primary/10`
- `DashboardMainPage.tsx` - `bg-background`, `text-foreground`
- `ContactPage.tsx`, `CommunityPage.tsx` - Tokens globales

### ✅ Fase 4: Componentes de Mensajería
- `PageHeader.tsx` - `bg-card`, `text-primary`
- `MessageInput.tsx` - `border-border`, `bg-card`
- `ConversationsList.tsx` - `bg-card`, `border-border`
- `ConversationsListOptimized.tsx` - Secciones con tokens
- `MessageItem.tsx`, `MessageItemOptimized.tsx` - Burbujas con `bg-primary`/`bg-secondary`
- `NavigationHeader.tsx` - `bg-card`
- `EmptyChatPlaceholder.tsx` - `bg-secondary`, alertas con `bg-primary/10`
- `ConversationHeader.tsx` - Actualizado

### ✅ Fase 5: Componentes Admin
- `AdminDashboard.tsx` - Cards con colores semánticos de opacity
- `ActivityLogTable.tsx` - Badges con tokens de severity

### ✅ Fase 6: Componentes de Vehículos
- `SearchFilters.tsx` - `bg-card`, `border-border`
- `VehicleGalleryContent.tsx` - `text-muted-foreground`

### ✅ Fase 7: Componentes Home
- `CallToAction.tsx` - Gradientes con `from-secondary to-card`
- `FeaturesSection.tsx` - `bg-background`, cards con `bg-card`
- `ServiceCard.tsx` - `bg-card`, `border-border`
- `SectionHeader.tsx` - `text-muted-foreground`
- `AudioPresentationSection.tsx` - Botones con tokens

### ✅ Fase 8: Dashboard Components
- `DashboardMessaging.tsx` - Gradientes oscuros
- `UserInfoCard.tsx` - `bg-card`, `border-primary`
- `QuickActions.tsx` - `bg-card`, iconos con colores semánticos

---

## Tokens Aplicados

| Uso | Token |
|-----|-------|
| Fondo base | `bg-background` (#0B0F1A) |
| Cards/contenedores | `bg-card` (#161B2A) |
| Superficies secundarias | `bg-secondary` (#1E2436) |
| Bordes | `border-border` (#2D3748) |
| Texto principal | `text-foreground` (#F8FAFC) |
| Texto secundario | `text-muted-foreground` (75% luminosidad - más claro) |
| Acento primario | `text-primary` / `bg-primary` (naranja suavizado) |
| Estados error | `bg-destructive/10`, `text-destructive` |
| Estados éxito | `bg-success/10`, `text-[#22C55E]` |
| Estados warning | `bg-amber-400/10`, `text-amber-400` |

## Guía de Iconografía (Basado en Mockup)

| Propiedad | Valor Recomendado |
|-----------|-------------------|
| Tamaño base | `h-10 w-10` (en vez de h-12 w-12) |
| Grosor de trazo | `strokeWidth={1.5}` (más sutil) |
| Colores | Tonos -400 (blue-400, green-400, etc.) |
| Estilo | Minimalista, líneas finas |

---

## Excepciones Mantenidas
- Contenido para impresión (`print:bg-white`) - legibilidad
- Elementos sobre imágenes hero (`bg-black/50`, `text-white`) - contraste
- Indicadores de estado online (punto verde) - señal visual
