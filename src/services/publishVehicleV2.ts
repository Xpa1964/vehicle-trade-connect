/**
 * publishVehicleV2 — Isolated vehicle publication system
 * 
 * This is a NEW parallel system. It does NOT modify or depend on:
 * - useVehicleSubmit / useVehicleForm / handleImageUploads
 * - Bulk upload or API sync flows
 * - Any existing hooks or UI logic
 * 
 * Future goal: unify form, bulk, and API publication under one function.
 */

import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileSecurely } from '@/utils/secureUpload';
import { VehicleFormData } from '@/types/vehicle';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PublishSource = 'form' | 'bulk' | 'api';

export interface PublishVehicleV2Input {
  data: VehicleFormData;
  images?: File[] | FileList;
  source: PublishSource;
}

export interface PublishVehicleV2Result {
  id: string;
}

interface UploadedImage {
  url: string;
  originalIndex: number;
}

interface UploadError {
  fileName: string;
  error: string;
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validateInput(data: VehicleFormData): void {
  if (!data.brand || data.brand.trim().length === 0) {
    throw new Error('Validation failed: brand is required');
  }
  if (!data.model || data.model.trim().length === 0) {
    throw new Error('Validation failed: model is required');
  }
  if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
    throw new Error('Validation failed: year is invalid');
  }
  if (data.price == null || data.price < 0) {
    throw new Error('Validation failed: price must be non-negative');
  }
}

// ─── Image Upload (isolated, no dependency on handleImageUploads) ────────────

async function uploadImagesV2(
  images: File[],
  vehicleId: string
): Promise<{ uploaded: UploadedImage[]; errors: UploadError[] }> {
  const uploaded: UploadedImage[] = [];
  const errors: UploadError[] = [];

  const promises = images.map(async (file, index) => {
    try {
      const { publicUrl, error: uploadError } = await uploadFileSecurely(
        file,
        'vehicles',
        vehicleId
      );

      if (uploadError || !publicUrl) {
        const msg = typeof uploadError === 'string'
          ? uploadError
          : 'Upload failed';
        console.error(`❌ [V2] Image ${index} upload failed:`, msg);
        errors.push({ fileName: file.name, error: msg });
        return;
      }

      // Insert image record with neutral primary state
      const { error: insertError } = await supabase
        .from('vehicle_images')
        .insert({
          vehicle_id: vehicleId,
          image_url: publicUrl,
          is_primary: false,
          display_order: index,
        });

      if (insertError) {
        console.error(`❌ [V2] Image ${index} DB insert failed:`, insertError.message);
        errors.push({ fileName: file.name, error: insertError.message });
        return;
      }

      uploaded.push({ url: publicUrl, originalIndex: index });
    } catch (err: any) {
      console.error(`❌ [V2] Image ${index} unexpected error:`, err);
      errors.push({ fileName: file.name, error: err?.message || 'Unknown error' });
    }
  });

  await Promise.all(promises);

  // Sort by original user-selected order
  uploaded.sort((a, b) => a.originalIndex - b.originalIndex);

  return { uploaded, errors };
}

async function setPrimaryImage(vehicleId: string, primaryUrl: string): Promise<void> {
  // Reset all to non-primary
  const { error: resetError } = await supabase
    .from('vehicle_images')
    .update({ is_primary: false })
    .eq('vehicle_id', vehicleId);

  if (resetError) {
    console.error('❌ [V2] Error resetting primary images:', resetError);
  }

  // Set the correct one as primary
  const { error: setError } = await supabase
    .from('vehicle_images')
    .update({ is_primary: true })
    .eq('vehicle_id', vehicleId)
    .eq('image_url', primaryUrl);

  if (setError) {
    console.error('❌ [V2] Error setting primary image:', setError);
  }
}

// ─── Main Function ───────────────────────────────────────────────────────────

export async function publishVehicleV2({
  data,
  images,
  source,
}: PublishVehicleV2Input): Promise<PublishVehicleV2Result> {
  console.log(`🚀 [V2] Starting publication (source: ${source})`);

  // ── 1. Auth check ──
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // ── 2. Validate input ──
  validateInput(data);

  // ── 3. Create vehicle as draft ──
  const vehicleId = uuidv4();

  const vehicleRow = {
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

  console.log('📝 [V2] Inserting vehicle (draft):', vehicleId);

  const { error: vehicleError } = await (supabase as any)
    .from('vehicles')
    .insert(vehicleRow);

  if (vehicleError) {
    console.error('❌ [V2] Vehicle insert failed:', vehicleError);
    throw new Error(`Vehicle creation failed: ${vehicleError.message}`);
  }

  // ── 4. Handle images ──
  let thumbnailUrl: string | null = null;
  const filesArray = images
    ? (images instanceof FileList ? Array.from(images) : images)
    : [];

  if (filesArray.length > 0) {
    console.log(`🖼️ [V2] Uploading ${filesArray.length} images`);

    const { uploaded, errors } = await uploadImagesV2(filesArray, vehicleId);

    console.log(`📸 [V2] Images: ${uploaded.length}/${filesArray.length} success, ${errors.length} failed`);

    // Total failure → throw
    if (uploaded.length === 0) {
      throw new Error('All image uploads failed');
    }

    // Partial failure → warn (caller decides how to surface)
    if (errors.length > 0) {
      console.warn('⚠️ [V2] Partial image failures:', errors);
    }

    // Set primary image (first in user-selected order)
    const primaryUrl = uploaded[0].url;
    await setPrimaryImage(vehicleId, primaryUrl);
    thumbnailUrl = primaryUrl;
  }

  // ── 5. Save metadata ──
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
    console.warn('⚠️ [V2] Metadata insert failed (non-critical):', metaError.message);
  }

  // ── 6. Save equipment ──
  if (data.equipment && data.equipment.length > 0) {
    const equipmentRows = data.equipment.map((key) => ({
      vehicle_id: vehicleId,
      name: key,
    }));

    const { error: eqError } = await supabase
      .from('vehicle_equipment')
      .insert(equipmentRows);

    if (eqError) {
      console.warn('⚠️ [V2] Equipment insert failed (non-critical):', eqError.message);
    }
  }

  // ── 7. Finalize: set status + thumbnail ──
  const finalUpdate: Record<string, any> = {
    status: data.status === 'draft' ? 'draft' : 'available',
  };

  if (thumbnailUrl) {
    finalUpdate.thumbnailurl = thumbnailUrl;
  }

  const { error: finalizeError } = await supabase
    .from('vehicles')
    .update(finalUpdate)
    .eq('id', vehicleId);

  if (finalizeError) {
    console.error('❌ [V2] Finalize update failed:', finalizeError);
    throw new Error(`Vehicle finalization failed: ${finalizeError.message}`);
  }

  console.log(`✅ [V2] Vehicle published: ${vehicleId} (status: ${finalUpdate.status})`);

  return { id: vehicleId };
}
