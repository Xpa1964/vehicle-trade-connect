import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface RateLimitConfig {
  perMinute: number;
  perHour: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
  remaining?: number;
  limit?: number;
}

/**
 * Global rate limiter using Supabase DB for persistent tracking
 * Protects edge functions from DDoS and abuse
 */
export async function checkGlobalRateLimit(
  supabase: SupabaseClient,
  identifier: string, // IP or user_id
  endpoint: string,
  limits: RateLimitConfig
): Promise<RateLimitResult> {
  
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60000);
  const oneHourAgo = new Date(now.getTime() - 3600000);

  try {
    // Count requests in the last hour
    const { data: requests, error } = await supabase
      .from('api_rate_limits')
      .select('id, created_at')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('created_at', oneHourAgo.toISOString());

    if (error) {
      console.error('[Rate Limit] Check error:', error);
      // Fail open to avoid blocking legitimate traffic
      return { allowed: true };
    }

    const recentRequests = (requests || []).filter(
      r => new Date(r.created_at) >= oneMinuteAgo
    ).length;

    const hourlyRequests = (requests || []).length;

    // Check per-minute limit
    if (recentRequests >= limits.perMinute) {
      console.warn(`[Rate Limit] ${identifier} exceeded ${limits.perMinute}/min limit on ${endpoint}`);
      return {
        allowed: false,
        retryAfter: 60,
        remaining: 0,
        limit: limits.perMinute
      };
    }

    // Check per-hour limit
    if (hourlyRequests >= limits.perHour) {
      console.warn(`[Rate Limit] ${identifier} exceeded ${limits.perHour}/hour limit on ${endpoint}`);
      return {
        allowed: false,
        retryAfter: 3600,
        remaining: 0,
        limit: limits.perHour
      };
    }

    // Register this request
    const { error: insertError } = await supabase
      .from('api_rate_limits')
      .insert({
        identifier,
        endpoint,
        created_at: now.toISOString()
      });

    if (insertError) {
      console.error('[Rate Limit] Insert error:', insertError);
    }

    return {
      allowed: true,
      remaining: limits.perMinute - recentRequests - 1,
      limit: limits.perMinute
    };
  } catch (error) {
    console.error('[Rate Limit] Unexpected error:', error);
    // Fail open for safety
    return { allowed: true };
  }
}

/**
 * Get client identifier (IP or user ID)
 */
export function getClientIdentifier(req: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
}

/**
 * Create rate limit response with proper headers
 */
export function createRateLimitResponse(result: RateLimitResult, corsHeaders: Record<string, string>) {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      retry_after: result.retryAfter
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': result.retryAfter?.toString() || '60',
        'X-RateLimit-Limit': result.limit?.toString() || '0',
        'X-RateLimit-Remaining': result.remaining?.toString() || '0'
      }
    }
  );
}
