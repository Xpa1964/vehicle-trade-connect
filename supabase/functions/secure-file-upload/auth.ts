import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const sharedClientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
}

export function getSupabaseAuthClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    sharedClientOptions,
  )
}

export function getSupabaseAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    sharedClientOptions,
  )
}

export async function getAuthenticatedUser(authClient: any, req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return { user: null, error: 'No authorization header' }
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await authClient.auth.getUser(token)

  if (error || !user) {
    return { user: null, error: 'Unauthorized' }
  }

  return { user, error: null }
}
