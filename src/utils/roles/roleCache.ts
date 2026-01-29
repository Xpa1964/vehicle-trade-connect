
import { AppRole } from '@/types/auth';
import { CachedRole, ROLE_CONFIG } from './types';

/**
 * Generate a simple signature to detect cache tampering
 * Note: This is NOT cryptographically secure, just a basic integrity check
 */
const generateCacheSignature = (userId: string, role: AppRole, timestamp: number): string => {
  // Simple hash using browser fingerprint + data
  const data = `${userId}:${role}:${timestamp}:${navigator.userAgent}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};

/**
 * Security: Validate role cache data integrity
 */
const isValidCachedRole = (data: any): data is CachedRole => {
  if (!data || typeof data !== 'object') return false;
  if (!data.role || typeof data.role !== 'string') return false;
  if (!data.timestamp || typeof data.timestamp !== 'number') return false;
  
  // Validate role is one of the allowed values
  const validRoles: AppRole[] = ['admin', 'user', 'dealer', 'professional', 'individual', 'fleet_manager', 'transporter', 'workshop', 'analyst', 'content_manager'];
  if (!validRoles.includes(data.role as AppRole)) return false;
  
  // Validate timestamp is reasonable (not in the future, not too old)
  const now = Date.now();
  const maxAge = ROLE_CONFIG.CACHE_DURATION * 60 * 1000;
  if (data.timestamp > now || data.timestamp < (now - maxAge)) return false;
  
  return true;
};

/**
 * Gets a cached role if it exists and isn't expired
 * Security: Validates cache integrity to prevent manipulation
 */
export const getCachedRole = (userId: string): AppRole | null => {
  try {
    const cacheKey = `user_role_${userId}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) return null;
    
    const parsed = JSON.parse(cachedData);
    
    // Security: Validate data structure and content
    if (!isValidCachedRole(parsed)) {
      console.warn('[getCachedRole] Invalid cache data, clearing');
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    // Security: Verify signature if present (detect tampering)
    if (parsed.signature) {
      const expectedSignature = generateCacheSignature(userId, parsed.role, parsed.timestamp);
      if (parsed.signature !== expectedSignature) {
        console.warn('[getCachedRole] Cache signature mismatch - possible tampering detected');
        localStorage.removeItem(cacheKey);
        return null;
      }
    }
    
    const { role, timestamp } = parsed;
    const now = Date.now();
    const expirationTime = ROLE_CONFIG.CACHE_DURATION * 60 * 1000;
    
    // Check if cache is expired
    if (now - timestamp > expirationTime) {
      console.log('[getCachedRole] Cache expired, clearing');
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return role;
  } catch (error) {
    console.error('[getCachedRole] Error reading cache:', error);
    // Clear potentially corrupted cache
    try {
      localStorage.removeItem(`user_role_${userId}`);
    } catch (e) {
      // Ignore cleanup errors
    }
    return null;
  }
};

/**
 * Sets a role in the cache
 * Security: Validates input before storing
 */
export const setCachedRole = (userId: string, role: AppRole): void => {
  try {
    // Security: Validate inputs
    if (!userId || typeof userId !== 'string') {
      console.error('[setCachedRole] Invalid userId');
      return;
    }
    
    const validRoles: AppRole[] = ['admin', 'user', 'dealer', 'professional', 'individual', 'fleet_manager', 'transporter', 'workshop', 'analyst', 'content_manager'];
    if (!validRoles.includes(role)) {
      console.error('[setCachedRole] Invalid role:', role);
      return;
    }
    
    const cacheKey = `user_role_${userId}`;
    const timestamp = Date.now();
    const cacheData: CachedRole = {
      role,
      timestamp,
      signature: generateCacheSignature(userId, role, timestamp) // Security: Add tamper detection
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('[setCachedRole] Role cached with signature:', role);
  } catch (error) {
    console.error('[setCachedRole] Error storing role in cache:', error);
  }
};

/**
 * Clears the cached role for a user
 */
export const clearCachedRole = (userId: string): void => {
  try {
    const cacheKey = `user_role_${userId}`;
    localStorage.removeItem(cacheKey);
    console.log('[clearCachedRole] Role cache cleared');
  } catch (error) {
    console.error('[clearCachedRole] Error clearing role cache:', error);
  }
};
