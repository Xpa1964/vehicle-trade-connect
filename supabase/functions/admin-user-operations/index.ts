
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminUserOperationRequest {
  operation: 'reset_password' | 'send_email';
  userId: string;
  email?: string;
  subject?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get the current user to verify admin permissions
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, message: 'Authorization header required' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid authentication token' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Verify user has admin role
    const { data: userRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !userRole || userRole.role !== 'admin') {
      console.error('Role verification failed:', roleError, 'User role:', userRole?.role);
      return new Response(
        JSON.stringify({ success: false, message: 'Admin privileges required' }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const requestData: AdminUserOperationRequest = await req.json();
    const { operation, userId, email, subject, message } = requestData;

    console.log(`[Admin Operation] ${operation} requested by admin ${user.id} for user ${userId}`);

    if (operation === 'reset_password') {
      // Generate password reset for user using admin client
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email || '',
        options: {
          redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify`
        }
      });

      if (error) {
        console.error('Password reset error:', error);
        return new Response(
          JSON.stringify({ success: false, message: `Error generating reset link: ${error.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Log the admin action
      await supabaseAdmin.rpc('log_activity', {
        p_user_id: user.id,
        p_action_type: 'admin_password_reset',
        p_entity_type: 'user_management',
        p_entity_id: userId,
        p_details: JSON.stringify({
          target_user_email: email,
          timestamp: new Date().toISOString()
        }),
        p_severity: 'info'
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Password reset link generated successfully',
          reset_link: data.properties?.action_link 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );

    } else if (operation === 'send_email') {
      // Send admin message using existing admin message service
      const { data, error } = await supabaseAdmin.rpc('admin_send_message', {
        p_recipient_id: userId,
        p_content: message || 'Mensaje del administrador',
        p_admin_name: user.email || 'Administrador',
        p_source_title: subject || 'Mensaje administrativo'
      });

      if (error) {
        console.error('Send email error:', error);
        return new Response(
          JSON.stringify({ success: false, message: `Error sending email: ${error.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Log the admin action
      await supabaseAdmin.rpc('log_activity', {
        p_user_id: user.id,
        p_action_type: 'admin_send_email',
        p_entity_type: 'user_communication',
        p_entity_id: userId,
        p_details: JSON.stringify({
          subject: subject,
          message_preview: message?.substring(0, 100),
          timestamp: new Date().toISOString()
        }),
        p_severity: 'info'
      });

      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Invalid operation' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Unexpected error in admin-user-operations:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
