
# Fix Remaining Hardcoded Spanish in Public Pages

## Problem
The vehicle preview page (`VehicleContentLayout.tsx`) and sub-components contain ~15 hardcoded Spanish strings visible in all languages. The Exchanges page uses Spanish fallback patterns. Several translation keys used in code (`common.user`, `common.owner`, `vehicles.noDescription`) do not exist in any translation file, causing `[MISSING: ...]` labels.

---

## Part A: Missing Translation Keys (causes [MISSING: ...] labels)

These keys are used in code but do not exist in ANY translation file:

| Key | Used In | Fix |
|-----|---------|-----|
| `common.user` | VehicleContentLayout, SellerContactCard | Add to all 9 language common modules |
| `common.owner` | VehicleContentLayout, SellerContactCard | Add to all 9 language common modules |
| `vehicles.noDescription` | VehicleContentLayout | Add to all 9 language vehicles modules |

**Files to update:** `src/translations/{es,en,fr,de,it,nl,pt,pl,dk}-modules/common.ts` and `vehicles.ts`

---

## Part B: VehicleContentLayout.tsx (~15 hardcoded Spanish strings)

| Line | Hardcoded Spanish | Replace With |
|------|------------------|--------------|
| 122 | `'Vendido'` / `'Reservado'` | `t('vehicles.sold')` / `t('vehicles.reserved')` |
| 134 | `"Potencia"` | `t('vehicles.enginePower')` |
| 157 | `"Gastos de importacion"` | `t('vehicles.importCosts')` -- new key |
| 169 | `"Inicia sesion para contactar"` | `t('vehicles.loginToContact')` -- new key |
| 178 | `"Venta Comisionada"` | `t('vehicles.commissionSaleLabel')` -- new key |
| 180 | `"PVP:"` | `t('vehicles.pvp')` -- new key |
| 209 | `"Vendedor"` | `t('vehicles.seller')` |
| 234 | `'Profesional'` / `'Particular'` | `t('vehicles.professional')` / `t('vehicles.private')` -- new keys |
| 312 | `"Equipamiento"` | `t('vehicles.equipment')` |
| 327 | `"Informacion"` | `t('vehicles.information')` |
| 343 | `"Calculadora de Comisiones"` | `t('commission.title')` (existing key) |
| 360 | `"Ficha Tecnica"` | `t('datasheet.title')` -- new key |
| 373 | `"Estado"` | `t('vehicles.condition')` |
| 386 | `"Archivos"` | `t('vehicles.files')` |
| 401 | `'Vendedor'` (fallback) | `t('common.user')` |

**File:** `src/components/vehicle/preview/VehicleContentLayout.tsx`

---

## Part C: Sub-components with hardcoded Spanish

### DamageAccessCard.tsx (lines 52, 59)
- `"Estado"` --> `t('vehicles.condition')`
- `"Acceder para conocer el estado del vehiculo"` --> `t('vehicles.damagesDescription')`

### DocumentAccessCard.tsx (lines 52, 59)
- `"Archivos"` --> `t('vehicles.files')`
- `"Acceso a archivos adicionales"` --> `t('vehicles.filesDescription')`

### VehicleTechnicalData.tsx (lines 157, 170)
- `"Conoce los gastos de importacion"` --> `t('vehicles.importCosts')`
- `'Vendedor'` fallback --> `t('common.user')`

---

## Part D: Exchanges page fallback cleanup

The file `src/pages/Exchanges.tsx` has ~20 instances of `t('key', { fallback: 'Spanish text' })`. Since the `t()` function now ignores fallbacks, these already fall through to EN. However, several keys used in Exchanges.tsx do NOT exist in the EN exchanges module:

New keys to add to `src/translations/en-modules/exchanges.ts`:
- `exchanges.subtitle` = "Find exchange opportunities"
- `exchanges.search` = "Search vehicles"
- `exchanges.searchDescription` = "Search vehicles other users want to exchange"
- `exchanges.searchPlaceholder` = "Search by brand, model..."
- `exchanges.createRequest` = "Create Exchange Request"
- `exchanges.availableVehicles` = "Available Vehicles"
- `exchanges.exchangeRequestsDescription` = "Exchange requests published by users"
- `exchanges.unknownVehicle` = "Vehicle not specified"
- `exchanges.yours` = "Your request"
- `exchanges.contactPublisher` = "Contact"
- `exchanges.acceptsExchange` = "Accepts exchange" (already exists)
- `exchanges.noVehiclesFound` = "No vehicles found matching your search"
- `exchanges.noVehicles` = "No vehicles available for exchange at this time"
- `exchanges.ownVehiclesExcluded` = "Note: Your own vehicles are not shown"

Then add the same keys in the other 8 languages (es, fr, de, it, nl, pt, pl, dk).

---

## Part E: New translation keys for vehicles module (all 9 languages)

| Key | ES | EN |
|-----|----|----|
| `vehicles.noDescription` | Sin descripcion | No description available |
| `vehicles.importCosts` | Gastos de importacion | Import costs |
| `vehicles.loginToContact` | Inicia sesion para contactar | Log in to contact |
| `vehicles.commissionSaleLabel` | Venta Comisionada | Commission Sale |
| `vehicles.pvp` | PVP | RRP |
| `vehicles.professional` | Profesional | Professional |
| `vehicles.private` | Particular | Private |
| `datasheet.title` | Ficha Tecnica | Data Sheet |

---

## Files Summary

### Modified components (4 files):
- `src/components/vehicle/preview/VehicleContentLayout.tsx`
- `src/components/vehicle/preview/DamageAccessCard.tsx`
- `src/components/vehicle/preview/DocumentAccessCard.tsx`
- `src/components/vehicle/preview/VehicleTechnicalData.tsx`

### Modified translation modules (27 files):
- `src/translations/{es,en,fr,de,it,nl,pt,pl,dk}-modules/common.ts` (add `common.user`, `common.owner`)
- `src/translations/{es,en,fr,de,it,nl,pt,pl,dk}-modules/vehicles.ts` (add ~7 new keys)
- `src/translations/{es,en,fr,de,it,nl,pt,pl,dk}-modules/exchanges.ts` (add ~13 new keys)

### NOT modified:
- Admin panel
- Database schema
- API contracts
