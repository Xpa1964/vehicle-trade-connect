/**
 * FASE 6: Edge Function para Reportar Traducciones Faltantes
 * Recibe y almacena reportes de traducciones faltantes desde el frontend
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MissingTranslationReport {
  key: string;
  language: string;
  page: string;
  timestamp: string;
  userAgent: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { reports } = await req.json() as { reports: MissingTranslationReport[] };

    if (!reports || !Array.isArray(reports)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: reports array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📊 Receiving ${reports.length} missing translation reports`);

    // Validar reportes
    const validReports = reports.filter(report => 
      report.key && 
      report.language && 
      report.page
    );

    if (validReports.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid reports provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // NOTA: Por ahora solo logear. En producción, descomentar para guardar en BD
    // await supabaseClient.from('missing_translations').insert(validReports);

    console.log('✅ Reports processed:', validReports.length);
    validReports.forEach(report => {
      console.log(`  - ${report.language}: ${report.key} (${report.page})`);
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        processedCount: validReports.length,
        message: 'Reports logged successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error processing reports:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
