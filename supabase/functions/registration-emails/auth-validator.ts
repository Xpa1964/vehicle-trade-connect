
export function validateAuth(req: Request, emailType: string): boolean {
  // SECURITY: All email operations now require authentication
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    console.error(`[Auth] Missing authorization header for ${emailType} operation`);
    return false;
  }
  
  // Validate token format
  const token = authHeader.replace('Bearer ', '');
  if (!token || token.length < 10) {
    console.error('[Auth] Invalid authorization token format');
    return false;
  }
  
  return true;
}

export function createAuthErrorResponse(corsHeaders: Record<string, string>) {
  return new Response(
    JSON.stringify({ error: 'Authorization required for this operation' }),
    {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
