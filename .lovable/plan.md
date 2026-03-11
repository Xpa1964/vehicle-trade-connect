

## Plan: Enlace directo a Kontact Drive desde el Panel de Control

El usuario quiere que al pulsar "Solicitar" en la tarjeta de Transporte Exprés del dashboard, se abra directamente la calculadora externa de Kontact Drive en nueva pestaña, sin pasar por la página intermedia `/transport-express`.

### Cambio

**Archivo:** `src/components/dashboard/ControlPanel.tsx`

En la tarjeta de Transporte Exprés, cambiar el `secondaryAction` para que apunte directamente a la URL externa `https://mover-pro-flow.lovable.app` en lugar de una ruta interna.

**Archivo:** `src/components/dashboard/DashboardServiceCard.tsx`

Modificar el componente para que, cuando el href de una acción sea una URL externa (empiece por `http`), use `<a href="..." target="_blank">` en lugar de `<Link to="...">` de React Router.

Así el flujo será: **Panel de Control → clic en "Solicitar" → se abre Kontact Drive en nueva pestaña**.

