/**
 * Replace Static Image Edge Function
 * 
 * Uploads a generated image to Supabase Storage, replacing the existing file.
 * Maintains the same URL for instant platform-wide updates.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ReplaceRequest {
  imageId: string;
  base64Data: string;
  targetPath: string;
  prompt?: string;
  globalStylePrompt?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header for user validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for storage operations
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

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has admin role
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

    // Parse request body
    const body: ReplaceRequest = await req.json();
    const { imageId, base64Data, targetPath, prompt, globalStylePrompt } = body;

    if (!imageId || !base64Data || !targetPath) {
      return new Response(
        JSON.stringify({ error: "imageId, base64Data, and targetPath are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[replace-static-image] Processing replacement for ${imageId}`);
    console.log(`[replace-static-image] Target path: ${targetPath}`);

    // Extract base64 data (remove data URL prefix if present)
    let imageBase64 = base64Data;
    let contentType = "image/png";
    
    if (base64Data.startsWith("data:")) {
      const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        contentType = matches[1];
        imageBase64 = matches[2];
      }
    }

    // Convert base64 to Uint8Array
    const binaryString = atob(imageBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Determine storage path from target path
    // Convert paths like "/images/hero.png" to "hero.png" for storage
    let storagePath = targetPath;
    if (storagePath.startsWith("/")) {
      storagePath = storagePath.substring(1);
    }
    // Remove common prefixes for cleaner storage organization
    storagePath = storagePath
      .replace(/^images\//, "")
      .replace(/^lovable-uploads\//, "")
      .replace(/^assets\//, "");

    // Add imageId as prefix for organization
    const finalPath = `${imageId.replace(/\./g, "/")}/${Date.now()}.png`;

    console.log(`[replace-static-image] Uploading to storage path: ${finalPath}`);

    // Upload to storage with upsert
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("static-images")
      .upload(finalPath, bytes, {
        contentType,
        upsert: true,
        cacheControl: "0", // No cache for instant updates
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: `Upload failed: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("static-images")
      .getPublicUrl(finalPath);

    console.log(`[replace-static-image] Successfully uploaded to: ${publicUrl}`);

    // Log the replacement for audit trail
    try {
      await supabase.from("admin_activity_log").insert({
        action: "replace_static_image",
        details: JSON.stringify({
          imageId,
          originalPath: targetPath,
          newPath: finalPath,
          publicUrl,
          prompt,
          globalStylePrompt,
        }),
        user_id: user.id,
      });
    } catch (logError) {
      // Don't fail the request if logging fails
      console.warn("Failed to log activity:", logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageId,
        publicUrl,
        storagePath: finalPath,
        replacedAt: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("replace-static-image error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
