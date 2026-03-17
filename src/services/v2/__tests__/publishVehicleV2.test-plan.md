# Test Plan: publishVehicleV2

> Status: **PENDING** — Tests defined, not yet executed.
> Target: `src/services/publishVehicleV2.ts`

---

## 1. VALIDATION TESTS

| # | Scenario | Input | Expected Result |
|---|----------|-------|-----------------|
| V-01 | Missing brand | `{ brand: '', model: 'X1' }` | Throws `Validation: brand is required` |
| V-02 | Missing model | `{ brand: 'BMW', model: '' }` | Throws `Validation: model is required` |
| V-03 | Year too old | `{ year: 1800 }` | Throws `Validation: year must be between 1900 and XXXX` |
| V-04 | Year too far future | `{ year: currentYear + 2 }` | Throws year validation error |
| V-05 | Negative price | `{ price: -100 }` | Throws `Validation: price must be non-negative` |
| V-06 | Invalid file type | File with type `image/gif` | Throws `unsupported type` |
| V-07 | File exceeds 10MB | 11MB JPEG file | Throws `exceeds 10MB` |
| V-08 | Total exceeds 50MB | 6 files × 9MB each | Throws `total image size exceeds 50MB` |
| V-09 | More than 20 images | 21 valid files | Throws `max 20 images allowed` |
| V-10 | Valid input (no images) | Complete data, no files | Passes validation |
| V-11 | Valid input (with images) | Complete data + 3 valid JPGs | Passes validation |
| V-12 | Whitespace-only brand | `{ brand: '   ' }` | Throws brand required |

---

## 2. UPLOAD TESTS

| # | Scenario | Setup | Expected Result |
|---|----------|-------|-----------------|
| U-01 | Successful upload (all) | 3 valid images, storage OK | `uploadedImages: 3, failedImages: 0` |
| U-02 | Partial failure | 3 images, 1 fails in storage | `uploadedImages: 2, failedImages: 1`, no rollback |
| U-03 | Total failure | 3 images, all fail | Throws `All 3 image uploads failed`, rollback triggered |
| U-04 | Timeout scenario | 1 image, uploadFileSecurely hangs >15s | Throws `Upload timeout`, rollback triggered |
| U-05 | DB insert fails after storage | Storage OK, vehicle_images insert fails | Error logged, image counted as failed |

---

## 3. IMAGE LOGIC TESTS

| # | Scenario | Setup | Expected Result |
|---|----------|-------|-----------------|
| I-01 | Order preservation | 5 images uploaded in order | `display_order` matches original index 0-4 |
| I-02 | Primary image = first | 3 images, all succeed | First image (index 0) has `is_primary: true` |
| I-03 | Single primary constraint | 3 images uploaded | Exactly 1 record with `is_primary: true` |
| I-04 | Primary after partial failure | Image 0 fails, 1 and 2 succeed | Image 1 (lowest surviving index) is primary |
| I-05 | Thumbnail = primary | 3 images | `vehicles.thumbnailurl` equals primary image URL |

---

## 4. ROLLBACK TESTS

| # | Scenario | Failure Point | Expected Cleanup |
|---|----------|---------------|-----------------|
| R-01 | Failure after vehicle insert | Image upload total failure | Vehicle record deleted |
| R-02 | Failure during upload | All uploads fail | vehicle_images, storage files, vehicle deleted |
| R-03 | Failure during finalize | `vehicles.update` fails | All related data cleaned up |
| R-04 | Rollback partial failure | Delete vehicle_images fails | Continues cleanup, logs error |
| R-05 | Rollback storage failure | Storage remove fails | Continues cleanup, logs error |

---

## 5. CONCURRENCY TESTS

| # | Scenario | Setup | Expected Result |
|---|----------|-------|-----------------|
| C-01 | Batch of 3 | 3 images | All processed in 1 batch |
| C-02 | Batch of 7 | 7 images | 3 batches (3+3+1) |
| C-03 | Batch of 20 | 20 images | 7 batches, all indexed correctly |
| C-04 | No duplicate display_order | 10 images | Each has unique `display_order` 0-9 |
| C-05 | No multiple primaries | 10 images | Exactly 1 `is_primary: true` |

---

## 6. BULK / STRESS TESTS

| # | Scenario | Setup | Expected Result |
|---|----------|-------|-----------------|
| B-01 | Sequential calls | 3 calls back-to-back | 3 separate vehicles created |
| B-02 | Parallel calls | 3 calls via Promise.all | All succeed independently |
| B-03 | Mixed success/failure | 5 calls, 2 with bad data | 3 succeed, 2 throw + rollback |
| B-04 | Max images + max size | 20 images × 2.5MB each | Succeeds (total = 50MB) |

---

## 7. EDGE CASES

| # | Scenario | Input | Expected Result |
|---|----------|-------|-----------------|
| E-01 | No images | Valid data, no files | Vehicle created, `uploadedImages: 0` |
| E-02 | Empty FileList | `images = new FileList()` | Same as no images |
| E-03 | Single image | 1 valid file | Uploaded, set as primary + thumbnail |
| E-04 | Max images (20) | 20 valid files | All uploaded, first is primary |
| E-05 | Duplicate file names | 3 files all named "photo.jpg" | All uploaded with unique paths |
| E-06 | 0-byte file | File with size 0 | Uploaded (passes size validation) |
| E-07 | Not authenticated | No session | Throws `Not authenticated` |
| E-08 | Status override to draft | `data.status = 'draft'` | Final status = 'draft' |
| E-09 | Status default available | `data.status = undefined` | Final status = 'available' |

---

## 8. CLIENT-SIDE VALIDATION (imageValidationV2)

| # | Scenario | Input | Expected Result |
|---|----------|-------|-----------------|
| CV-01 | Valid batch | 5 JPGs under 10MB | `isValid: true`, all files status `valid` |
| CV-02 | Mixed valid/invalid | 2 JPGs + 1 GIF | `isValid: false`, GIF marked invalid |
| CV-03 | Oversized file | 1 file at 12MB | File marked invalid with size error |
| CV-04 | Total size exceeded | 6 × 9MB files | `globalErrors` includes total size message |
| CV-05 | Over max count | 21 files | `globalErrors` includes count message |
| CV-06 | Preview generation | 3 valid images | All have non-null `previewUrl` |
| CV-07 | Cleanup previews | After revokeValidationPreviews | All `previewUrl` blob URLs revoked |

---

## 9. ERROR MAPPER (errorMapperV2)

| # | Error message | Mapped output (ES) |
|---|---------------|-------------------|
| EM-01 | `total image size exceeds 50MB` | `El tamaño total de las imágenes no puede superar 50MB` |
| EM-02 | `exceeds 10MB (12.3MB)` | `Cada imagen debe pesar menos de 10MB` |
| EM-03 | `unsupported type "image/gif"` | `Formato de imagen no permitido. Usa JPG, PNG o WEBP` |
| EM-04 | `brand is required` | `La marca es obligatoria` |
| EM-05 | `Upload timeout` | `La subida de imagen tardó demasiado. Inténtalo de nuevo` |
| EM-06 | `Unknown weird error` | `Error al subir imágenes. Inténtalo de nuevo` (fallback) |

---

## Execution Notes

- Tests should mock `supabase` client and `uploadFileSecurely`
- Use `vi.useFakeTimers()` for timeout tests
- Concurrency tests should verify batch ordering via mock call order
- Rollback tests should verify cleanup calls even when cleanup itself fails
