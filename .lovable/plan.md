
# Plan: Eliminar máscara de las cards del Panel de Control

## Diagnóstico confirmado

El oscurecimiento viene de:
1. Un `div` con gradiente negro (`from-black/80 via-black/40`) que cubre toda la imagen
2. Botones con fondo semitransparente (`bg-white/20`) y blur (`backdrop-blur-sm`)

La imagen está limpia, pero estas capas la tapan.

---

## Solución

Reestructurar el componente `DashboardServiceCard.tsx` para:

### 1. Eliminar el overlay oscuro
Quitar completamente el `div` con `bg-gradient-to-t from-black/80 via-black/40 to-transparent`

### 2. Nuevo layout en 2 zonas
```text
┌────────────────────────┐
│                        │
│   IMAGEN 100% LIMPIA   │  ← Sin nada encima
│   (sin overlay)        │
│                        │
├────────────────────────┤
│  Título                │  ← Sobre fondo sólido del card
│  [Ver] [Publicar]      │  ← Botones normales, sin blur
└────────────────────────┘
```

### 3. Botones con estilos normales
Cambiar de `bg-white/20 backdrop-blur-sm` a estilos estándar del theme (sin transparencias)

---

## Cambios técnicos

**Archivo:** `src/components/dashboard/DashboardServiceCard.tsx`

- Eliminar línea 33 (el overlay gradiente)
- Cambiar el layout de "imagen con contenido flotante encima" a "imagen arriba, contenido abajo"
- Reemplazar clases de botones:
  - De: `bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30`
  - A: estilos estándar del botón secundario sin transparencias

---

## Resultado esperado

- Imágenes 100% originales, sin ningún oscurecimiento
- Texto y botones perfectamente legibles (están en zona separada)
- Consistencia visual con el resto de la app
