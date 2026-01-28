# Guía de Accesibilidad

Este documento describe los estándares de accesibilidad que seguimos en el proyecto para cumplir con WCAG 2.1 AA.

## 🎯 Objetivo

Garantizar que nuestra aplicación sea utilizable por todas las personas, independientemente de sus capacidades.

## 📊 Estándares

- **WCAG 2.1 Level AA**: Cumplimiento mínimo requerido
- **Score Lighthouse**: ≥ 90 en accesibilidad
- **Tests automatizados**: 0 violaciones críticas en axe-core

## ✅ Checklist de Accesibilidad

### Colores y Contraste
- [ ] Ratio de contraste ≥ 4.5:1 para texto normal
- [ ] Ratio de contraste ≥ 3:1 para texto grande (18pt+)
- [ ] No usar color como único medio para transmitir información

### Navegación por Teclado
- [ ] Todos los elementos interactivos accesibles con Tab
- [ ] Orden de tabulación lógico (top → bottom, left → right)
- [ ] Estados de foco visibles (`focus:ring-2`)
- [ ] Trampas de teclado evitadas

### Formularios
- [ ] Cada `<input>` tiene su `<label>` asociado
- [ ] Mensajes de error con `aria-describedby`
- [ ] Campos requeridos indicados con `aria-required="true"`
- [ ] Inputs inválidos marcados con `aria-invalid="true"`

### Imágenes
- [ ] Todas las imágenes tienen atributo `alt` descriptivo
- [ ] Imágenes decorativas con `alt=""` vacío
- [ ] Iconos con `aria-hidden="true"` si son puramente visuales

### Estructura Semántica
- [ ] Usar elementos HTML5 semánticos (`<nav>`, `<main>`, `<section>`, `<article>`)
- [ ] Un solo `<h1>` por página
- [ ] Jerarquía de headings lógica (h1 → h2 → h3)
- [ ] Landmarks ARIA donde sea apropiado

### ARIA
- [ ] `aria-label` para botones sin texto visible
- [ ] `aria-live` para notificaciones dinámicas
- [ ] `aria-expanded` para elementos colapsables
- [ ] `aria-describedby` para descripciones adicionales

## 🔧 Herramientas

### Tests Automatizados
```bash
# Ejecutar tests de accesibilidad
npm run test:e2e -- accessibility.spec.ts

# Ejecutar Lighthouse
npx lighthouse http://localhost:3000 --view --only-categories=accessibility
```

### Extensiones de Navegador
- **axe DevTools**: Escaneador de accesibilidad en tiempo real
- **WAVE**: Evaluador visual de accesibilidad web
- **Lighthouse**: Auditorías integradas en Chrome DevTools

### Pruebas Manuales
1. **Navegación por teclado**: Usar solo `Tab`, `Enter`, `Espacio`, `Flechas`
2. **Lector de pantalla**: Probar con NVDA (Windows) o VoiceOver (Mac)
3. **Zoom**: Verificar que funcione al 200% de zoom

## 🐛 Problemas Comunes y Soluciones

### Contraste Insuficiente
```tsx
// ❌ Incorrecto
<p className="text-gray-400">Texto poco legible</p>

// ✅ Correcto
<p className="text-gray-700">Texto legible</p>
```

### Label Faltante
```tsx
// ❌ Incorrecto
<input type="email" placeholder="Email" />

// ✅ Correcto
<label htmlFor="email">Email</label>
<input id="email" type="email" placeholder="tu@email.com" />
```

### Botón Sin Texto
```tsx
// ❌ Incorrecto
<button><X /></button>

// ✅ Correcto
<button aria-label="Cerrar modal">
  <X aria-hidden="true" />
</button>
```

### Foco No Visible
```tsx
// ❌ Incorrecto
<button className="outline-none">Click</button>

// ✅ Correcto
<button className="focus:ring-2 focus:ring-blue-500">Click</button>
```

## 📈 Monitoreo Continuo

- **CI/CD**: Tests de accesibilidad se ejecutan en cada PR
- **Lighthouse CI**: Score ≥ 90 requerido para mergear
- **Revisión mensual**: Auditoría manual de nuevas features

## 📚 Recursos

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## 🆘 ¿Dudas?

Si tienes preguntas sobre accesibilidad, consulta este documento o busca en los recursos listados arriba.
