# API Rate Limiting

## Overview

Global rate limiting has been implemented across all critical edge functions to protect against DDoS attacks, API abuse, and ensure fair resource usage. The rate limiting system uses persistent database tracking for accurate enforcement across multiple instances.

## Implementation Details

### Storage
- Rate limit data is stored in the `api_rate_limits` table
- Automatic cleanup of records older than 24 hours
- Indexed for high-performance lookups

### Enforcement
Rate limits are tracked per:
- **Identifier**: Client IP address or authenticated user ID
- **Endpoint**: Specific edge function name
- **Time Windows**: Per-minute and per-hour limits

## Rate Limits by Endpoint

| Endpoint | Requests/Minute | Requests/Hour | Purpose |
|----------|----------------|---------------|---------|
| `admin-users` | 30 | 500 | Admin user management operations |
| `translate-message` | 60 | 1,000 | Message translation requests |
| `registration-emails` | 20 | 200 | Registration email sending |
| `api-sync-vehicles` | 100 | 5,000 | Partner API vehicle synchronization |

## HTTP Response Headers

When rate limits are enforced, responses include:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 60
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
```

### Header Definitions

- **`Retry-After`**: Seconds to wait before retrying (60 for per-minute, 3600 for per-hour)
- **`X-RateLimit-Limit`**: Maximum requests allowed in the current window
- **`X-RateLimit-Remaining`**: Requests remaining in the current window

## Response Format

### Rate Limit Exceeded
```json
{
  "error": "Rate limit exceeded",
  "retry_after": 60
}
```

### Successful Request (in response headers)
```http
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 27
```

## Client Implementation

### JavaScript/TypeScript Example

```typescript
async function callEdgeFunction(endpoint: string, data: any) {
  try {
    const response = await fetch(`https://[project-ref].supabase.co/functions/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
      
      // Implement exponential backoff
      await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000));
      return callEdgeFunction(endpoint, data); // Retry
    }

    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

### Handling Rate Limits

**Best Practices:**
1. **Respect `Retry-After` header** - Always wait the specified time before retrying
2. **Implement exponential backoff** - Increase wait time with each subsequent failure
3. **Cache responses** - Reduce unnecessary API calls
4. **Batch operations** - Combine multiple requests when possible
5. **Monitor remaining limits** - Check `X-RateLimit-Remaining` header

## Monitoring

### Database Query for Usage
```sql
SELECT 
  identifier,
  endpoint,
  COUNT(*) as request_count,
  MAX(created_at) as last_request
FROM api_rate_limits
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY identifier, endpoint
ORDER BY request_count DESC;
```

### Cleanup Function
Automatic cleanup runs periodically, but can be manually triggered:

```sql
SELECT cleanup_old_rate_limits();
```

## Security Considerations

### Fail-Open Strategy
- If rate limiting check fails due to database error, requests are **allowed**
- Prevents legitimate traffic from being blocked due to infrastructure issues
- Errors are logged for monitoring

### Identifier Priority
1. **Authenticated users**: Uses `user:{user_id}` format
2. **Anonymous requests**: Uses client IP address
3. **Unknown**: Falls back to `'unknown'` (should be rare)

## Configuration Changes

To modify rate limits, edit the configuration in each edge function:

```typescript
const rateLimitResult = await checkGlobalRateLimit(
  supabase,
  clientId,
  'endpoint-name',
  { 
    perMinute: 30,  // Adjust this value
    perHour: 500    // Adjust this value
  }
);
```

## Troubleshooting

### "Rate limit exceeded" for legitimate users

1. **Check current usage:**
   ```sql
   SELECT COUNT(*) 
   FROM api_rate_limits 
   WHERE identifier = 'user:YOUR_USER_ID' 
   AND created_at > NOW() - INTERVAL '1 hour';
   ```

2. **Clear rate limits (use with caution):**
   ```sql
   DELETE FROM api_rate_limits 
   WHERE identifier = 'user:YOUR_USER_ID';
   ```

3. **Increase limits** if the user has legitimate high-volume needs

### Performance Issues

- Ensure indexes are present: `idx_rate_limits_identifier`, `idx_rate_limits_created_at`
- Run cleanup function regularly: `SELECT cleanup_old_rate_limits();`
- Monitor database performance in Supabase dashboard

## Future Enhancements

Potential improvements:
- **Adaptive rate limiting**: Increase limits for premium users
- **Geolocation-based limits**: Different limits by region
- **Pattern detection**: Block suspicious traffic patterns
- **Dashboard**: Real-time rate limit monitoring UI
- **Alerts**: Notify admins when limits are consistently hit

## Related Files

- **Implementation**: `supabase/functions/_shared/globalRateLimiter.ts`
- **Database**: Migration creating `api_rate_limits` table
- **Edge Functions**: All functions in `supabase/functions/*`
