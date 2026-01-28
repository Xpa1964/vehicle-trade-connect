
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types/auth';

interface UserProfileUpdate {
  full_name: string;
  company_name: string;
  contact_phone: string;
  country: string;
  address: string;
  business_type: string;
  trader_type: string;
}

type SupabaseRpcResponse = {
  success?: boolean;
  message?: string;
  [key: string]: any;
};

export const useAdminUserEdit = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (userId: string, profileData: UserProfileUpdate) => {
    setIsUpdating(true);
    
    try {
      console.log('[useAdminUserEdit] Updating profile for user:', userId, profileData);
      
      const { data, error } = await supabase.rpc('admin_update_user_profile', {
        p_user_id: userId,
        p_full_name: profileData.full_name,
        p_company_name: profileData.company_name,
        p_contact_phone: profileData.contact_phone,
        p_country: profileData.country,
        p_address: profileData.address,
        p_business_type: profileData.business_type,
        p_trader_type: profileData.trader_type
      });

      const d = data as SupabaseRpcResponse;

      if (error) {
        console.error('[useAdminUserEdit] Error updating profile:', error);
        throw error;
      }

      if (!d?.success) {
        throw new Error(d?.message || 'Failed to update profile');
      }

      // Log the action for audit trail
      await supabase.rpc('log_activity', {
        p_user_id: userId,
        p_action_type: 'admin_update_user_profile',
        p_entity_type: 'user_profile',
        p_entity_id: userId,
        p_details: JSON.stringify({
          updated_by: (await supabase.auth.getUser()).data.user?.id,
          changes: profileData
        }),
        p_severity: 'info'
      });

      console.log('[useAdminUserEdit] Profile updated successfully');
      return data;
    } catch (error) {
      console.error('[useAdminUserEdit] Error in updateProfile:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateRole = async (userId: string, newRole: AppRole) => {
    setIsUpdating(true);
    
    try {
      console.log('[useAdminUserEdit] Updating role for user:', userId, 'to:', newRole);
      
      const { data, error } = await supabase.rpc('admin_update_user_role', {
        p_user_id: userId,
        p_new_role: newRole
      });

      const d = data as SupabaseRpcResponse;

      if (error) {
        console.error('[useAdminUserEdit] Error updating role:', error);
        throw error;
      }

      if (!d?.success) {
        throw new Error(d?.message || 'Failed to update role');
      }

      // Log the action for audit trail
      await supabase.rpc('log_activity', {
        p_user_id: userId,
        p_action_type: 'admin_update_user_role',
        p_entity_type: 'user_role',
        p_entity_id: userId,
        p_details: JSON.stringify({
          updated_by: (await supabase.auth.getUser()).data.user?.id,
          new_role: newRole,
          timestamp: new Date().toISOString()
        }),
        p_severity: 'info'
      });

      console.log('[useAdminUserEdit] Role updated successfully');
      return data;
    } catch (error) {
      console.error('[useAdminUserEdit] Error in updateRole:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProfile,
    updateRole,
    isUpdating
  };
};
