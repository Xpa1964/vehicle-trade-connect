
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types/auth';
import { getCachedRole, setCachedRole, clearCachedRole } from './roleCache';
import { validateRole } from './roleValidator';

/**
 * Fetches the user's role using the security definer function
 * This avoids the infinite recursion problem with RLS policies
 */
export const fetchUserRole = async (userId: string): Promise<AppRole> => {
  try {
    console.log('[fetchUserRole] Fetching role for user:', userId);
    
    // First, check if we have a cached role that isn't expired
    const cachedRole = getCachedRole(userId);
    if (cachedRole) {
      console.log('[fetchUserRole] Using cached role:', cachedRole);
      return cachedRole;
    }
    
    // If no valid cache, use the security definer function
    console.log('[fetchUserRole] Using get_user_role function for user_id:', userId);
    
    // Using the security definer function to prevent recursion
    const { data, error } = await (supabase as any)
      .rpc('get_user_role', { p_user_id: userId });
    
    if (error) {
      console.error('[fetchUserRole] Error fetching role:', error);
      clearCachedRole(userId); // Clear any cache if there's an error
      // Default to user role if there's an error
      return 'user' as AppRole;
    }
    
    console.log('[fetchUserRole] Response from get_user_role function:', data);
    
    if (!data) {
      console.log('[fetchUserRole] No role found for user:', userId);
      // Default role if none found
      return 'user' as AppRole; 
    }
    
    // Validate and ensure we have a proper AppRole value
    const validRole = validateRole(data);
    console.log('[fetchUserRole] Validated role:', validRole);
    
    // Cache the fetched role
    setCachedRole(userId, validRole);
    
    return validRole;
  } catch (error) {
    console.error('[fetchUserRole] Unexpected error:', error);
    // Return a default role instead of throwing to prevent breaking the auth flow
    return 'user' as AppRole;
  }
};

/**
 * Helper function for users to manually reload their role
 * This clears any cache and forces a fresh fetch directly from the database
 */
export const reloadUserRole = async (userId: string): Promise<AppRole | undefined> => {
  try {
    console.log('[reloadUserRole] Manually reloading role for user:', userId);
    
    // Clear the cache for this user
    clearCachedRole(userId);
    
    // Use the security definer function
    console.log('[reloadUserRole] Using get_user_role function');
    
    const { data, error } = await (supabase as any)
      .rpc('get_user_role', { p_user_id: userId });
    
    if (error) {
      console.error('[reloadUserRole] Error fetching role:', error);
      return 'user' as AppRole; // Return default role on error
    }
    
    console.log('[reloadUserRole] Response from get_user_role:', data);
    
    if (!data) {
      console.log('[reloadUserRole] No role found, using default role');
      return 'user' as AppRole;
    }
    
    // Validate and ensure we have a proper AppRole value
    const validRole = validateRole(data);
    console.log('[reloadUserRole] Validated role after reload:', validRole);
    
    // Cache the fetched role
    setCachedRole(userId, validRole);
    
    return validRole;
  } catch (error) {
    console.error('[reloadUserRole] Unexpected error while reloading role:', error);
    return 'user' as AppRole;
  }
};
