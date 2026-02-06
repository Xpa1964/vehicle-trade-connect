
# Plan: Separar y Reposicionar Solo el Logo

## Objetivo
Mover **únicamente el logo naranja** para que quede posicionado encima del camión en la imagen de fondo, mientras el título "KONTACT" y el subtítulo permanecen exactamente donde están ahora.

## Cambio Principal

Actualmente el logo está dentro del mismo contenedor flex que el título, lo que los mantiene juntos. Necesitamos:

1. **Extraer el logo del contenedor actual** y convertirlo en un elemento con posición absoluta independiente
2. **Posicionarlo en la esquina superior derecha** de la sección hero, encima del área del camión

## Estructura Actual vs Nueva

```text
ACTUAL:
+------------------------------------------+
|  [LOGO] KONTACT                          |
|         Vehículos de Ocasión             |
|                              [CAMIÓN]    |
+------------------------------------------+

NUEVA:
+------------------------------------------+
|                              [LOGO]      |  ← Logo posicionado arriba del camión
|  KONTACT                                 |
|  Vehículos de Ocasión        [CAMIÓN]    |
+------------------------------------------+
```

## Cambios Técnicos en `src/components/home/HeroSection.tsx`

### 1. Sacar el logo del contenedor flex actual (líneas 52-62)
- Mover el `<div>` del logo fuera del contenedor de texto
- Convertirlo en un elemento con `position: absolute`

### 2. Posicionar el logo independientemente
- Añadir clases de posicionamiento: `absolute top-24 right-8` (ajustable)
- El logo quedará flotando sobre el área del camión

### 3. Mantener el contenedor de texto intacto
- El título y subtítulo permanecen exactamente donde están
- Solo se elimina el logo de ese contenedor

## Código Resultante (simplificado)

```jsx
{/* Logo independiente - posicionado encima del camión */}
<div className="absolute top-24 right-8 lg:right-16 xl:right-24 z-20">
  <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
    <SimpleImage src={kontactLogoHero} ... />
  </div>
</div>

{/* Contenedor de texto SIN el logo */}
<div className="flex flex-col ...">
  <h1>KONTACT</h1>
  <p>Vehículos de Ocasión...</p>
</div>
```

## Resultado Esperado
- El logo naranja aparecerá posicionado en la zona superior derecha, justo encima del camión
- El título "KONTACT" y los subtítulos quedarán exactamente donde están ahora
- Ambos elementos serán independientes y se podrán ajustar por separado
