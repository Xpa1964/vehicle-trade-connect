
# Aplicar estilo de clasificacion con celdas individuales a las fichas de vehiculos

## Resumen
Transformar la seccion de especificaciones tecnicas de los vehiculos del formato actual (texto plano con iconos en linea) al estilo de "celdas individuales con borde" que se ve en el mockup: una cuadricula 3x3 donde cada especificacion tiene su propia celda con fondo oscuro, borde sutil, icono y valor centrados.

## Componentes afectados

### 1. VehicleTechnicalData.tsx (Ficha de detalle del vehiculo)
- Reemplazar el grid actual de `grid-cols-3 gap-x-4 gap-y-3` con items en texto plano
- Cada especificacion se convierte en una celda individual con:
  - Fondo `bg-muted/50` con borde `border border-border`
  - Esquinas redondeadas `rounded-lg`
  - Padding interior `p-3`
  - Icono y valor centrados verticalmente
  - Texto del valor en blanco/foreground, etiqueta en muted

### 2. VehicleCard.tsx (Tarjetas en listados)
- Aplicar el mismo patron de celdas al grid de 2 columnas existente
- Cada dato (km, combustible, transmision, puertas) en su propia celda con borde
- Mantener el layout compacto adaptado al tamano de la tarjeta

### 3. VehicleDetailsCard.tsx (Card alternativa de detalles)
- Mismo tratamiento de celdas individuales para consistencia visual

## Detalles tecnicos

Estilo CSS de cada celda:
```
className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-3"
```

La estructura interna de cada celda:
```
<div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-3">
  <Icon className="h-4 w-4 text-primary/70 flex-shrink-0" />
  <span className="text-sm font-semibold text-foreground">{value}</span>
</div>
```

Se eliminan las etiquetas redundantes (ej: "Ano:", "Combustible:") y se deja solo el icono + valor, como en el mockup, para un aspecto mas limpio y visual.

## Archivos a modificar
- `src/components/vehicle/preview/VehicleTechnicalData.tsx` - Grid principal de la ficha
- `src/components/vehicle/VehicleCard.tsx` - Tarjetas del listado
- `src/components/vehicle/VehicleDetailsCard.tsx` - Card alternativa
