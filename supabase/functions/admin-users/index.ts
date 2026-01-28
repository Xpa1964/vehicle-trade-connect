import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkGlobalRateLimit, getClientIdentifier, createRateLimitResponse } from "../_shared/globalRateLimiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateUserRequest {
  registrationId: string;
}

interface UpdateStatusRequest {
  registrationId: string;
  status: string;
  adminNotes?: string;
}

interface UpdateNotesRequest {
  registrationId: string;
  adminNotes: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();
    
    console.log(`Processing ${req.method} request for action: ${action}`);
    
    // Create Supabase client for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseForRateLimit = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check rate limit (30 req/min, 500 req/hour)
    const clientId = getClientIdentifier(req);
    const rateLimitResult = await checkGlobalRateLimit(
      supabaseForRateLimit,
      clientId,
      'admin-users',
      { perMinute: 30, perHour: 500 }
    );
    
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, corsHeaders);
    }
    
    // Create Supabase clients
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get authentication info
    const authHeader = req.headers.get('Authorization');
    let user = null;

    if (authHeader) {
      const { data: { user: authUser }, error: authError } = await supabaseAuth.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      
      if (authError) {
        console.error('Auth error:', authError);
      } else {
        user = authUser;
        console.log(`User authenticated: {
  id: "${user?.id}",
  email: "${user?.email}"
}`);
      }
    }

    // Handle different actions
    if (action === 'registration-requests' && req.method === 'GET') {
      console.log("Processing get-registration-requests request");
      
      // Check permissions
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Check if user can manage registration requests
      let canManageRequests = null;
      let permissionError = null;
      
      try {
        const { data, error } = await supabaseAdmin
          .rpc('can_manage_registration_requests', { p_user_id: user.id });
        
        canManageRequests = data;
        permissionError = error?.message;
      } catch (error) {
        permissionError = error.message;
      }

      console.log(`Permission check results: {
  userId: "${user.id}",
  canManageRequests: ${canManageRequests},
  permissionError: "${permissionError}"
}`);

      // Get user role for diagnostic
      let role = null;
      let roleError = null;
      
      try {
        const { data: roleData, error: roleErr } = await supabaseAdmin
          .rpc('get_user_role', { p_user_id: user.id });
        
        role = roleData;
        roleError = roleErr?.message;
        
        console.log(`User role diagnostic: {
  userId: "${user.id}",
  role: "${role}",
  roleError: ${roleError}
}`);
        
        // Direct role query for extra diagnostic
        const { data: roleRecord, error: directError } = await supabaseAdmin
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
          
        console.log(`Direct role query result: {
  roleRecord: ${JSON.stringify(roleRecord)},
  roleValue: "${roleRecord?.role}",
  roleType: "${typeof roleRecord?.role}",
  directError: ${directError?.message}
}`);
        
      } catch (error) {
        roleError = error.message;
      }

      // Fallback permission check based on known admin emails
      const knownAdminEmails = ['xperez1964@gmail.com', 'admin@automundo.com'];
      const isKnownAdmin = knownAdminEmails.includes(user.email || '');
      
      if (isKnownAdmin) {
        console.log(`Access granted based on known admin email: ${user.email}`);
      } else if (!canManageRequests && role !== 'admin') {
        return new Response(
          JSON.stringify({ 
            error: 'Insufficient permissions', 
            debug: {
              userId: user.id,
              email: user.email,
              role: role,
              canManageRequests: canManageRequests,
              permissionError: permissionError
            }
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Fetch registration requests
      const { data: requests, error } = await supabaseAdmin
        .from('registration_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registration requests:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Successfully fetched registration requests, count: ${requests?.length}`);

      return new Response(JSON.stringify(requests), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create-user-from-registration' && req.method === 'POST') {
      console.log("Processing create-user-from-registration request");
      
      const { registrationId }: CreateUserRequest = await req.json();
      
      // Get registration data
      const { data: registration, error: regError } = await supabaseAdmin
        .from('registration_requests')
        .select('*')
        .eq('id', registrationId)
        .single();

      if (regError || !registration) {
        console.error('Registration not found:', regError);
        return new Response(
          JSON.stringify({ error: 'Registration not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // MODIFICADO: Usar la contraseña original en lugar de generar una nueva
      const password = registration.password;
      
      if (!password) {
        console.error('No password found in registration request');
        return new Response(
          JSON.stringify({ error: 'No password found in registration request' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      console.log(`Using original password from registration for: ${registration.email}`);
      console.log(`Checking if user already exists for: ${registration.email}`);

      // Check if user already exists
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        console.error('Error listing users:', listError);
        return new Response(
          JSON.stringify({ error: `Failed to check existing users: ${listError.message}` }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const existingUser = existingUsers.users.find(u => u.email === registration.email);

      if (existingUser) {
        console.log(`User already exists: ${existingUser.id}, updating password to original`);
        
        // Update existing user's password to the original one
        const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          {
            password: password, // MODIFICADO: Usar la contraseña original
            user_metadata: {
              full_name: registration.contact_person,
              company_name: registration.company_name,
              business_type: registration.business_type,
              source: 'admin_reapproval'
            }
          }
        );

        if (updateError) {
          console.error('Error updating existing user:', updateError);
          return new Response(
            JSON.stringify({ error: `Failed to update user: ${updateError.message}` }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        console.log(`Existing user updated successfully with original password: ${existingUser.id}`);
        console.log(`Returning credentials for existing user: ${registration.email}`);

        return new Response(JSON.stringify({
          userId: existingUser.id,
          email: registration.email,
          password: password, // MODIFICADO: Devolver la contraseña original
          message: 'User password updated to original successfully',
          isExistingUser: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        console.log(`Creating new user account with original password for: ${registration.email}`);

        // Create the auth user with original password
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: registration.email,
          password: password, // MODIFICADO: Usar la contraseña original
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            full_name: registration.contact_person,
            company_name: registration.company_name,
            business_type: registration.business_type,
            source: 'admin_approval'
          }
        });

        if (authError) {
          console.error('Error creating auth user:', authError);
          return new Response(
            JSON.stringify({ error: `Failed to create user: ${authError.message}` }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        console.log(`Auth user created successfully with original password: ${authData.user.id}`);

        // Assign user role (default to 'user')
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'user'
          });

        if (roleError) {
          console.error('Error assigning user role:', roleError);
        }

        console.log("User account setup completed - profile will be created automatically by trigger");
        console.log(`Returning original credentials for new user: ${registration.email}`);

        return new Response(JSON.stringify({
          userId: authData.user.id,
          email: registration.email,
          password: password, // MODIFICADO: Devolver la contraseña original
          message: 'User created successfully with original password',
          isExistingUser: false
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (action === 'update-registration-status' && req.method === 'POST') {
      console.log("Processing update-registration-status request");
      
      const { registrationId, status, adminNotes }: UpdateStatusRequest = await req.json();
      
      const { error } = await supabaseAdmin
        .from('registration_requests')
        .update({ 
          status, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (error) {
        console.error('Error updating registration status:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Registration status updated successfully: {
  registrationId: "${registrationId}",
  status: "${status}"
}`);

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Status updated successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update-registration-notes' && req.method === 'POST') {
      console.log("Processing update-registration-notes request");
      
      const { registrationId, adminNotes }: UpdateNotesRequest = await req.json();
      
      const { error } = await supabaseAdmin
        .from('registration_requests')
        .update({ 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (error) {
        console.error('Error updating registration notes:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Registration notes updated successfully for: ${registrationId}`);

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Notes updated successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get-user-stats' && req.method === 'GET') {
      console.log("Processing get-user-stats request");
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      try {
        // Get total users count
        const { count: totalUsers, error: totalError } = await supabaseAdmin
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        // Get active users (users who logged in within last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: activeUsersData, error: activeError } = await supabaseAdmin
          .from('activity_logs')
          .select('user_id')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .eq('action_type', 'login');

        if (activeError) throw activeError;

        const uniqueActiveUsers = new Set(activeUsersData?.map(log => log.user_id) || []);
        const activeUsers = uniqueActiveUsers.size;

        // Get admin count
        const { count: adminCount, error: adminError } = await supabaseAdmin
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin');

        if (adminError) throw adminError;

        // Get users registered today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count: registeredToday, error: todayError } = await supabaseAdmin
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        if (todayError) throw todayError;

        const stats = {
          total: totalUsers || 0,
          active: activeUsers || 0,
          admins: adminCount || 0,
          registered_today: registeredToday || 0
        };

        console.log('User stats fetched successfully:', stats);

        return new Response(JSON.stringify(stats), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        console.error('Error fetching user stats:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action or method' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function to generate secure password
function generateSecurePassword(): string {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  // Ensure at least one character from each category
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
