

## Plan: Fix Vehicle Form Selections Not Displaying

### Root Cause Analysis

**Bug 1 — Selections visually not sticking (ALL selects affected)**
In `Step1VinIdentification.tsx` line 122, `const formData = form.getValues()` takes a **snapshot** that never updates. When `setValue` changes form data, the component doesn't re-render because `formData` is stale. Must use `form.watch()` instead.

**Bug 2 — Fuel type mismatch after VIN decode**
The VIN decoder (`vinDecoder.ts`) returns English values like `"gasoline"`, `"diesel"`, `"electric"`, `"hybrid"`. But the fuel `<Select>` options use Spanish values: `"gasolina"`, `"diesel"`, `"electrico"`, `"hibrido"`. So the decoded fuel value never matches any option.

**Bug 3 — Model not auto-filled after VIN decode**
When `handleVinChange` runs, it calls `onChange('model', decoded.model)` and `onBrandChange(decoded.brand)`. But `onBrandChange` clears `availableModels` to `[]` first (line 41 of hook), then repopulates. By that time the model value is already set. The Select sees `value="GOLF"` but `availableModels` is empty during that render cycle, so it falls back to the text Input and the value gets lost.

### Changes

**File 1: `src/components/vehicles/wizard/Step1VinIdentification.tsx`**
- Replace `const formData = form.getValues()` with `const formData = form.watch()` so all Select components reactively update when form values change.

**File 2: `src/utils/vinDecoder.ts`**
- Add a fuel mapping from NHTSA English values to the Spanish values used by the form: `gasoline→gasolina`, `diesel→diesel`, `electric→electrico`, `hybrid→hibrido`, `hydrogen→hidrogeno`, `gas→gas_natural`.

**File 3: `src/hooks/useVehicleUploadForm.ts`**
- In `handleBrandChange`: return the computed models array so the VIN handler can use it.
- In `handleVinChange` flow (Step1): call `onBrandChange` first, wait for models to be available, then set model. Alternatively, restructure so `handleBrandChange` is synchronous and the model is set after models are populated.
- Simplest fix: in `Step1VinIdentification.tsx`, reorder the VIN decode logic to call `onBrandChange` first, then use a small delay or effect to set the model after `availableModels` updates. Better approach: make `handleBrandChange` return the models list, and check if decoded model is in that list before setting it.

### Implementation Order
1. Fix `form.watch()` — fixes all visual selection issues
2. Fix fuel mapping — fixes fuel not showing after VIN decode  
3. Fix model timing — ensure model is set after available models are populated

