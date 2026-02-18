import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { email, password, userData, profileData, roleData, action, userId: targetUserId } = await req.json();

    // Update existing user password
    if (action === "update_password" && targetUserId) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, { password });
      if (updateError) throw updateError;
      return new Response(JSON.stringify({ success: true, userId: targetUserId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create user with admin API (auto-confirmed)
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData || {},
    });

    if (createError) throw createError;

    const userId = user.user.id;

    // Create profile
    if (profileData) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert({ ...profileData, user_id: userId });
      if (profileError) console.error("Profile error:", profileError);
    }

    // Assign role
    if (roleData?.role) {
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: roleData.role });
      if (roleError) console.error("Role error:", roleError);
    }

    return new Response(JSON.stringify({ success: true, userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
