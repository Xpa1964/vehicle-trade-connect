
import { User } from '@supabase/supabase-js';
import { UserWithMeta, AppRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchUserRole } from '@/utils/roles';

// Variable to prevent multiple enhancement attempts for the same user
const enhanceInProgress = new Map<string, boolean>();

/**
 * Enhances a Supabase user object with additional metadata
 * @param user The base Supabase user object
 * @returns An enhanced user object with additional metadata
 */
export const enhanceUser = async (user: User | null): Promise<UserWithMeta | null> => {
  if (!user) {
    console.log('[enhanceUser] No user to enhance');
    return null;
  }
  
  console.log('🎯 [DEBUG NOTIFICATIONS] Starting enhanceUser for:', user.id);
  
  // Prevent multiple simultaneous calls for the same user
  if (enhanceInProgress.get(user.id)) {
    console.log('[enhanceUser] Enhancement already in progress for user:', user.id);
    console.log('🎯 [DEBUG NOTIFICATIONS] Returning basic user to prevent blocking notifications');
    
    // Create a basic user to avoid an infinite loading loop - CRITICAL for notifications
    const basicUser = { 
      ...user, 
      name: user.email?.split('@')[0] || `User-${user.id.substring(0, 6)}`, 
      role: 'user' as AppRole, 
      profile: {} 
    } as UserWithMeta;
    
    return basicUser;
  }
  
  enhanceInProgress.set(user.id, true);
  console.log('[enhanceUser] Enhancing user:', user.id);
  
  try {
    // Create a deep copy to avoid mutation
    const enhancedUser = { ...user } as UserWithMeta;
    
    // First, try to get profile data from the profiles table
    let profileData = null;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profile) {
        profileData = profile;
        console.log('[enhanceUser] Profile data from database:', profile);
      }
    } catch (error) {
      console.log('[enhanceUser] No profile found in database, using metadata fallback');
    }
    
    // Set profile data - prioritize database profile over user_metadata
    if (profileData) {
      enhancedUser.profile = profileData;
      enhancedUser.name = profileData.company_name || profileData.full_name || `User-${user.id.substring(0, 6)}`;
    } else {
      // Fallback to user_metadata if no profile in database
      const userData = user.user_metadata || {};
      enhancedUser.profile = {
        full_name: userData.full_name,
        company_name: userData.company_name,
        business_type: userData.business_type
      };
      enhancedUser.name = userData.company_name || userData.full_name || userData.name || `User-${user.id.substring(0, 6)}`;
    }
    
    // Default to standard user role
    enhancedUser.role = 'user';
    
    // Get user role using our improved function that uses the security definer function
    try {
      console.log('[enhanceUser] Getting user role with fetchUserRole...');
      const role = await fetchUserRole(user.id);
      
      if (role) {
        console.log('[enhanceUser] Role obtained:', role);
        enhancedUser.role = role;
        
        if (role === 'admin') {
          console.log('[enhanceUser] ADMIN ROLE DETECTED for user:', user.id);
          toast.success('Logged in as administrator');
        }
      }
    } catch (error) {
      console.error("[enhanceUser] Error getting user role:", error);
      enhancedUser.role = 'user'; // Fallback to user role in case of error
    }
    
    console.log('[enhanceUser] Final enhanced user:', {
      id: enhancedUser.id,
      name: enhancedUser.name,
      role: enhancedUser.role,
      companyName: enhancedUser.profile?.company_name
    });
    console.log('🎯 [DEBUG NOTIFICATIONS] ✅ Enhanced user ready for notifications:', enhancedUser.id);
    
    enhanceInProgress.set(user.id, false);
    return enhancedUser;
  } catch (error) {
    console.error('[enhanceUser] 🚨 Error enhancing user:', error);
    enhanceInProgress.set(user.id, false);
    
    // CRITICAL: In case of any error, ALWAYS return a valid user for notifications
    const basicUser = { 
      ...user, 
      name: user.email?.split('@')[0] || `User-${user.id.substring(0, 6)}`, 
      role: 'user' as AppRole, 
      profile: {} 
    } as UserWithMeta;
    console.log('🎯 [DEBUG NOTIFICATIONS] ⚠️ Returning basic user after error for notifications:', basicUser.id);
    return basicUser;
  }
};
