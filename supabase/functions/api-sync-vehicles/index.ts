import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkGlobalRateLimit, getClientIdentifier, createRateLimitResponse } from "../_shared/globalRateLimiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check global rate limit first (100 req/min, 5000 req/hour for API sync)
    const clientId = getClientIdentifier(req);
    const rateLimitResult = await checkGlobalRateLimit(
      supabase,
      clientId,
      'api-sync-vehicles',
      { perMinute: 100, perHour: 5000 }
    );
    
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, corsHeaders);
    }

    // Get API key from header
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate API key with rate limiting
    const { data: validationResult, error: validationError } = await supabase.rpc(
      'validate_partner_api_key_with_rate_limit',
      { p_api_key: apiKey }
    );

    if (validationError || !validationResult?.valid) {
      console.error('API key validation error:', validationError || validationResult);
      
      if (validationResult?.error === 'rate_limit_exceeded') {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            limit: validationResult.limit,
            retry_after: validationResult.retry_after
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': validationResult.retry_after.toString() } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Invalid or expired API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = validationResult.user_id;
    const apiKeyId = validationResult.key_id;
    // API key validated successfully

    // Handle different methods
    if (req.method === 'POST') {
      return await handleInventorySync(req, supabase, userId, apiKeyId);
    } else if (req.method === 'DELETE') {
      return await handleDelete(req, supabase, userId);
    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: unknown) {
    console.error('Error in api-sync-vehicles:', error);
    
    // Try to notify user of complete failure (best-effort)
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const apiKey = req.headers.get('x-api-key');
      if (apiKey) {
        const failSupabase = createClient(supabaseUrl, supabaseKey);
        const { data: keyData } = await failSupabase
          .from('partner_api_keys')
          .select('user_id')
          .eq('api_key', apiKey)
          .eq('is_active', true)
          .maybeSingle();
        
        if (keyData?.user_id) {
          await failSupabase.rpc('create_system_notification', {
            p_user_id: keyData.user_id,
            p_title: 'La sincronización API falló',
            p_message: 'La sincronización API falló. Comprueba tu conexión y los datos enviados, o contacta con soporte si el problema persiste.',
            p_type: 'error',
            p_link: '/api-management',
            p_subject: 'Error en sincronización API'
          });
        }
      }
    } catch (notifErr: unknown) {
      console.error('Failed to send failure notification:', notifErr instanceof Error ? notifErr.message : String(notifErr));
    }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * INVENTORY RECONCILIATION
 * Each POST represents the COMPLETE CURRENT INVENTORY of the partner.
 * - Upsert vehicles by (partner_id + external_id)
 * - Mark unseen vehicles as unpublished (never delete)
 */
async function handleInventorySync(req: Request, supabase: any, userId: string, apiKeyId?: string) {
  const { vehicles } = await req.json();

  if (!vehicles || !Array.isArray(vehicles)) {
    return new Response(
      JSON.stringify({ error: 'Invalid request: vehicles array is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Inventory sync started

  // 1) Generate sync timestamp
  const syncTimestamp = new Date().toISOString();

  const results = {
    processed: vehicles.length,
    created: 0,
    updated: 0,
    deactivated: 0,
    errors: [] as { external_id: string; reason: string }[]
  };

  // 2) Process each vehicle (upsert)
  for (const vehicle of vehicles) {
    try {
      const { external_id, images, ...vehicleData } = vehicle;

      if (!external_id) {
        results.errors.push({ external_id: 'missing', reason: 'external_id is required' });
        continue;
      }

      // Validate language field
      if (!vehicleData.language) {
        results.errors.push({ external_id, reason: 'language field is required (ISO code, e.g. "es", "en", "fr")' });
        continue;
      }

      // Check if vehicle exists by (partner_id + external_id)
      const { data: existingVehicle } = await supabase
        .from('vehicles')
        .select('id')
        .eq('partner_id', userId)
        .eq('external_id', external_id)
        .maybeSingle();

      // Normalize and prepare vehicle data
      const dbVehicleData = {
        seller_id: userId,
        partner_id: userId,
        external_id,
        source: 'api' as const,
        last_seen_at: syncTimestamp,
        language: vehicleData.language,
        brand: vehicleData.brand || '',
        model: vehicleData.model || '',
        version: vehicleData.version || '',
        color: vehicleData.color || '',
        license_plate: vehicleData.license_plate || '',
        price: vehicleData.price || 0,
        currency: vehicleData.currency || 'EUR',
        status: normalizeStatus(vehicleData.status) || 'available',
        fuel_type: normalizeFuelType(vehicleData.fuel_type),
        transmission: normalizeTransmission(vehicleData.transmission),
        body_type: normalizeBodyType(vehicleData.body_type),
        year: vehicleData.year,
        mileage: vehicleData.mileage,
        doors: vehicleData.doors,
        seats: vehicleData.seats,
        description: vehicleData.description,
      };

      let vehicleId: string;

      if (existingVehicle) {
        // Update existing vehicle - re-activate if it was deactivated
        const { error: updateError } = await supabase
          .from('vehicles')
          .update({ ...dbVehicleData, status: normalizeStatus(vehicleData.status) || 'available' })
          .eq('id', existingVehicle.id);

        if (updateError) throw updateError;
        vehicleId = existingVehicle.id;
        results.updated++;
        // Vehicle updated
      } else {
        // Insert new vehicle
        const { data: newVehicle, error: insertError } = await supabase
          .from('vehicles')
          .insert(dbVehicleData)
          .select('id')
          .single();

        if (insertError) throw insertError;
        vehicleId = newVehicle.id;
        results.created++;
        // Vehicle created
      }

      // Handle images if provided (limit 25)
      if (images && Array.isArray(images) && images.length > 0) {
        const MAX_IMAGES = 25;
        const imagesToProcess = images.slice(0, MAX_IMAGES);
        
        if (images.length > MAX_IMAGES) {
          // Images limited to MAX_IMAGES
        }
        
        await processImages(supabase, vehicleId, imagesToProcess);
      }
    } catch (error: unknown) {
      console.error(`Error processing vehicle ${vehicle.external_id}:`, error);
      results.errors.push({
        external_id: vehicle.external_id || 'unknown',
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 3) RECONCILIATION: Deactivate vehicles not seen in this sync
  try {
    const { data: deactivated, error: deactivateError } = await supabase
      .from('vehicles')
      .update({ status: 'inactive' })
      .eq('partner_id', userId)
      .eq('source', 'api')
      .lt('last_seen_at', syncTimestamp)
      .neq('status', 'inactive')
      .select('id');

    if (deactivateError) {
      console.error('Error deactivating stale vehicles:', deactivateError);
    } else {
      results.deactivated = deactivated?.length || 0;
      if (results.deactivated > 0) {
        // Vehicles deactivated
      }
    }
  } catch (error: unknown) {
    console.error('Error in reconciliation:', error);
  }

  // Log sync activity
  await supabase.from('api_sync_logs').insert({
    api_key_id: apiKeyId,
    action: 'inventory_sync',
    vehicle_count: results.processed,
    success_count: results.created + results.updated,
    error_count: results.errors.length,
    details: {
      created: results.created,
      updated: results.updated,
      deactivated: results.deactivated,
      errors: results.errors.length > 0 ? results.errors : null,
      sync_timestamp: syncTimestamp
    }
  });

  // Send notification to API key owner if there were errors
  if (results.errors.length > 0) {
    try {
      await supabase.rpc('create_system_notification', {
        p_user_id: userId,
        p_title: 'Sincronización API completada con errores',
        p_message: `Sincronización API completada con errores: ${results.errors.length} vehículo(s) no pudieron procesarse. Revisa el historial de sincronización para más detalles.`,
        p_type: 'warning',
        p_link: '/api-management',
        p_subject: 'Sincronización API con errores'
      });
      // Error notification sent
    } catch (notifError: unknown) {
      console.error('Failed to send error notification:', notifError instanceof Error ? notifError.message : String(notifError));
    }
  }

  // Sync complete

  return new Response(
    JSON.stringify({
      success: true,
      processed: results.processed,
      created: results.created,
      updated: results.updated,
      deactivated: results.deactivated,
      errors: results.errors
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleDelete(req: Request, supabase: any, userId: string) {
  const url = new URL(req.url);
  const externalId = url.pathname.split('/').pop();

  if (!externalId) {
    return new Response(
      JSON.stringify({ error: 'external_id is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Soft-delete: mark as inactive instead of physical delete
  const { error } = await supabase
    .from('vehicles')
    .update({ status: 'inactive' })
    .eq('partner_id', userId)
    .eq('external_id', externalId);

  if (error) {
    console.error('Error deactivating vehicle:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Vehicle deactivated

  return new Response(
    JSON.stringify({ success: true, message: 'Vehicle deactivated successfully' }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Normalization functions for common value variations across 9 European languages
function normalizeFuelType(fuel: string | undefined): string | undefined {
  if (!fuel) return undefined;
  const normalized = fuel.toLowerCase().trim();
  
  const fuelMap: { [key: string]: string } = {
    // Spanish
    'gasolina': 'gasoline',
    'diesel': 'diesel',
    'gasoil': 'diesel',
    'electrico': 'electric',
    'eléctrico': 'electric',
    'hibrido': 'hybrid',
    'híbrido': 'hybrid',
    'glp': 'lpg',
    'gas': 'lpg',
    
    // English
    'petrol': 'gasoline',
    'gasoline': 'gasoline',
    'electric': 'electric',
    'hybrid': 'hybrid',
    'lpg': 'lpg',
    
    // French
    'essence': 'gasoline',
    'gazole': 'diesel',
    'électrique': 'electric',
    'hybride': 'hybrid',
    'gpl': 'lpg',
    
    // Italian
    'benzina': 'gasoline',
    'gasolio': 'diesel',
    'elettrico': 'electric',
    'ibrido': 'hybrid',
    
    // German
    'benzin': 'gasoline',
    'elektrisch': 'electric',
    
    // Portuguese
    'gasóleo': 'diesel',
    'elétrico': 'electric',
    
    // Polish
    'benzyna': 'gasoline',
    'olej napędowy': 'diesel',
    'elektryczny': 'electric',
    'hybrydowy': 'hybrid',
    
    // Danish
    'elektrisk': 'electric',
  };
  
  return fuelMap[normalized] || fuel;
}

function normalizeTransmission(transmission: string | undefined): string | undefined {
  if (!transmission) return undefined;
  const normalized = transmission.toLowerCase().trim();
  
  const transMap: { [key: string]: string } = {
    'manual': 'manual',
    'automatica': 'automatic',
    'automática': 'automatic',
    'semiautomatica': 'semi-automatic',
    'semiautomática': 'semi-automatic',
    'automatic': 'automatic',
    'auto': 'automatic',
    'semi-automatic': 'semi-automatic',
    'manuelle': 'manual',
    'automatique': 'automatic',
    'semi-automatique': 'semi-automatic',
    'manuale': 'manual',
    'automatico': 'automatic',
    'semiautomatico': 'semi-automatic',
    'schaltgetriebe': 'manual',
    'automatik': 'automatic',
    'halbautomatik': 'semi-automatic',
    'handgeschakeld': 'manual',
    'automaat': 'automatic',
    'semi-automaat': 'semi-automatic',
    'manualna': 'manual',
    'automatyczna': 'automatic',
    'półautomatyczna': 'semi-automatic',
    'manuel': 'manual',
    'automatisk': 'automatic',
    'semi-automatisk': 'semi-automatic',
  };
  
  return transMap[normalized] || transmission;
}

function normalizeBodyType(bodyType: string | undefined): string | undefined {
  if (!bodyType) return undefined;
  const normalized = bodyType.toLowerCase().trim();
  
  const bodyMap: { [key: string]: string } = {
    'sedan': 'sedan',
    'berlina': 'sedan',
    'suv': 'suv',
    'todoterreno': 'suv',
    'hatchback': 'hatchback',
    'compacto': 'hatchback',
    'coupe': 'coupe',
    'coupé': 'coupe',
    'familiar': 'wagon',
    'monovolumen': 'minivan',
    'wagon': 'wagon',
    'minivan': 'minivan',
    'pickup': 'pickup',
    'truck': 'pickup',
    'berline': 'sedan',
    'break': 'wagon',
    'monospace': 'minivan',
    'station wagon': 'wagon',
    'monovolume': 'minivan',
    'limousine': 'sedan',
    'kombi': 'wagon',
    'van': 'minivan',
    'stationwagen': 'wagon',
    'mpv': 'minivan',
    'carrinha': 'wagon',
    'cupê': 'coupe',
    'stationcar': 'wagon',
  };
  
  return bodyMap[normalized] || bodyType;
}

function normalizeStatus(status: string | undefined): string {
  if (!status) return 'available';
  const normalized = status.toLowerCase().trim();
  
  const statusMap: { [key: string]: string } = {
    'disponible': 'available',
    'vendido': 'sold',
    'reservado': 'reserved',
    'available': 'available',
    'sold': 'sold',
    'reserved': 'reserved',
    'vendu': 'sold',
    'réservé': 'reserved',
    'disponibile': 'available',
    'venduto': 'sold',
    'riservato': 'reserved',
    'verfügbar': 'available',
    'verkauft': 'sold',
    'reserviert': 'reserved',
    'beschikbaar': 'available',
    'verkocht': 'sold',
    'gereserveerd': 'reserved',
    'disponível': 'available',
    'dostępny': 'available',
    'sprzedany': 'sold',
    'zarezerwowany': 'reserved',
    'tilgængelig': 'available',
    'solgt': 'sold',
    'reserveret': 'reserved',
  };
  
  return statusMap[normalized] || 'available';
}

async function processImages(supabase: any, vehicleId: string, imageUrls: string[]) {
  console.log(`🖼️ Processing ${imageUrls.length} images for vehicle ${vehicleId}`);

  // Delete previous API-sourced images (DB records only, not storage files)
  const { error: deleteError } = await supabase
    .from('vehicle_images')
    .delete()
    .eq('vehicle_id', vehicleId)
    .eq('source', 'api');

  if (deleteError) {
    console.error('Error deleting previous API images:', deleteError);
  } else {
    console.log(`🗑️ Cleaned previous API images for vehicle ${vehicleId}`);
  }

  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const imageUrl = imageUrls[i];
      
      // Download image from URL
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        console.error(`Failed to download image: ${imageUrl}`);
        continue;
      }

      const imageBlob = await imageResponse.blob();
      const fileExt = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `${vehicleId}/${Date.now()}_${i}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicles')
        .upload(fileName, imageBlob, {
          contentType: imageBlob.type || 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicles')
        .getPublicUrl(fileName);

      // Insert into vehicle_images table with source = 'api'
      await supabase.from('vehicle_images').insert({
        vehicle_id: vehicleId,
        image_url: publicUrl,
        display_order: i,
        is_primary: i === 0,
        source: 'api'
      });

      // Update vehicle thumbnail if first image
      if (i === 0) {
        await supabase
          .from('vehicles')
          .update({ thumbnailurl: publicUrl })
          .eq('id', vehicleId);
      }

      console.log(`✅ Processed image ${i + 1}/${imageUrls.length}`);
    } catch (error) {
      console.error(`Error processing image ${i}:`, error);
    }
  }
}
