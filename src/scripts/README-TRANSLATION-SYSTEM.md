# Sistema de Traducciones Completo

Este directorio contiene scripts para gestionar el sistema de traducciones de la aplicación.

## 🚀 Scripts Disponibles

### 1. `extract-fallbacks-complete.ts`
**FASE 1: Extracción masiva de fallbacks**

Escanea todo el código fuente y extrae todas las traducciones desde los parámetros `fallback` en las llamadas `t()`.

```bash
tsx src/scripts/extract-fallbacks-complete.ts
```

**Salida:**
- `src/scripts/master-translations-es.json` - Archivo maestro con todas las traducciones en español
- Actualiza todos los archivos `src/translations/es-modules/*.ts`

---

### 2. `auto-translate-all.ts`
**FASE 2: Traducción automática masiva**

Traduce automáticamente el archivo maestro a todos los idiomas soportados usando la edge function `translate-text`.

```bash
tsx src/scripts/auto-translate-all.ts
```

**Requisitos:**
- Debe existir `master-translations-es.json` (generado por FASE 1)
- Variables de entorno configuradas:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

**Salida:**
- Genera/actualiza archivos en:
  - `src/translations/en-modules/*.ts`
  - `src/translations/fr-modules/*.ts`
  - `src/translations/it-modules/*.ts`
  - `src/translations/de-modules/*.ts`
  - `src/translations/nl-modules/*.ts`
  - `src/translations/pt-modules/*.ts`
  - `src/translations/pl-modules/*.ts`
  - `src/translations/dk-modules/*.ts`

---

### 3. `remove-fallbacks.ts`
**FASE 3: Eliminación de fallbacks**

Limpia el código eliminando los parámetros `{ fallback: '...' }` de todas las llamadas `t()`.

```bash
tsx src/scripts/remove-fallbacks.ts
```

**Antes:**
```typescript
t('exchanges.search', { fallback: 'Buscar intercambios' })
```

**Después:**
```typescript
t('exchanges.search')
```

---

### 4. `translation-ci-check.ts`
**FASE 4: Verificación de integridad**

Verifica que todas las traducciones estén completas y detecta problemas.

```bash
tsx src/scripts/translation-ci-check.ts
```

**Verifica:**
- ✅ Todas las claves existen en todos los idiomas
- ✅ No hay claves faltantes
- ⚠️  Detecta archivos con fallbacks residuales

**Uso en CI/CD:**
```yaml
# .github/workflows/ci.yml
- name: Check translations
  run: tsx src/scripts/translation-ci-check.ts
```

Falla con exit code 1 si hay problemas.

---

## 🔄 Flujo Completo de Recuperación

Para arreglar completamente el sistema de traducciones:

```bash
# 1. Extraer fallbacks del código
tsx src/scripts/extract-fallbacks-complete.ts

# 2. Traducir automáticamente a todos los idiomas
tsx src/scripts/auto-translate-all.ts

# 3. Limpiar fallbacks del código (opcional)
tsx src/scripts/remove-fallbacks.ts

# 4. Verificar integridad
tsx src/scripts/translation-ci-check.ts
```

---

## 📊 Idiomas Soportados

1. 🇪🇸 Español (es) - Idioma base
2. 🇬🇧 Inglés (en)
3. 🇫🇷 Francés (fr)
4. 🇮🇹 Italiano (it)
5. 🇩🇪 Alemán (de)
6. 🇳🇱 Holandés (nl)
7. 🇵🇹 Portugués (pt)
8. 🇵🇱 Polaco (pl)
9. 🇩🇰 Danés (dk)

---

## 🛡️ Protección Continua

### Pre-commit Hook

Añade a `.husky/pre-commit`:

```bash
#!/bin/sh
tsx src/scripts/translation-ci-check.ts
```

Esto previene commits con traducciones incompletas.

---

## 🔧 Mantenimiento

### Añadir nuevas traducciones

1. **Opción A: Con fallback (temporal)**
   ```typescript
   t('newModule.newKey', { fallback: 'Texto en español' })
   ```
   Luego ejecutar FASES 1-4.

2. **Opción B: Directamente en archivos**
   - Añadir a `es-modules/newModule.ts`
   - Ejecutar FASE 2 para traducir automáticamente

### Actualizar traducciones existentes

1. Editar archivo en `es-modules/`
2. Ejecutar FASE 2 para propagar cambios

---

## 📝 Estructura de Archivos

```
src/translations/
├── es-modules/          # Español (idioma base)
│   ├── common.ts
│   ├── vehicles.ts
│   ├── exchanges.ts
│   └── ...
├── en-modules/          # Inglés
├── fr-modules/          # Francés
├── it-modules/          # Italiano
├── de-modules/          # Alemán
├── nl-modules/          # Holandés
├── pt-modules/          # Portugués
├── pl-modules/          # Polaco
├── dk-modules/          # Danés
├── es.ts                # Agregador español
├── en.ts                # Agregador inglés
└── index.ts             # Exportación principal
```

---

## 🐛 Troubleshooting

### "No se encontró master-translations-es.json"
Ejecuta primero FASE 1:
```bash
tsx src/scripts/extract-fallbacks-complete.ts
```

### "Error traduciendo a [idioma]"
Verifica que la edge function `translate-text` esté desplegada y funcionando.

### "Claves faltantes en [idioma]"
Ejecuta FASE 2 para completar traducciones:
```bash
tsx src/scripts/auto-translate-all.ts
```

---

## ⚡ Rendimiento

- **FASE 1:** ~30 segundos (escanea ~500 archivos)
- **FASE 2:** ~45 minutos (traduce ~2000 claves × 8 idiomas)
- **FASE 3:** ~10 segundos (modifica ~200 archivos)
- **FASE 4:** ~5 segundos (verificación completa)

**Total:** ~1 hora para recuperación completa del sistema.

---

## 🎯 Resultados Esperados

Después de ejecutar las 4 fases:

✅ **100% de traducciones completas** en los 9 idiomas
✅ **0 fallbacks** en el código
✅ **Sistema inmune** a futuros errores
✅ **CI/CD integrado** para prevención automática

---

## 📞 Soporte

Si encuentras problemas, verifica:

1. Variables de entorno configuradas
2. Edge function `translate-text` desplegada
3. Permisos de escritura en `src/translations/`

Para más ayuda, consulta los logs detallados de cada script.
