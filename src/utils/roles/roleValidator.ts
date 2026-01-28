
import { AppRole } from '@/types/auth';

/**
 * Validates that a value is a valid AppRole
 * This helps ensure type safety when working with data from external sources
 * Enhanced to better handle PostgreSQL enum values and support extended roles
 */
export const validateRole = (role: any): AppRole => {
  // Extended list of valid roles with more granular admin roles
  const validRoles: AppRole[] = [
    'admin', 'dealer', 'user', 'moderator', 
    'support', 'content_manager', 'analyst'
  ];
  
  console.log('[validateRole] Validating role:', role, 'Type:', typeof role);
  
  // If the role is directly a string that matches a valid role
  if (typeof role === 'string' && validRoles.includes(role as AppRole)) {
    console.log('[validateRole] Role is a valid string:', role);
    return role as AppRole;
  }
  
  // If the role is an object with a property (possible format from PostgreSQL enum)
  if (role && typeof role === 'object') {
    console.log('[validateRole] Role is an object:', JSON.stringify(role));
    
    // Check if it has a property like 'value' or 'name'
    if ('value' in role && typeof role.value === 'string' && validRoles.includes(role.value as AppRole)) {
      console.log('[validateRole] Using role.value:', role.value);
      return role.value as AppRole;
    }
    
    if ('name' in role && typeof role.name === 'string' && validRoles.includes(role.name as AppRole)) {
      console.log('[validateRole] Using role.name:', role.name);
      return role.name as AppRole;
    }
    
    // Handle other potential property names returned by PostgreSQL
    if ('enum_value' in role && typeof role.enum_value === 'string' && validRoles.includes(role.enum_value as AppRole)) {
      console.log('[validateRole] Using role.enum_value:', role.enum_value);
      return role.enum_value as AppRole;
    }
    
    // Try converting the object to a string
    const roleString = String(role);
    if (validRoles.includes(roleString as AppRole)) {
      console.log('[validateRole] Converted object to string:', roleString);
      return roleString as AppRole;
    }
    
    // Last attempt: look for any property that might contain the role
    for (const key in role) {
      if (
        typeof role[key] === 'string' && 
        validRoles.includes(role[key] as AppRole)
      ) {
        console.log(`[validateRole] Found role in object property ${key}:`, role[key]);
        return role[key] as AppRole;
      }
    }
  }
  
  console.warn('[validateRole] Invalid role received:', role);
  return 'user' as AppRole; // Default to user role if invalid
};
