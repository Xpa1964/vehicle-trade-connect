

## Plan: Sidebar lateral izquierdo para Step 2 (Datos Técnicos)

### Problema
Las 4 sub-pestañas horizontales en el Paso 2 del wizard (Especificaciones, Transacción, Equipamiento, Daños) son prácticamente invisibles. El usuario no las detecta y pierde información importante.

### Solución
Reemplazar las `Tabs` horizontales en `Step2TechnicalDetails.tsx` por un layout de **dos columnas**: sidebar fijo a la izquierda + contenido a la derecha.

### Diseño

```text
┌──────────────────────────────────────────────────┐
│  Paso 2: Datos Técnicos (wizard header)          │
├────────────────┬─────────────────────────────────┤
│                │                                 │
│  ⚙ Espec.  ◀──│   [Contenido de la sección      │
│  💳 Transac.   │    seleccionada]                │
│  📦 Equip.     │                                 │
│  ⚠ Daños       │                                 │
│                │                                 │
├────────────────┴─────────────────────────────────┤
```

- **Desktop (md+)**: Sidebar fijo ~220px a la izquierda con botones verticales (icono + texto). Cada botón con estado activo (borde izquierdo naranja + fondo highlight). Contenido ocupa el resto.
- **Mobile**: El sidebar se convierte en una barra horizontal scrollable o se apila encima del contenido para mantener la usabilidad.

### Cambios técnicos

**Archivo a modificar**: `src/components/vehicles/wizard/Step2TechnicalDetails.tsx`

1. Reemplazar el componente `Tabs` horizontal por un layout flex con estado local `useState` para la sección activa.
2. Crear un sidebar con 4 botones verticales estilizados:
   - Icono grande visible (Settings, CreditCard, Package, AlertTriangle)
   - Texto descriptivo debajo o al lado
   - Estado activo con `border-l-2 border-primary bg-primary/10`
   - Estado hover sutil
3. Renderizado condicional del contenido según la sección seleccionada.
4. En mobile (`< md`): los botones del sidebar se muestran como una fila horizontal con scroll, o como acordeón.

### Estilo visual
- Fondo del sidebar: `bg-card/50` con `border-r border-border`
- Botón activo: `border-l-3 border-primary bg-primary/10 text-primary`
- Botón inactivo: `text-muted-foreground hover:bg-muted/50`
- Iconos siempre visibles, tamaño `h-5 w-5`
- Tipografía: `text-sm font-medium`

