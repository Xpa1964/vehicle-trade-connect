import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

import { getSupabaseClient, getAuthenticatedUser } from "./auth.ts"
import { checkRateLimit, logBlockedRateLimit } from "./rateLimiting.ts"
import { validateFile, sanitizeFilename } from "./fileValidation.ts"
import { uploadFileToSupabaseStorage } from "./storage.ts"
import { logAudit } from "./audit.ts"
import { scanFileWithVirusTotal } from "./virusScanning.ts"

serve(async (req) => {
  console.log('🚀🔥 SECURE FILE UPLOAD v2.0 - LOGGING DETALLADO ACTIVO');
  console.log('📋 Método:', req.method);
  console.log('📋 Headers:', Object.fromEntries(req.headers.entries()));
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request - respondiendo');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseClient();
    console.log('✅ Cliente Supabase inicializado');

    // Auth
    console.log('🔐 Verificando autenticación...');
    const { user, error: authError } = await getAuthenticatedUser(supabase, req);
    if (authError || !user) {
      console.log('❌ ERROR AUTH:', authError);
      console.log('❌ Usuario:', user);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    console.log('✅ Usuario autenticado:', user.id);

    // Rate limiting
    console.log('⏱️ Verificando rate limiting...');
    const { recentUploadCount, dailyUploadCount, now } = await checkRateLimit(supabase, user.id);
    console.log('📊 Rate limit - Recientes:', recentUploadCount, 'Diarios:', dailyUploadCount);
    if (recentUploadCount >= 20 || dailyUploadCount >= 100) {
      console.log('❌ RATE LIMIT EXCEDIDO');
      await logBlockedRateLimit(supabase, user.id, recentUploadCount, dailyUploadCount, now);
      return new Response(
        JSON.stringify({ error: 'Límite de subida alcanzado. Intenta más tarde.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log('✅ Rate limiting OK');

    // Form
    console.log('📝 Procesando formulario...');
    const formData = await req.formData()
    const file = formData.get('file') as File
    const bucketName = formData.get('bucket') as string
    const folder = formData.get('folder') as string

    console.log('📁 ARCHIVO RECIBIDO EN EDGE FUNCTION:');
    console.log('  - Nombre:', file?.name);
    console.log('  - Tamaño:', file?.size);
    console.log('  - Tipo:', file?.type);
    console.log('  - Constructor:', file?.constructor.name);
    console.log('  - Es instanceof File:', file instanceof File);
    console.log('🪣 Bucket:', bucketName);
    console.log('📂 Folder:', folder);
    
    // VERIFICACIÓN CRÍTICA: El archivo NO debe estar vacío
    if (file && file.size === 0) {
      console.log('❌ CRITICAL ERROR: Archivo recibido con tamaño 0 en edge function');
      console.log('❌ Esto indica que el archivo se corrompió antes de llegar aquí');
      return new Response(
        JSON.stringify({ error: 'File received is empty - possible corruption during transfer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!file) {
      console.log('❌ ERROR: No se recibió ningún archivo');
      return new Response(
        JSON.stringify({ error: 'No file received' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!bucketName) {
      console.log('❌ ERROR: No se especificó bucket');
      return new Response(
        JSON.stringify({ error: 'Bucket name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar si el archivo tiene contenido
    if (!(file instanceof File)) {
      console.log('❌ ERROR: El objeto recibido no es un File válido');
      return new Response(
        JSON.stringify({ error: 'Invalid file object received' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (file.size === 0) {
      console.log('❌ ERROR: El archivo está vacío (tamaño = 0)');
      return new Response(
        JSON.stringify({ error: 'File is empty or corrupted' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // File validation
    console.log('🔍 Validando archivo...');
    const validationResult = validateFile(file)
    console.log('📋 Resultado validación:', validationResult);
    if (!validationResult.valid) {
      console.log('❌ ERROR VALIDACIÓN:', validationResult.error);
      return new Response(
        JSON.stringify({ error: validationResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    console.log('✅ Archivo válido');

    // Virus scanning
    console.log('🛡️ Escaneando archivo con VirusTotal...');
    const virusScanResult = await scanFileWithVirusTotal(file);
    console.log('📋 Resultado escaneo:', virusScanResult);
    
    if (!virusScanResult.safe) {
      console.log('❌ AMENAZA DETECTADA:', virusScanResult.detections, 'detecciones');
      await logAudit(supabase, user.id, file.name, bucketName, now, {
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
    console.log('✅ Archivo limpio - sin amenazas detectadas');

    // Sanitize filename and path
    console.log('🧹 Sanitizando nombre de archivo...');
    
    // Usar nombre sanitizado del cliente si está disponible, sino sanitizar aquí
    const clientSanitizedName = formData.get('sanitizedFilename') as string
    const sanitizedFilename = clientSanitizedName || sanitizeFilename(file.name)
    
    console.log('📝 Nombre original:', file.name);
    console.log('📝 Nombre del cliente:', clientSanitizedName);
    console.log('📝 Nombre final sanitizado:', sanitizedFilename);
    
    // Always use user ID as folder for proper RLS compliance
    const userFolder = user.id
    const filePath = folder ? `${userFolder}/${folder}/${sanitizedFilename}` : `${userFolder}/${sanitizedFilename}`
    console.log('📄 Nombre sanitizado:', sanitizedFilename);
    console.log('👤 Carpeta de usuario:', userFolder);
    console.log('📍 Ruta final:', filePath);

    // Upload file
    console.log('📤 Iniciando subida a storage...');
    console.log('🎯 Parámetros:', { bucketName, filePath, fileSize: file.size });
    const { data, error } = await uploadFileToSupabaseStorage(supabase, bucketName, filePath, file);

    if (error) {
      console.error('❌ ERROR UPLOAD STORAGE:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    console.log('✅ Archivo subido exitosamente:', data);

    // Log audit
    console.log('📝 Registrando en audit log...');
    await logAudit(supabase, user.id, filePath, bucketName, now);
    console.log('✅ Audit log registrado');

    console.log('🎉 ÉXITO TOTAL - Subida completada');
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
    console.error('❌ ERROR INESPERADO:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack');
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})