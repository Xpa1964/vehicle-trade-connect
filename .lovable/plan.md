
<contexto-y-objetivo>
Ahora mismo el problema viene de dos cosas distintas en el Hero:

1) El bloque de texto (KONTACT + subtítulos) se está “empujando” a la izquierda en pantallas grandes por las clases del contenedor (usa `justify-start` + `pl-*` y además en `lg` pasa a `items-start`/`text-left`).
2) El logo naranja se está posicionando “a ojo” con `left-[420px] ...`, lo cual nunca va a quedar clavado debajo de “Vehículos” en todos los tamaños/idiomas/estado login.

Objetivo exacto (según lo que repites y lo que se ve en tus capturas):
- En escritorio: “KONTACT / VO VN KM0 / AUTOMOTIVE MARKETPLACE” vuelve al centro (como estaba antes).
- En escritorio: el logo naranja queda JUSTO debajo del menú “Vehículos”, con un pequeño espacio de aire.
- En móvil/tablet: el logo naranja queda centrado.
- No volver a usar posiciones fijas tipo `left-[xxx]` para alinear con “Vehículos”.
</contexto-y-objetivo>

<solucion-propuesta-en-una-frase>
Centrar de nuevo el bloque de texto del Hero (quitando la alineación izquierda en desktop) y anclar el logo naranja dinámicamente al elemento real del menú “Vehículos” (medido en pantalla), manteniendo un fallback centrado en móvil.
</solucion-propuesta-en-una-frase>

<cambios-a-realizar>
<archivo path="src/components/home/HeroSection.tsx">
1) Volver a centrar el bloque “KONTACT + subtítulos” en desktop:
   - Cambiar el “Content Layer” para que use `justify-center` en vez de `justify-start`.
   - Eliminar el padding-left grande (`pl-8 ... xl:pl-40`) que lo tira hacia la izquierda.
   - Quitar los overrides de escritorio que lo vuelven a alinear a la izquierda:
     - `lg:items-start` -> dejarlo en `items-center`
     - `lg:text-left` -> dejarlo en `text-center`

   Resultado: en pantallas grandes, el texto vuelve al centro como tú pides (encima del grupo de personas).

2) Rehacer la posición del logo naranja para que sea “debajo de Vehículos” de forma exacta:
   - Mantenerlo como elemento independiente (sigue siendo `absolute` dentro del hero).
   - Sustituir `left-[420px] ...` por un posicionamiento dinámico:
     - Se localizará el link de “Vehículos” en el header.
     - Se leerá su posición con `getBoundingClientRect()`.
     - Se calculará el `left` del logo para que quede centrado bajo “Vehículos”.
     - La altura (`top`) se calculará usando la parte inferior del header + un GAP (por ejemplo 12px) para “respirar”.

3) Comportamiento en móvil/tablet:
   - Si el menú de escritorio no existe (o viewport < md), el logo usa el fallback:
     - `left-1/2 -translate-x-1/2`
     - un `top-*` estable (el que ya tenías, ajustable si hiciera falta)

4) Evitar interferencias:
   - Añadir `pointer-events-none` al wrapper del logo para que nunca bloquee clicks del menú.
</archivo>

<archivo path="src/components/layout/navbar/DesktopNav.tsx">
5) Añadir un “ancla” identificable al item de menú “Vehículos”:
   - En el `<Link>` cuyo `to === '/vehicles'`, añadir `data-nav-item="vehicles"`.
   Esto no cambia el diseño; solo permite encontrar el elemento de forma fiable.
</archivo>

<archivo path="src/components/layout/navbar/NavbarContainer.tsx">
6) (Recomendado para que el “aire” sea correcto) Marcar el contenedor del header:
   - En el wrapper principal (el `div` con `sticky top-0 z-50`), añadir `data-site-header="main"`.
   Así el `top` del logo se calcula con la base del header real, no con la base del link (que queda más arriba por estar centrado en vertical dentro del header).
</archivo>
</cambios-a-realizar>

<detalles-tecnicos-implementacion>
- Usaré `useLayoutEffect` (mejor que `useEffect`) para calcular posición antes de que se note el “salto”.
- Cálculo propuesto (escritorio):
  - `vehiclesEl = document.querySelector('[data-nav-item="vehicles"]')`
  - `headerEl = document.querySelector('[data-site-header="main"]')`
  - `heroRect = heroSectionEl.getBoundingClientRect()`
  - `vehiclesRect = vehiclesEl.getBoundingClientRect()`
  - `headerRect = headerEl.getBoundingClientRect()`
  - `left = (vehiclesRect.left + vehiclesRect.width/2) - heroRect.left`
  - `top = (headerRect.bottom - heroRect.top) + GAP_PX`  (GAP_PX inicial: 12)
- Aplicación en JSX:
  - En escritorio: `style={{ left: leftPx, top: topPx }}` + clase `-translate-x-1/2`
  - En móvil: sin style dinámico, clases `left-1/2 -translate-x-1/2` (centrado)
- Recalcular en:
  - `resize`
  - cambio de idioma
  - cambio de usuario (login/logout) si afecta el layout del header
</detalles-tecnicos-implementacion>

<criterios-de-aceptacion>
1) Desktop (pantalla grande):
   - El texto “KONTACT / VO VN KM0 / AUTOMOTIVE MARKETPLACE” está centrado horizontalmente (no a la izquierda).
   - El logo naranja queda justo debajo de “Vehículos” (alineado al centro del texto del menú).
   - Hay separación visible entre el menú y el comienzo del logo (GAP ~12px ajustable).

2) Móvil / tablet:
   - El logo naranja está centrado horizontalmente.
   - No tapa el botón hamburguesa ni elementos de navegación.

3) Robustez:
   - Cambiar idioma no descoloca el logo.
   - Login/logout no descoloca el logo.
</criterios-de-aceptacion>

<ajuste-fino>
Si después de anclarlo “perfecto” debajo de Vehículos quieres que el logo quede 10–30px más “montado” sobre el camión por estética (sin perder el anclaje), añadiré dos constantes fáciles de tocar:
- `GAP_PX` (espacio vertical bajo el header)
- `X_NUDGE_PX` (micro ajuste horizontal)
</ajuste-fino>
