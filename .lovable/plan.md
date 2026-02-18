

## Carrusel de Daños en la Pagina de Daños

### Objetivo
Rediseñar la pagina `/vehicle/:id/damages` (`VehicleDamagesPage.tsx`) para mostrar los daños como un **carrusel horizontal de tarjetas**, cada una con su miniatura y descripcion debajo. Al hacer clic en una imagen se abre el lightbox existente.

### Diseno Visual

```text
+------------------+  +------------------+  +------------------+
|                  |  |                  |  |                  |
|   [Imagen daño]  |  |   [Imagen daño]  |  |   [Imagen daño]  |
|   (aspect 4:3)   |  |   (aspect 4:3)   |  |   (aspect 4:3)   |
|                  |  |                  |  |                  |
+------------------+  +------------------+  +------------------+
| Badge: Severo    |  | Badge: Menor     |  | Badge: Moderado  |
| Golpe puerta     |  | Ararazo lateral  |  | Abolladura capo  |
| Coste: 350 EUR   |  | Coste: 80 EUR    |  | Coste: 200 EUR   |
+------------------+  +------------------+  +------------------+
       <---  Flechas de navegacion Embla  --->
```

### Lo que NO cambia
- `DamageAccessCard` en la ficha del vehiculo permanece igual (contador + enlace)
- La consulta de datos (vehicle_damages + vehicle_damage_images) se mantiene
- El lightbox fullscreen se conserva
- El header con botones "Volver" y "Inicio" se mantiene

### Cambios Tecnicos

**Archivo unico a modificar:** `src/pages/VehicleDamagesPage.tsx`

1. **Reemplazar el bloque central** (imagen grande + miniaturas + descripcion sincronizada) por un carrusel Embla usando los componentes existentes `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext` de `src/components/ui/carousel.tsx`

2. **Cada CarouselItem** contendra:
   - Imagen con aspect ratio 4:3, `object-cover`, bordes redondeados
   - Al hacer clic en la imagen: abre lightbox a pantalla completa
   - Debajo de la imagen:
     - Badge de severidad con color (menor=amarillo, moderado=naranja, severo=rojo)
     - Descripcion del daño (truncada a 2 lineas con `line-clamp-2`)
     - Coste estimado si existe

3. **Responsividad** de las tarjetas:
   - Movil: 1 tarjeta visible (`basis-full`)
   - Tablet: 2 tarjetas (`sm:basis-1/2`)
   - Desktop: 3 tarjetas (`md:basis-1/3`)
   - Desktop grande: 4 tarjetas (`lg:basis-1/4`)

4. **Eliminar** el estado `currentIndex` y la logica de navegacion manual (goToPrev/goToNext) ya que Embla gestiona el scroll

5. **Mantener** el lightbox: al hacer clic en cualquier imagen se abre con el indice correspondiente

6. **Traducir** los textos hardcoded en español ("Ubicacion", "Costo estimado", "daño registrado", etc.) usando claves de traduccion existentes o `t()` con claves ya disponibles

### Resumen
- 1 archivo modificado: `src/pages/VehicleDamagesPage.tsx`
- 0 archivos nuevos
- Se reutilizan los componentes Embla Carousel ya existentes en el proyecto
