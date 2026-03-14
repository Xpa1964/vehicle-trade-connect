import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action, session_id, ...payload } = await req.json();

    // ── ACTION: visit ─────────────────────────────────────
    if (action === "visit") {
      const { video_language, campaign, dealer, contact, user_agent, referrer } = payload;

      if (!session_id || !campaign) {
        return jsonResponse({ success: false, error: "session_id and campaign required" }, 400);
      }

      const { error } = await supabase.from("campaign_events").insert({
        session_id,
        video_language: video_language || null,
        campaign,
        dealer: dealer || null,
        contact: contact || null,
        visitor_country: null,
        user_agent: user_agent || null,
        referrer: referrer || null,
      });

      if (error) {
        // Unique constraint → already exists, treat as success
        if (error.code === "23505") {
          return jsonResponse({ success: true, deduplicated: true });
        }
        console.error("[track-campaign] visit INSERT error:", error);
        return jsonResponse({ success: false, error: error.message }, 500);
      }

      // Try to get visitor country in the background (non-blocking response)
      // We respond immediately and update country asynchronously
      EdgeRuntime?.waitUntil?.(
        (async () => {
          try {
            const res = await fetch("https://ipapi.co/json/", {
              signal: AbortSignal.timeout(3000),
            });
            const data = await res.json();
            const country = data.country_name || data.country || null;
            if (country) {
              await supabase
                .from("campaign_events")
                .update({ visitor_country: country })
                .eq("session_id", session_id);
            }
          } catch {
            // ignore – country is optional
          }
        })()
      );

      return jsonResponse({ success: true });
    }

    // ── ACTION: event ─────────────────────────────────────
    if (action === "event") {
      const { field } = payload;
      const validFields = ["video_started", "video_completed", "popup_shown", "register_clicked"];

      if (!session_id) {
        return jsonResponse({ success: false, error: "session_id required" }, 400);
      }
      if (!validFields.includes(field)) {
        return jsonResponse({ success: false, error: `invalid field: ${field}` }, 400);
      }

      const { data, error } = await supabase
        .from("campaign_events")
        .update({ [field]: true })
        .eq("session_id", session_id)
        .select("id");

      if (error) {
        console.error("[track-campaign] event UPDATE error:", error);
        return jsonResponse({ success: false, error: error.message }, 500);
      }

      const rowsUpdated = data?.length ?? 0;
      console.log(`[track-campaign] event UPDATE: field=${field}, session=${session_id}, rows=${rowsUpdated}`);

      return jsonResponse({ success: true, rows_updated: rowsUpdated });
    }

    // ── ACTION: contact ───────────────────────────────────
    if (action === "contact") {
      const { contact: contactValue, interests } = payload;

      if (!session_id || !contactValue) {
        return jsonResponse({ success: false, error: "session_id and contact required" }, 400);
      }

      const updatePayload: Record<string, unknown> = { contact: contactValue };
      if (Array.isArray(interests) && interests.length > 0) {
        updatePayload.interests = interests;
      }

      const { data, error } = await supabase
        .from("campaign_events")
        .update(updatePayload)
        .eq("session_id", session_id)
        .select("id");

      if (error) {
        console.error("[track-campaign] contact UPDATE error:", error);
        return jsonResponse({ success: false, error: error.message }, 500);
      }

      return jsonResponse({ success: true, rows_updated: data?.length ?? 0 });
    }

    return jsonResponse({ success: false, error: `unknown action: ${action}` }, 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[track-campaign] Unhandled error:", message);
    return jsonResponse({ success: false, error: message }, 500);
  }
});
