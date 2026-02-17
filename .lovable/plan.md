

# Multilingual Fixes - Non-Structural

## Overview
Remove all hardcoded Spanish text from public-facing components. The work covers four areas: the vehicle data sheet (PDF), toast messages, Spanish fallback patterns, and dialog/form placeholders. Admin panel is excluded.

---

## 1. Vehicle Data Sheet (`VehicleDataSheet.tsx`)

The entire print HTML template contains ~30 hardcoded Spanish strings. These will be replaced with `t()` calls using a mix of existing keys and new `datasheet.*` keys.

### Hardcoded strings to replace:
- "Ficha tecnica profesional del vehiculo" (subtitle)
- "IVA incluido" / "IVA deducible" / "IVA no incluido"
- "Ano", "Kilometraje", "Combustible", "Transmision", "Ubicacion" (key info labels)
- "Descripcion del vehiculo" (section header)
- "Detalles tecnicos" (section header)
- "Equipamiento" (section header)
- "Estado del vehiculo" (section header)
- "Danos reportados" / "Sin danos reportados"
- "Bajo", "Medio", "Alto" (severity)
- "Dano", "Ubicacion:", "Coste estimado:"
- "Vehiculo revisado", "Disponible"
- "Color", "Combustible", "Transmision", "Kilometraje", "VIN", "Potencia", "Cilindrada", "Puertas", "Emisiones CO2", "Norma Euro", "Acepta intercambios"
- "Si" / "No" / "No especificado"
- "Marketplace Automotriz Profesional"
- "Documento generado el..."
- "Ver vehiculo en la plataforma"
- "Ficha Tecnica" (card title, line 264)
- Date formatting locale (`'es-ES'`)
- `getSeverityText()` returns hardcoded Spanish

### Approach:
- Pass `t()` resolved strings into the HTML template as variables
- Use existing keys where available (`vehicles.year`, `vehicles.mileage`, `vehicles.fuel`, `vehicles.noDamagesReported`, `vehicles.highSeverity`, etc.)
- Add ~20 new `datasheet.*` keys for PDF-specific labels

### New translation keys needed (added to all 9 language commission modules):

```text
datasheet.professionalSubtitle
datasheet.ivaIncluded / ivaDeductible / ivaNotIncluded
datasheet.year / mileage / fuel / transmission / location
datasheet.vehicleDescription
datasheet.technicalDetails
datasheet.equipment
datasheet.vehicleCondition
datasheet.damagesReported
datasheet.noDamagesReported
datasheet.reviewed / available
datasheet.damageLabel / damageLocation / estimatedCost
datasheet.color / vin / power / displacement / doors / co2Emissions / euroNorm / acceptsExchange
datasheet.yes / no / notSpecified
datasheet.marketplaceSubtitle
datasheet.generatedOn
datasheet.viewOnPlatform
```

### Translation files to update:
- `src/translations/de-modules/commission.ts` (add datasheet.* keys)
- `src/translations/nl-modules/commission.ts` (add datasheet.* keys)
- `src/translations/pl-modules/commission.ts` (add datasheet.* keys)
- `src/translations/dk-modules/commission.ts` (add datasheet.* keys)
- `src/translations/pt-modules/commission.ts` (add datasheet.* keys)
- Verify existing keys in es, en, fr, it commission modules and extend them

---

## 2. Toast Messages

Replace all hardcoded Spanish toast strings in non-admin files with `t()` calls. New translation keys will be added under a `toast.*` namespace.

### Files to fix (non-admin only):

| File | Hardcoded toasts |
|------|-----------------|
| `src/components/vehicle/preview/ContactSellerDialog.tsx` | 3 toasts |
| `src/components/messages/ContactKontactModal.tsx` | 2 toasts |
| `src/components/bulletin/AnnouncementForm.tsx` | 1 toast |
| `src/pages/BulletinBoard.tsx` | 2 toasts |
| `src/components/shared/UserCardWithSelection.tsx` | 3 toasts |
| `src/hooks/useRegisterForm.ts` | 5 toasts |
| `src/services/vehicleDeletionService.ts` | 5 toasts |
| `src/hooks/useAnnouncementAttachments.ts` | 3 toasts |
| `src/hooks/useChatImageUpload.ts` | 1 toast |
| `src/components/transport/TransportQuotesList.tsx` | 4 toasts |
| `src/components/profile/PrivacySettings.tsx` | 3 toasts |
| `src/components/vehicle-reports/ReportRequestForm.tsx` | 3 toasts |
| `src/hooks/useRolesAndPermissions.ts` | 1 toast |
| `src/hooks/auth/useLogout.ts` | 1 toast |
| `src/hooks/auth/useRegister.ts` | 1 toast |
| `src/utils/sessionSynchronizer.ts` | 3 toasts |
| `src/pages/ExchangeProposal.tsx` | 2 toasts |
| `src/services/directChat.ts` | 3 toasts |

### Approach:
- Add a new `toast.*` translation module for each language (9 files)
- Replace each hardcoded string with `t('toast.keyName')`
- Import `useLanguage` or pass `t` where needed (some are in services/utils - will need to accept `t` as parameter or use a standalone translation getter)

For non-React files (`vehicleDeletionService.ts`, `directChat.ts`, `sessionSynchronizer.ts`), the `t` function will be passed as a parameter from the calling component, or we use a direct import from the translations object with stored language.

---

## 3. Remove Spanish Fallbacks

111 files use `t('key', { fallback: 'Spanish text' })`. The `t()` function already falls back to English then Spanish automatically (lines 101-124 of LanguageContext). The manual fallbacks are redundant and cause Spanish to leak through.

### Approach:
- Replace `t('key', { fallback: 'Spanish text' })` with `t('key')` across all non-admin files
- Ensure the English translation file has the key so the built-in fallback chain (current language -> en -> es) works correctly
- Add any missing English keys found during the cleanup

This affects ~71 non-admin component files.

---

## 4. Dialog and Form Placeholders

### ContactSellerDialog.tsx (fully hardcoded in Spanish):
- "Contactar al vendedor" (title)
- "Envia un mensaje a {name}" (description)
- "Contenido del mensaje" (label)
- "Escribe tu mensaje aqui..." (placeholder)
- "Enviando..." / "Enviar" (button)

### Other forms with hardcoded placeholders:
- Rating forms (check for inline Spanish)
- Contact forms (verify all use `t()`)
- EmptyChatPlaceholder (already uses `t()` with Spanish fallbacks - fix under task 3)

### New translation keys:
```text
seller.contactTitle
seller.contactDescription
seller.messageLabel
seller.messagePlaceholder
seller.sending
seller.send
```

Added to the `seller` module for all 9 languages.

---

## 5. Date Formatting

In `VehicleDataSheet.tsx`, the date is formatted with `'es-ES'` locale. This will be replaced with a locale map based on `currentLanguage`:

```typescript
const localeMap = { es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', nl: 'nl-NL', pt: 'pt-PT', pl: 'pl-PL', dk: 'da-DK' };
```

---

## Summary of files to create/modify

### New files (9 toast translation modules):
- `src/translations/es-modules/toast.ts`
- `src/translations/en-modules/toast.ts`
- `src/translations/fr-modules/toast.ts`
- `src/translations/de-modules/toast.ts`
- `src/translations/it-modules/toast.ts`
- `src/translations/nl-modules/toast.ts`
- `src/translations/pt-modules/toast.ts`
- `src/translations/pl-modules/toast.ts`
- `src/translations/dk-modules/toast.ts`

### Modified files:
- 9 commission translation modules (add datasheet.* keys)
- 9 seller translation modules (add contact dialog keys)
- 9 language barrel files (import toast module)
- `src/components/vehicle/VehicleDataSheet.tsx` (full i18n)
- `src/components/vehicle/preview/ContactSellerDialog.tsx` (full i18n)
- ~18 files with hardcoded toasts (replace with t() calls)
- ~71 files with Spanish fallbacks (remove fallback params)

### Not modified:
- Admin panel files (`src/pages/admin/*`, `src/components/admin/*`)
- Database schema
- API contracts
- `supabase/config.toml`, `client.ts`, `types.ts`, `.env`

