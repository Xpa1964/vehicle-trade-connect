import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

import { getSupabaseAdminClient, getSupabaseAuthClient, getAuthenticatedUser } from "./auth.ts"
import { checkRateLimit, logBlockedRateLimit } from "./rateLimiting.ts"
import { validateFile, sanitizeFilename } from "./fileValidation.ts"
import { uploadFileToSupabaseStorage } from "./storage.ts"
import { logAudit } from "./audit.ts"
import { scanFileWithVirusTotal } from "./virusScanning.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authClient = getSupabaseAuthClient();
    const adminClient = getSupabaseAdminClient();

    const { user, error: authError } = await getAuthenticatedUser(authClient, req);
    if (authError || !user) {
      console.error('Auth failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { recentUploadCount, dailyUploadCount, now } = await checkRateLimit(adminClient, user.id);
    if (recentUploadCount >= 20 || dailyUploadCount >= 100) {
      await logBlockedRateLimit(adminClient, user.id, recentUploadCount, dailyUploadCount, now);
      return new Response(
        JSON.stringify({ error: 'Límite de subida alcanzado. Intenta más tarde.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const bucketName = formData.get('bucket') as string
    const folder = formData.get('folder') as string

    if (file && file.size === 0) {
      console.error('File received with size 0 - possible corruption during transfer');
      return new Response(
        JSON.stringify({ error: 'File received is empty - possible corruption during transfer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file received' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Bucket name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file object received' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (file.size === 0) {
      return new Response(
        JSON.stringify({ error: 'File is empty or corrupted' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const validationResult = validateFile(file)
    if (!validationResult.valid) {
      return new Response(
        JSON.stringify({ error: validationResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const virusScanResult = await scanFileWithVirusTotal(file);

    if (!virusScanResult.safe) {
      await logAudit(adminClient, user.id, file.name, bucketName, now, {
        action: 'virus_detected',
        detections: virusScanResult.detections,
        scanId: virusScanResult.scanId
      });
      return new Response(
        JSON.stringify({
          error: 'File contains malware or suspicious content',
          details: `${virusScanResult.detections} security engines flagged this file`,
          scanId: virusScanResult.scanId
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const clientSanitizedName = formData.get('sanitizedFilename') as string
    const sanitizedFilename = clientSanitizedName || sanitizeFilename(file.name)

    const userFolder = user.id
    const filePath = folder ? `${userFolder}/${folder}/${sanitizedFilename}` : `${userFolder}/${sanitizedFilename}`

    const { data, error } = await uploadFileToSupabaseStorage(adminClient, bucketName, filePath, file);

    if (error) {
      console.error('Upload storage error:', error.message);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    await logAudit(adminClient, user.id, filePath, bucketName, now);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'File uploaded successfully',
        path: data.path,
        fullPath: data.fullPath
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    console.error('Unexpected error in secure-file-upload:', error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})