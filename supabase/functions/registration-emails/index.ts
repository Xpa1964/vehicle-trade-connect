
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { emailTemplates, EmailRequest } from "./email-templates.ts";
import { sendEmailWithFallback } from "./email-sender.ts";
import { validateAuth, createAuthErrorResponse } from "./auth-validator.ts";
import { createErrorResponse, createSuccessResponse, createCorsResponse } from "./response-utils.ts";
import { checkGlobalRateLimit, getClientIdentifier, createRateLimitResponse } from "../_shared/globalRateLimiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return createCorsResponse(corsHeaders);
  }

  try {
    console.log('[Registration Emails] Processing request:', req.method);
    
    // Create Supabase client for rate limiting
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check rate limit (20 req/min, 200 req/hour)
    const clientId = getClientIdentifier(req);
    const rateLimitResult = await checkGlobalRateLimit(
      supabase,
      clientId,
      'registration-emails',
      { perMinute: 20, perHour: 200 }
    );
    
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, corsHeaders);
    }
    
    const requestBody = await req.text();
    
    let parsedBody: EmailRequest;
    try {
      parsedBody = JSON.parse(requestBody);
    } catch (parseError) {
      console.error('[Registration Emails] Invalid JSON');
      return createErrorResponse(new Error('Invalid JSON in request body'), corsHeaders);
    }
    
    const { type, data } = parsedBody;
    console.log(`[Registration Emails] Type: ${type}, Recipient: ${data.email}`);
    
    // Validate authentication (now required for ALL operations)
    console.log(`[Registration Emails] Validating auth for type: ${type}`);
    if (!validateAuth(req, type)) {
      console.log(`[Registration Emails] Auth validation failed for type: ${type}`);
      return createAuthErrorResponse(corsHeaders);
    }
    console.log(`[Registration Emails] Auth validated successfully for type: ${type}`);
    
    // Check if API key is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error('[Registration Emails] RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Get template and send email
    const template = emailTemplates[type](data);
    console.log(`[Registration Emails] Sending template: ${type}`);

    const result = await sendEmailWithFallback(template, data.email, data);
    console.log('[Registration Emails] Email sent successfully');
    
    return createSuccessResponse(result, corsHeaders);
    
  } catch (error: unknown) {
    console.error('[Registration Emails] Error:', error instanceof Error ? error.message : String(error));
    return createErrorResponse(error, corsHeaders);
  }
});
