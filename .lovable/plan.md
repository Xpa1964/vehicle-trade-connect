
# Plan de Unificación Visual: Tema Oscuro Profesional

## Diagnóstico del Problema

Tras analizar el código, he identificado las siguientes inconsistencias:

### Problema Principal
Hay **2076+ referencias a colores hardcodeados** (`bg-white`, `text-gray-XXX`, `border-gray-XXX`) dispersas en **167+ archivos** que contradicen el sistema de tokens de tema oscuro definido en `index.css`.

### Tokens Definidos vs. Uso Real

| Token Definido | Valor Hex | Uso Esperado | Problema |
|----------------|-----------|--------------|----------|
| `bg-background` | #0B0F1A | Fondo base | Se usa `bg-white`, `bg-gray-50` |
| `bg-card` | #161B2A | Cards/contenedores | Se usa `bg-white` |
| `bg-secondary` | #1E2436 | Superficies secundarias | Se usa `bg-gray-100/200` |
| `border-border` | #2D3748 | Bordes | Se usa `border-gray-200/300` |
| `text-foreground` | #F8FAFC | Texto principal | Se usa `text-gray-800/900` |
| `text-muted-foreground` | #94A3B8 | Texto secundario | Se usa `text-gray-600/700` |

### Archivos con Más Inconsistencias
1. Páginas (`/src/pages/`) - 40+ archivos
2. Componentes de mensajes (`/src/components/messages/`)
3. Componentes de admin (`/src/components/admin/`)
4. Componentes de home (`/src/components/home/`)
5. Componentes de layout (`/src/components/layout/`)

---

## Plan de Implementación

### Fase 1: Componentes Base UI (Fundación)
**Prioridad: Crítica | Impacto: Alto**

Corregir los componentes base de `src/components/ui/` que afectan a toda la aplicación:

| Archivo | Cambios |
|---------|---------|
| `input.tsx` | `border-red-600 bg-red-50` -> `border-destructive bg-destructive/10` |
| `card.tsx` | Ya correcto (verificado) |
| `button.tsx` | Ya correcto (verificado) |
| `badge.tsx` | Ya correcto (verificado) |
| `tabs.tsx` | Ya correcto (verificado) |
| `select.tsx` | Ya correcto (verificado) |
| `dropdown-menu.tsx` | Ya correcto (usa `bg-popover`) |
| `table.tsx` | Ya correcto (verificado) |

### Fase 2: Layout Principal
**Prioridad: Alta | Impacto: Alto**

| Archivo | Cambios |
|---------|---------|
| `Footer.tsx` | `bg-gray-900` -> `bg-card`, `text-gray-300/400` -> `text-muted-foreground` |
| `NavbarContainer.tsx` | Verificar consistencia con tokens |
| `UserMenu.tsx` | `text-gray-700`, `hover:bg-gray-50` -> `text-foreground`, `hover:bg-secondary` |
| `MobileMenu.tsx` | Verificar y actualizar |
| `AdminLayout.tsx` | Verificar y actualizar |

### Fase 3: Páginas Principales
**Prioridad: Alta | Impacto: Alto**

| Archivo | Cambios |
|---------|---------|
| `Home.tsx` | Verificar componentes hijos |
| `CallToAction.tsx` | `bg-slate-200/300` -> `bg-card/secondary`, `text-gray-800/600` -> `text-foreground/muted-foreground` |
| `ContactPage.tsx` | Aplicar tokens globales |
| `CommunityPage.tsx` | Aplicar tokens globales |
| `Login.tsx` | `text-gray-600` -> `text-muted-foreground` |
| `Dashboard.tsx` y `DashboardMainPage.tsx` | `bg-gray-50` -> `bg-background` |

### Fase 4: Componentes de Mensajería
**Prioridad: Media | Impacto: Alto**

| Archivo | Cambios |
|---------|---------|
| `ConversationHeader.tsx` | `bg-white`, `border-gray-200`, `text-gray-500` -> tokens oscuros |
| `MessageInput.tsx` | `border-gray-300` -> `border-border` |
| `MessageHistory.tsx` | `text-gray-600`, `bg-gray-100` -> tokens oscuros |

### Fase 5: Componentes Admin
**Prioridad: Media | Impacto: Medio**

| Archivo | Cambios |
|---------|---------|
| `AlertsPanel.tsx` | `text-gray-900` -> `text-foreground` |
| `Exchanges.tsx` | `text-gray-900/600` -> tokens oscuros |
| `RecipientsSummary.tsx` | `bg-gray-200` -> `bg-secondary` |

### Fase 6: Componentes de Vehículos y Subastas
**Prioridad: Media | Impacto: Medio**

Aplicar búsqueda y reemplazo sistemático en:
- `src/components/vehicles/`
- `src/components/auctions/`
- `src/components/bulletin/`

### Fase 7: Páginas Secundarias
**Prioridad: Baja | Impacto: Bajo**

Aplicar tokens a páginas menos visitadas:
- `AuctionsInfoPage.tsx`
- `BlogView.tsx`
- `PublishAuctionPage.tsx`
- Otras páginas info

---

## Reglas de Migración

### Tabla de Conversión de Colores

```text
FONDOS:
bg-white          -> bg-card
bg-gray-50        -> bg-card o bg-background
bg-gray-100       -> bg-secondary
bg-gray-200       -> bg-muted
bg-slate-200/300  -> bg-card

BORDES:
border-gray-200   -> border-border
border-gray-300   -> border-border

TEXTOS:
text-black        -> text-foreground
text-gray-900     -> text-foreground
text-gray-800     -> text-foreground
text-gray-700     -> text-muted-foreground
text-gray-600     -> text-muted-foreground
text-gray-500     -> text-muted-foreground

PLACEHOLDERS:
placeholder-gray-XXX -> placeholder:text-muted-foreground

ESTADOS DE ERROR:
bg-red-50         -> bg-destructive/10
border-red-500    -> border-destructive
text-red-800      -> text-destructive

ESTADOS DE ÉXITO:
bg-green-50       -> bg-success/10 o bg-green-500/10
text-green-800    -> text-[#22C55E]

ESTADOS DE ADVERTENCIA:
bg-amber-50       -> bg-warning/10 o bg-amber-500/10
text-amber-800    -> text-amber-400

HOVERS:
hover:bg-gray-100 -> hover:bg-secondary
hover:bg-gray-200 -> hover:bg-primary/10
hover:text-gray-900 -> hover:text-foreground
```

### Excepciones (No Modificar)
1. **Contenido para impresión** (`print:bg-white`) - mantener para legibilidad
2. **Elementos sobre imágenes hero** (`bg-black/50`, `text-white`) - correcto para contraste
3. **Footer** puede mantener `bg-gray-900` si se prefiere diferenciación

---

## Sección Técnica

### Estrategia de Implementación

1. **Componentes UI Base (5 min)**
   - Corregir `input.tsx` para estados de error

2. **Búsqueda y Reemplazo Global (30-45 min)**
   - Usar patrones de regex para migración masiva
   - Agrupar archivos por directorio
   - Aplicar cambios en paralelo

3. **Verificación Visual (10-15 min)**
   - Revisar páginas principales
   - Comprobar consistencia en navegación

### Archivos Críticos a Modificar (Estimado)
- **UI Base**: 1 archivo
- **Layout**: 5-6 archivos
- **Páginas**: 15-20 archivos
- **Componentes**: 40-50 archivos

### Tokens CSS Disponibles
Los tokens ya están definidos correctamente en `index.css`. El problema es que los componentes no los están usando consistentemente.

### Garantías
- No se modificará lógica de negocio
- No se alterará estructura DOM
- No se cambiarán props ni comportamientos
- Solo se actualizarán clases de Tailwind

---

## Resultado Esperado

Tras la implementación:
- Fondo base oscuro (#0B0F1A) en toda la aplicación
- Cards y contenedores con superficie oscura (#161B2A)
- Texto legible en blanco/gris claro
- Bordes sutiles y consistentes
- Navegación unificada con el tema
- Estados de hover/focus coherentes
- Colores semánticos (success, warning, error) con opacidades apropiadas
