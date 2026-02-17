
# Rediseño Premium de la Ficha Técnica Descargable

## Resumen
Reemplazar el contenido HTML generado por `VehicleDataSheet.tsx` con un diseño premium tipo catálogo automotriz profesional, siguiendo el briefing proporcionado. No se crea ninguna página nueva; se sustituye el HTML que se abre en la ventana de impresión.

## Cambios en el diseño del PDF

### Header (Cabecera)
- Imagen hero del vehículo a gran tamaño (ancho completo, altura controlada con object-cover)
- Nombre del vehículo en tipografía grande y elegante
- Subtítulo: "Ficha técnica profesional del vehículo"
- Precio prominente con nota de IVA en un banner con gradiente naranja

### Key Information (Fila de datos clave)
- Fila horizontal con 5 tarjetas con iconos SVG inline:
  - Año, Kilometraje, Combustible, Transmisión, Ubicación
- Cada tarjeta con fondo gris claro, borde izquierdo naranja y sombra suave

### Descripcion del vehiculo
- Parrafo profesional con el campo `vehicle.description`

### Technical Details (Detalles tecnicos)
- Grid de 2 columnas con tarjetas tipo card con sombra suave:
  - Color, Combustible, Transmision, Kilometraje, VIN, Potencia, Cilindrada, Puertas, Emisiones CO2, Norma Euro, Acepta intercambios

### Equipment (Equipamiento)
- Lista con iconos check en verde para cada item
- Layout en 2-3 columnas

### Vehicle Condition (Estado del vehiculo)
- Card destacada con borde verde o rojo segun haya danos
- Texto: "Sin danos reportados" / lista de danos si los hay
- Badges: "Vehiculo revisado", "Disponible"

### Footer
- Logo Kontact VO centrado
- Texto: "Marketplace Automotriz Profesional"
- Fecha de generacion
- CTA: "Ver vehiculo en la plataforma"

## Detalles tecnicos

### Archivo a modificar
- `src/components/vehicle/VehicleDataSheet.tsx` - Unico archivo. Se reescribe el template HTML dentro de `handleDownloadPDF` con el nuevo diseno premium.

### Estructura del componente (sin cambios)
- Se mantiene el mismo flujo: boton "Descargar PDF" abre `window.open()` con HTML estilizado
- Se mantiene el hook `useEnhancedVehicleData` para obtener equipamiento, danos e imagen
- Se mantienen las traducciones existentes

### Estilo del nuevo HTML
- Fuente: Inter (Google Fonts)
- Colores: blanco (#ffffff), gris claro (#f8fafc), azul oscuro (#0f172a), acento naranja (#f97316)
- Cards con `border-radius: 12px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`
- Espaciado generoso (white space)
- Iconos SVG inline para los datos clave (sin dependencia de Lucide en el HTML de impresion)
- Layout responsivo para impresion A4
