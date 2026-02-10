import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function getTranslationFromCache(text: string, sourceLanguage: string, targetLanguage: string) {
  try {
    const { data, error } = await supabaseClient
      .from('translation_cache')
      .select('translated_text')
      .eq('source_text', text)
      .eq('source_lang', sourceLanguage)
      .eq('target_lang', targetLanguage)
      .single();

    if (error || !data) return null;
    console.log(`Cache hit for ${sourceLanguage} -> ${targetLanguage}`);
    return data.translated_text;
  } catch {
    return null;
  }
}

async function cacheTranslation(text: string, sourceLanguage: string, targetLanguage: string, translatedText: string) {
  try {
    await supabaseClient.from('translation_cache').upsert({
      source_text: text,
      source_lang: sourceLanguage,
      target_lang: targetLanguage,
      translated_text: translatedText
    }, { onConflict: 'source_text,source_lang,target_lang' });
  } catch (err) {
    console.error('Error caching translation:', err);
  }
}

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish', en: 'English', fr: 'French', de: 'German',
  it: 'Italian', pt: 'Portuguese', nl: 'Dutch', pl: 'Polish',
  ro: 'Romanian', da: 'Danish', sv: 'Swedish', no: 'Norwegian',
  fi: 'Finnish', cs: 'Czech', hu: 'Hungarian', bg: 'Bulgarian',
  hr: 'Croatian', sk: 'Slovak', sl: 'Slovenian', et: 'Estonian',
  lv: 'Latvian', lt: 'Lithuanian', mt: 'Maltese', ga: 'Irish',
  el: 'Greek', tr: 'Turkish', ru: 'Russian', uk: 'Ukrainian',
  ar: 'Arabic', ja: 'Japanese', zh: 'Chinese', ko: 'Korean',
};

async function translateWithAI(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) throw new Error('LOVABLE_API_KEY not configured');

  const sourceName = LANGUAGE_NAMES[sourceLanguage] || sourceLanguage;
  const targetName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-lite',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text from ${sourceName} to ${targetName}. Return ONLY the translated text, nothing else. Preserve formatting, line breaks, and punctuation. Do not add explanations or notes.`
        },
        {
          role: 'user',
          content: text
        }
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('AI translation error:', response.status, errText);
    if (response.status === 429) throw new Error('Rate limited');
    if (response.status === 402) throw new Error('Payment required');
    throw new Error(`AI error: ${response.status}`);
  }

  const data = await response.json();
  const translation = data.choices?.[0]?.message?.content?.trim();
  if (!translation) throw new Error('No translation in AI response');
  return translation;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (sourceLanguage === targetLanguage) {
      return new Response(
        JSON.stringify({ translation: text, sourceLanguage, targetLanguage, cached: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check cache first
    const cached = await getTranslationFromCache(text, sourceLanguage, targetLanguage);
    if (cached) {
      return new Response(
        JSON.stringify({ translation: cached, sourceLanguage, targetLanguage, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Translate with AI
    const translation = await translateWithAI(text, sourceLanguage, targetLanguage);
    
    // Cache the result
    await cacheTranslation(text, sourceLanguage, targetLanguage, translation);

    return new Response(
      JSON.stringify({ translation, sourceLanguage, targetLanguage, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Translation failed", 
        details: error instanceof Error ? error.message : String(error)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});