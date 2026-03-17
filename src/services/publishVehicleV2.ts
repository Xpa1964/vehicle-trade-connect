// 🚫 CRITICAL MODULE (PRE-LOCK)
// Stabilized version — pending admin lock

/**
 * publishVehicleV2 — Isolated, production-ready vehicle publication service
 *
 * ZERO dependencies on hooks, UI, legacy services, or toasts.
 * Self-contained: validation → draft insert → image upload → finalize.
 * Includes rollback on critical failure.
 */

import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileSecurely } from '@/utils/secureUpload';
import type { VehicleFormData } from '@/types/vehicle';

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_IMAGES = 20;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES: ReadonlySet<string> = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const UPLOAD_CONCURRENCY = 3;

// ─── Types ───────────────────────────────────────────────────────────────────

export type PublishSource = 'form' | 'bulk' | 'api';

export interface PublishVehicleV2Input {
  data: VehicleFormData;
  images?: File[] | FileList;
  source: PublishSource;
}

export interface PublishVehicleV2Result {
  id: string;
  uploadedImages: number;
  failedImages: number;
}

interface UploadedImage {
  url: string;
  originalIndex: number;
}

interface UploadError {
  fileName: string;
  error: string;
  index: number;
}

interface ImageUploadResult {
  uploaded: UploadedImage[];
  errors: UploadError[];
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validateInput(data: VehicleFormData, files: File[]): void {
  console.log('[V2] VALIDATION — start');

  if (!data.brand || data.brand.trim().length === 0) {
    throw new Error('Validation: brand is required');
  }
  if (!data.model || data.model.trim().length === 0) {
    throw new Error('Validation: model is required');
  }

  const currentYear = new Date().getFullYear();
  if (!data.year || data.year < 1900 || data.year > currentYear + 1) {
    throw new Error(`Validation: year must be between 1900 and ${currentYear + 1}`);
  }

  if (data.price == null || data.price < 0) {
    throw new Error('Validation: price must be non-negative');
  }

  if (files.length > MAX_IMAGES) {
    throw new Error(`Validation: max ${MAX_IMAGES} images allowed, got ${files.length}`);
  }

  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw new Error(
        `Validation: file "${file.name}" has unsupported type "${file.type}". Allowed: jpeg, png, webp`
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `Validation: file "${file.name}" exceeds 10MB (${(file.size / 1024 / 1024).toFixed(1)}MB)`
      );
    }
  }

  console.log('[V2] VALIDATION — passed');
}

// ─── Concurrency-limited upload ──────────────────────────────────────────────

async function uploadImagesWithConcurrency(
  files: File[],
  vehicleId: string,
  concurrency: number
): Promise<ImageUploadResult> {
  const uploaded: UploadedImage[] = [];
  const errors: UploadError[] = [];

  // Process in batches of `concurrency`
  for (let batchStart = 0; batchStart < files.length; batchStart += concurrency) {
    const batch = files.slice(batchStart, batchStart + concurrency);
    const batchIndices = batch.map((_, i) => batchStart + i);

    console.log(
      `[V2] UPLOAD — batch ${Math.floor(batchStart / concurrency) + 1}: indices ${batchIndices.join(', ')}`
    );

    const batchResults = await Promise.allSettled(
      batch.map(async (file, localIdx) => {
        const globalIndex = batchStart + localIdx;

        const { publicUrl, error: uploadError } = await uploadFileSecurely(
          file,
          'vehicles',
          vehicleId
        );

        if (uploadError || !publicUrl) {
          const msg = typeof uploadError === 'string' ? uploadError : 'Upload failed';
          throw { fileName: file.name, error: msg, index: globalIndex };
        }

        // Insert DB record with neutral primary state
        const { error: insertError } = await supabase
          .from('vehicle_images')
          .insert({
            vehicle_id: vehicleId,
            image_url: publicUrl,
            is_primary: false,
            display_order: globalIndex,
          });

        if (insertError) {
          throw { fileName: file.name, error: insertError.message, index: globalIndex };
        }

        return { url: publicUrl, originalIndex: globalIndex } satisfies UploadedImage;
      })
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        uploaded.push(result.value);
      } else {
        const reason = result.reason as UploadError;
        console.error(`❌ [V2] UPLOAD — failed: ${reason.fileName} — ${reason.error}`);
        errors.push(reason);
      }
    }
  }

  // Sort by original user-selected order (not async completion order)
  uploaded.sort((a, b) => a.originalIndex - b.originalIndex);

  return { uploaded, errors };
}

// ─── Primary image assignment ────────────────────────────────────────────────

async function assignPrimaryImage(vehicleId: string, primaryUrl: string): Promise<void> {
  // Reset all images for this vehicle to non-primary
  const { error: resetError } = await supabase
    .from('vehicle_images')
    .update({ is_primary: false })
    .eq('vehicle_id', vehicleId);

  if (resetError) {
    console.error('❌ [V2] Error resetting primary images:', resetError.message);
  }

  // Set exactly one primary
  const { error: setError } = await supabase
    .from('vehicle_images')
    .update({ is_primary: true })
    .eq('vehicle_id', vehicleId)
    .eq('image_url', primaryUrl);

  if (setError) {
    console.error('❌ [V2] Error setting primary image:', setError.message);
  }
}

// ─── Rollback ────────────────────────────────────────────────────────────────

async function rollback(vehicleId: string, uploadedUrls: string[]): Promise<void> {
  console.warn(`⚠️ [V2] ROLLBACK — cleaning up vehicle ${vehicleId}`);

  // Best-effort: delete vehicle_images records
  const { error: imgDelError } = await supabase
    .from('vehicle_images')
    .delete()
    .eq('vehicle_id', vehicleId);

  if (imgDelError) {
    console.error('❌ [V2] ROLLBACK — failed to delete vehicle_images:', imgDelError.message);
  }

  // Best-effort: delete metadata
  const { error: metaDelError } = await supabase
    .from('vehicle_metadata')
    .delete()
    .eq('vehicle_id', vehicleId);

  if (metaDelError) {
    console.error('❌ [V2] ROLLBACK — failed to delete metadata:', metaDelError.message);
  }

  // Best-effort: delete equipment
  const { error: eqDelError } = await supabase
    .from('vehicle_equipment')
    .delete()
    .eq('vehicle_id', vehicleId);

  if (eqDelError) {
    console.error('❌ [V2] ROLLBACK — failed to delete equipment:', eqDelError.message);
  }

  // Best-effort: remove uploaded files from storage
  if (uploadedUrls.length > 0) {
    // Extract storage paths from public URLs
    // Format: .../storage/v1/object/public/vehicles/<vehicleId>/<filename>
    const storagePaths = uploadedUrls
      .map((url) => {
        const marker = '/storage/v1/object/public/vehicles/';
        const idx = url.indexOf(marker);
        if (idx === -1) return null;
        return url.substring(idx + marker.length);
      })
      .filter((p): p is string => p !== null);

    if (storagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('vehicles')
        .remove(storagePaths);

      if (storageError) {
        console.error('❌ [V2] ROLLBACK — failed to remove storage files:', storageError.message);
      }
    }
  }

  // Best-effort: delete the vehicle record itself
  const { error: vehDelError } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicleId);

  if (vehDelError) {
    console.error('❌ [V2] ROLLBACK — failed to delete vehicle:', vehDelError.message);
  }

  console.warn(`⚠️ [V2] ROLLBACK — complete for ${vehicleId}`);
}

// ─── Main Function ───────────────────────────────────────────────────────────

export async function publishVehicleV2({
  data,
  images,
  source,
}: PublishVehicleV2Input): Promise<PublishVehicleV2Result> {
  console.log(`[V2] START — source: ${source}`);

  // ── 1. Auth ──
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // ── 2. Normalize files ──
  const filesArray: File[] = images
    ? (images instanceof FileList ? Array.from(images) : [...images])
    : [];

  // ── 3. Validate (BEFORE any DB/storage op) ──
  validateInput(data, filesArray);

  // ── 4. Create vehicle (draft) ──
  const vehicleId = uuidv4();
  console.log(`[V2] INSERT — vehicleId: ${vehicleId}`);

  const vehicleRow: Record<string, unknown> = {
    id: vehicleId,
    seller_id: userId,
    user_id: userId,
    brand: data.brand.trim(),
    model: data.model.trim(),
    year: data.year,
    price: data.price,
    mileage: data.mileage ?? 0,
    location: data.location?.trim() || null,
    country: data.country?.trim() || null,
    country_code: data.countryCode || null,
    status: 'draft',
    type: data.fuel || null,
    condition: 'used',
    description: data.description || '',
    fuel: data.fuel || null,
    transmission: data.transmission || null,
    vin: data.vin || null,
    license_plate: data.licensePlate || null,
    registration_date: data.registrationDate
      ? data.registrationDate.toISOString().split('T')[0]
      : null,
    vehicle_type: data.vehicleType || null,
    transaction_type: data.transactionType || 'national',
    accepts_exchange: data.acceptsExchange || false,
    engine_size: data.engineSize || null,
    engine_power: data.enginePower || null,
    color: data.color || null,
    doors: data.doors || null,
    euro_standard: data.euroStandard || null,
    co2_emissions: data.co2Emissions || null,
    commission_sale: data.commissionSale || false,
    public_sale_price: data.publicSalePrice || null,
    commission_amount: data.commissionAmount || null,
    commission_query: data.commissionQuery || null,
    version: data.version?.trim() || null,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: vehicleError } = await (supabase as any)
    .from('vehicles')
    .insert(vehicleRow);

  if (vehicleError) {
    console.error(`❌ [V2] INSERT — failed:`, vehicleError.message);
    throw new Error(`Vehicle creation failed: ${vehicleError.message}`);
  }

  console.log(`[V2] INSERT — success`);

  // Track uploaded URLs for potential rollback
  const uploadedUrls: string[] = [];

  try {
    // ── 5. Image upload (controlled concurrency) ──
    let thumbnailUrl: string | null = null;
    let uploadedCount = 0;
    let failedCount = 0;

    if (filesArray.length > 0) {
      console.log(`[V2] UPLOAD — ${filesArray.length} images, concurrency: ${UPLOAD_CONCURRENCY}`);

      const { uploaded, errors } = await uploadImagesWithConcurrency(
        filesArray,
        vehicleId,
        UPLOAD_CONCURRENCY
      );

      uploadedCount = uploaded.length;
      failedCount = errors.length;

      console.log(`[V2] UPLOAD — result: ${uploadedCount} success, ${failedCount} failed`);

      // Collect URLs for rollback
      for (const img of uploaded) {
        uploadedUrls.push(img.url);
      }

      // Total failure
      if (uploadedCount === 0) {
        throw new Error(`All ${filesArray.length} image uploads failed`);
      }

      // Partial failure — log warnings
      if (failedCount > 0) {
        console.warn(`⚠️ [V2] UPLOAD — ${failedCount} images failed:`, errors);
      }

      // Set primary image (first in user-selected order)
      const primaryUrl = uploaded[0].url;
      await assignPrimaryImage(vehicleId, primaryUrl);
      thumbnailUrl = primaryUrl;

      console.log(`[V2] UPLOAD — primary set: ${primaryUrl.slice(-40)}`);
    }

    // ── 6. Metadata (non-blocking) ──
    const { error: metaError } = await supabase
      .from('vehicle_metadata')
      .insert({
        vehicle_id: vehicleId,
        mileage_unit: data.mileageUnit || 'km',
        units: data.units || 1,
        iva_status: data.ivaStatus || 'included',
        coc_status: data.cocStatus ?? false,
      });

    if (metaError) {
      console.warn(`⚠️ [V2] Metadata insert failed (non-critical): ${metaError.message}`);
    }

    // ── 7. Equipment (non-blocking) ──
    if (data.equipment && data.equipment.length > 0) {
      const equipmentRows = data.equipment.map((key) => ({
        vehicle_id: vehicleId,
        name: key,
      }));

      const { error: eqError } = await supabase
        .from('vehicle_equipment')
        .insert(equipmentRows);

      if (eqError) {
        console.warn(`⚠️ [V2] Equipment insert failed (non-critical): ${eqError.message}`);
      }
    }

    // ── 8. Finalize ──
    const finalStatus = data.status === 'draft' ? 'draft' : 'available';
    const finalUpdate: Record<string, unknown> = { status: finalStatus };

    if (thumbnailUrl) {
      finalUpdate.thumbnailurl = thumbnailUrl;
    }

    console.log(`[V2] FINALIZE — status: ${finalStatus}`);

    const { error: finalizeError } = await supabase
      .from('vehicles')
      .update(finalUpdate)
      .eq('id', vehicleId);

    if (finalizeError) {
      console.error(`❌ [V2] FINALIZE — failed:`, finalizeError.message);
      throw new Error(`Vehicle finalization failed: ${finalizeError.message}`);
    }

    console.log(`[V2] FINALIZE — success: ${vehicleId}`);

    return {
      id: vehicleId,
      uploadedImages: uploadedCount,
      failedImages: failedCount,
    };
  } catch (error) {
    // ── ROLLBACK on any post-insert failure ──
    console.error(`❌ [V2] ERROR — triggering rollback for ${vehicleId}`);
    await rollback(vehicleId, uploadedUrls);
    throw error;
  }
}
