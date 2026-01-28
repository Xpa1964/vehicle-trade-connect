import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client for the function
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Function to check if translation is cached
async function getTranslationFromCache(text: string, sourceLanguage: string, targetLanguage: string) {
  try {
    const { data, error } = await supabaseClient
      .from('translation_cache')
      .select('translated_text, use_count')
      .eq('original_text', text)
      .eq('original_language', sourceLanguage)
      .eq('target_language', targetLanguage)
      .single();

    if (error || !data) {
      console.log(`Cache miss for ${sourceLanguage} to ${targetLanguage}`);
      return null;
    }

    console.log(`Cache hit for ${sourceLanguage} to ${targetLanguage}`);
    
    // Update last used time and increment use count
    await supabaseClient
      .from('translation_cache')
      .update({ 
        last_used_at: new Date().toISOString(),
        use_count: data.use_count + 1
      })
      .eq('original_text', text)
      .eq('original_language', sourceLanguage)
      .eq('target_language', targetLanguage);

    return data.translated_text;
  } catch (err) {
    console.error('Error checking cache:', err);
    return null;
  }
}

// Function to cache translation
async function cacheTranslation(text: string, sourceLanguage: string, targetLanguage: string, translatedText: string) {
  try {
    console.log(`Caching translation from ${sourceLanguage} to ${targetLanguage}`);
    await supabaseClient.from('translation_cache').insert({
      original_text: text,
      original_language: sourceLanguage,
      target_language: targetLanguage,
      translated_text: translatedText
    });
  } catch (err) {
    console.error('Error caching translation:', err);
  }
}

// Function to translate text using Google Cloud Translation API
async function translateWithGoogleApi(text: string, sourceLanguage: string, targetLanguage: string) {
  try {
    const apiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
    if (!apiKey) {
      throw new Error('Google Translate API key not configured');
    }
    
    console.log(`Translating text with Google API from ${sourceLanguage} to ${targetLanguage}`);
    
    // Prepare the API URL with query parameters
    const url = new URL('https://translation.googleapis.com/language/translate/v2');
    url.searchParams.append('key', apiKey);
    
    // Make the API request
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Google API response status: ${response.status}`);
      console.error(`Google API response body: ${errorData}`);
      throw new Error(`Google API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('Google API response successful');
    
    // Extract the translation from the response
    if (data && 
        data.data && 
        data.data.translations && 
        data.data.translations.length > 0 && 
        data.data.translations[0].translatedText) {
      return data.data.translations[0].translatedText;
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

// Enhanced mock translation for development when API key is not available
function mockTranslate(text: string, targetLanguage: string): string {
  // Add language prefix to show it's translated
  const prefix = `[${targetLanguage}] `;
  
  // For basic testing, we can provide some actual translations for common words
  const basicTranslations: Record<string, Record<string, string>> = {
    'hello': {
      'es': 'hola',
      'fr': 'bonjour',
      'it': 'ciao',
      'de': 'hallo',
      'en': 'hello',
    },
    'goodbye': {
      'es': 'adiós',
      'fr': 'au revoir',
      'it': 'arrivederci',
      'de': 'auf wiedersehen',
      'en': 'goodbye',
    },
    'thank you': {
      'es': 'gracias',
      'fr': 'merci',
      'it': 'grazie',
      'de': 'danke',
      'en': 'thank you',
    },
    'yes': {
      'es': 'sí',
      'fr': 'oui',
      'it': 'sì',
      'de': 'ja',
      'en': 'yes',
    },
    'no': {
      'es': 'no',
      'fr': 'non',
      'it': 'no',
      'de': 'nein',
      'en': 'no',
    }
  };
  
  // Check if the text is one of our basic translations
  const lowerText = text.toLowerCase().trim();
  if (basicTranslations[lowerText] && basicTranslations[lowerText][targetLanguage]) {
    return basicTranslations[lowerText][targetLanguage];
  }
  
  // Otherwise just return the text with a language prefix
  return prefix + text;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Translation request received');
    
    // Get request parameters
    const { text, sourceLanguage, targetLanguage } = await req.json();
    
    if (!text || !targetLanguage) {
      console.error('Missing required parameters');
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`Translation request from ${sourceLanguage} to ${targetLanguage} for text: "${text.substring(0, 50)}..."`);
    
    // If languages are the same, no need to translate
    if (sourceLanguage === targetLanguage) {
      console.log('Source and target languages are the same, no translation needed');
      return new Response(
        JSON.stringify({ translation: text, sourceLanguage, targetLanguage, cached: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if translation is cached
    const cachedTranslation = await getTranslationFromCache(text, sourceLanguage, targetLanguage);
    if (cachedTranslation) {
      console.log('Using cached translation');
      return new Response(
        JSON.stringify({ 
          translation: cachedTranslation, 
          sourceLanguage, 
          targetLanguage,
          cached: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let translation;
    const apiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
    
    // Try to use actual API if key is available, otherwise use mock
    if (apiKey) {
      try {
        translation = await translateWithGoogleApi(text, sourceLanguage, targetLanguage);
        console.log(`Successfully translated using Google API`);
        
        // Cache successful translation
        await cacheTranslation(text, sourceLanguage, targetLanguage, translation);
      } catch (error) {
        console.error('Error using Google Translate API:', error);
        // Fall back to mock translation
        console.log('Falling back to mock translation');
        translation = mockTranslate(text, targetLanguage);
      }
    } else {
      console.warn('No Google Translate API key found. Using mock translation.');
      translation = mockTranslate(text, targetLanguage);
    }
    
    return new Response(
      JSON.stringify({ 
        translation, 
        sourceLanguage, 
        targetLanguage,
        cached: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing translation request:", error);
    
    // Return a useful error response
    return new Response(
      JSON.stringify({ 
        error: "Failed to process translation request", 
        details: error.message,
        fallbackMode: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
