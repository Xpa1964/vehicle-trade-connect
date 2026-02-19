/**
 * Generate Static Image Edge Function
 * 
 * Generates AI images for the Static Image Registry using Lovable AI Gateway.
 * Returns base64 image data for preview before acceptance.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// We do our own auth checks in this function (see below) because browser CORS
// preflight requests (OPTIONS) do not include Authorization headers.
// Therefore verify_jwt is set to false in supabase/config.toml.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface GenerateRequest {
  imageId: string;
  prompt: string;
  globalStylePrompt?: string;
  width?: number;
  height?: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // --- Auth (admin only) ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase configuration missing");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      console.error("Admin check failed:", roleError);
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: GenerateRequest = await req.json();
    const { imageId, prompt, globalStylePrompt, width = 1024, height = 1024 } = body;

    if (!imageId || !prompt) {
      return new Response(
        JSON.stringify({ error: "imageId and prompt are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Compose the final prompt with global style
    const finalPrompt = globalStylePrompt 
      ? `${globalStylePrompt}\n\n${prompt}`
      : prompt;

    console.log(`[generate-static-image] Generating image for ${imageId}`);
    console.log(`[generate-static-image] Prompt: ${finalPrompt.slice(0, 100)}...`);

    // Call Lovable AI Gateway for image generation
    // Use a direct, image-focused prompt to maximize generation success
    const imagePrompt = `Create this image: ${finalPrompt}`;

    let imageData: string | null = null;
    let textResponse = "";

    // Try with flash model first, then pro model as fallback
    const models = ["google/gemini-2.5-flash-image", "google/gemini-3-pro-image-preview"];

    for (const model of models) {
      console.log(`[generate-static-image] Trying model: ${model}`);
      
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: imagePrompt
            }
          ],
          modalities: ["image", "text"]
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.error("Rate limit exceeded");
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          console.error("Payment required");
          return new Response(
            JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        const errorText = await response.text();
        console.error(`AI gateway error [${response.status}] with ${model}:`, errorText);
        continue; // Try next model
      }

      const data = await response.json();
      imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
      textResponse = data.choices?.[0]?.message?.content || "";

      if (imageData) {
        console.log(`[generate-static-image] Success with model: ${model}`);
        break;
      }

      console.warn(`[generate-static-image] No image from ${model}, trying next...`);
    }

    if (!imageData) {
      console.error("No image data from any model");
      return new Response(
        JSON.stringify({ error: "No image generated. Try a different prompt." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[generate-static-image] Successfully generated image for ${imageId}`);

    return new Response(
      JSON.stringify({
        success: true,
        imageId,
        imageData, // base64 data URL
        prompt: finalPrompt,
        message: textResponse,
        generatedAt: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("generate-static-image error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
