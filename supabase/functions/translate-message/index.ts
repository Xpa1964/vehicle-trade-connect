
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkGlobalRateLimit, getClientIdentifier, createRateLimitResponse } from "../_shared/globalRateLimiter.ts";

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  messageId: string;
  targetLanguage: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check rate limit (60 req/min, 1000 req/hour)
    const clientId = getClientIdentifier(req);
    const rateLimitResult = await checkGlobalRateLimit(
      supabase,
      clientId,
      'translate-message',
      { perMinute: 60, perHour: 1000 }
    );
    
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, corsHeaders);
    }
    
    // Get request parameters
    const { messageId, targetLanguage } = await req.json() as TranslationRequest;
    
    if (!messageId || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get the message content
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('content, original_language, translated_content')
      .eq('id', messageId)
      .single();
      
    if (messageError || !message) {
      return new Response(
        JSON.stringify({ error: "Message not found", details: messageError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // If we already have this translation, return it
    if (message.translated_content && message.translated_content[targetLanguage]) {
      return new Response(
        JSON.stringify({ 
          translation: message.translated_content[targetLanguage],
          cached: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If original language is the same as target, no translation needed
    if (message.original_language === targetLanguage) {
      return new Response(
        JSON.stringify({ 
          translation: message.content,
          cached: false,
          same_language: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For real translation, we would integrate with a translation API here
    // For now, we'll use a simple mock translation
    console.log(`Translating from ${message.original_language} to ${targetLanguage}: "${message.content}"`);
    
    // Mock translation - in a real app, you would call a translation API here
    // This is a placeholder for demonstration purposes
    let translatedText = `[${targetLanguage}] ${message.content}`;
    
    // In a real implementation, you would use a service like Google Translate:
    // const translateApiUrl = `https://translation.googleapis.com/language/translate/v2`;
    // const translateResponse = await fetch(translateApiUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     q: message.content,
    //     source: message.original_language,
    //     target: targetLanguage,
    //     format: 'text',
    //     key: 'YOUR_GOOGLE_TRANSLATE_API_KEY'
    //   })
    // });
    // const translateData = await translateResponse.json();
    // const translatedText = translateData.data.translations[0].translatedText;

    // Store the translation in the database
    const translatedContent = {
      ...(message.translated_content || {}),
      [targetLanguage]: translatedText
    };
    
    const { error: updateError } = await supabase
      .from('messages')
      .update({ translated_content: translatedContent })
      .eq('id', messageId);
      
    if (updateError) {
      console.error('Error saving translation:', updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        translation: translatedText,
        cached: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing translation request:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process translation request", details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
