# Testing Guide

Esta aplicación cuenta con una suite completa de tests unitarios y E2E (End-to-End).

## 📋 Resumen

- ✅ **Unit Tests**: 25+ tests con Vitest y React Testing Library
- ✅ **E2E Tests**: 8 tests con Playwright
- ✅ **Accessibility Tests**: Auditoría WCAG 2.1 AA con axe-core
- ✅ **CI/CD**: GitHub Actions configurado con ambos tipos de tests

## 🚀 Comandos Disponibles

### Tests Unitarios (Vitest)

```bash
# Ejecutar todos los unit tests
npm run test

# Modo watch (re-ejecuta al guardar cambios)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Tests E2E (Playwright)

```bash
# Instalar navegadores (solo primera vez)
npx playwright install chromium

# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar solo tests de accesibilidad
npm run test:a11y

# Modo UI interactivo (recomendado)
npx playwright test --ui

# Modo debug
npx playwright test --debug

# Ejecutar un test específico
npx playwright test -g "nombre del test"

# Ver reporte de la última ejecución
npx playwright show-report
```

## 📁 Estructura de Tests

```
├── src/test/                    # Unit tests
│   ├── setup.ts                # Configuración de Vitest
│   ├── Button.test.tsx         # Test del componente Button
│   ├── use-toast.test.tsx      # Test del hook useToast
│   ├── logger.test.ts          # Test del logger
│   ├── components/             # Tests de componentes
│   │   ├── Card.test.tsx
│   │   ├── HeroSection.test.tsx
│   │   └── VehicleGalleryHero.test.tsx
│   └── utils/                  # Tests de utilidades
│       ├── dateUtils.test.ts
│       ├── formatters.test.ts
│       ├── imageValidation.test.ts
│       └── sanitizeHtml.test.ts
│
├── e2e/                        # E2E tests
│   ├── critical-flow.spec.ts  # Flujo crítico: Registro → Login → Publicar
│   ├── accessibility.spec.ts  # Tests de accesibilidad WCAG
│   └── fixtures/              # Archivos de prueba
│       ├── test-car.jpg       # Imagen válida para tests
│       └── invalid-file.txt   # Archivo inválido para tests
│
└── .github/workflows/
    └── ci.yml                  # Pipeline CI/CD con tests
```

## 🧪 Cobertura de Tests

### Unit Tests

- **Componentes UI**: Button, Card, HeroSection, VehicleGalleryHero
- **Hooks**: useToast
- **Utilidades**: dateUtils, formatters, imageValidation, sanitizeHtml, logger
- **Cobertura objetivo**: > 70%

### E2E Tests

1. **Flujo crítico completo**:
   - Registro de usuario
   - Login
   - Publicar vehículo con imagen
   - Verificar persistencia

2. **Validación de archivos**:
   - Upload de imagen válida
   - Rechazo de archivos inválidos

3. **Validación de formularios**:
   - Campos requeridos
   - Mensajes de error

4. **Accesibilidad**:
   - WCAG 2.1 AA compliance
   - Navegación por teclado
   - Indicadores de foco

## 🔧 Configuración

### Vitest (vitest.config.ts)

```typescript
{
  environment: 'jsdom',
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html']
  }
}
```

### Playwright (playwright.config.ts)

```typescript
{
  testDir: './e2e',
  fullyParallel: false,  // Tests secuenciales
  workers: 1,            // Un worker
  retries: 2 (en CI)     // Retry automático en CI
}
```

## 📊 CI/CD Pipeline

El pipeline de GitHub Actions ejecuta:

1. **Unit Tests** (npm run test)
   - Ejecuta todos los tests unitarios
   - Genera reporte de cobertura
   - Build del proyecto

2. **E2E Tests** (solo si unit tests pasan)
   - Instala Playwright
   - Ejecuta tests E2E
   - Guarda reportes en caso de fallo

3. **Accessibility Audit** (en paralelo)
   - Build del proyecto
   - Ejecuta Lighthouse
   - Verifica WCAG compliance

## 🎯 Mejores Prácticas

### Para Unit Tests

```typescript
// ✅ CORRECTO: Usar getByText/getByRole
const { getByText } = render(<Button>Click me</Button>);
expect(getByText('Click me')).toBeDefined();

// ✅ CORRECTO: Mock de contextos
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({ t: (key) => key })
}));

// ❌ INCORRECTO: No usar screen (no disponible)
expect(screen.getByText('...')).toBeInTheDocument();
```

### Para E2E Tests

```typescript
// ✅ CORRECTO: Usar fixtures
const testImagePath = path.join(__dirname, 'fixtures', 'test-car.jpg');
await fileInput.setInputFiles(testImagePath);

// ✅ CORRECTO: Esperar a que la URL cambie
await page.waitForURL(/\/(dashboard|home)/, { timeout: 15000 });

// ✅ CORRECTO: Verificar múltiples indicadores
const successIndicators = [
  page.locator('text=/success/i'),
  page.locator('[data-testid="success"]')
];
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@testing-library/jest-dom'"

```bash
npm install --save-dev @testing-library/jest-dom
```

### Error: "Playwright browsers not installed"

```bash
npx playwright install chromium
```

### Tests E2E fallan en CI pero pasan localmente

- Verifica timeouts en `playwright.config.ts`
- Añade `await page.waitForLoadState('networkidle')`
- Aumenta el timeout de Playwright en CI

### Cobertura baja

```bash
# Ver qué archivos faltan tests
npm run test:coverage
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Axe Accessibility](https://www.deque.com/axe/)

## ✅ Checklist antes de commit

- [ ] Los unit tests pasan localmente
- [ ] Los E2E tests pasan localmente
- [ ] La cobertura no ha disminuido
- [ ] Se agregaron tests para nuevas funcionalidades
- [ ] Los tests son claros y mantenibles

## 🎨 Scripts adicionales

```bash
# Ejecutar solo tests que fallaron anteriormente
npm run test -- --only-failed

# Ejecutar con UI de Vitest
npm run test -- --ui

# Limpiar cache de tests
npm run test -- --clearCache
```

---

**Última actualización**: 2025-10-29
**Versión de tests**: 1.0.0
**Estado**: ✅ Todos los tests pasando
