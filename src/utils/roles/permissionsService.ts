
import { AppRole, Permission } from '@/types/auth';

// Define permission sets for each role
const rolePermissions: Record<AppRole, Permission[]> = {
  admin: [
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'vehicles.view', 'vehicles.create', 'vehicles.edit', 'vehicles.delete',
    'auctions.view', 'auctions.create', 'auctions.edit', 'auctions.manage',
    'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.delete',
    'content.view', 'content.create', 'content.edit', 'content.delete',
    'analytics.view', 'analytics.export',
    'settings.view', 'settings.edit',
    'logs.view', 'logs.export',
    'notifications.manage'
  ],
  moderator: [
    'users.view', 'users.edit',
    'vehicles.view', 'vehicles.edit',
    'auctions.view', 'auctions.edit',
    'announcements.view', 'announcements.edit',
    'content.view', 'content.edit',
    'logs.view'
  ],
  user: [
    'vehicles.view',
    'auctions.view',
    'announcements.view',
    'content.view'
  ],
  dealer: [
    'vehicles.view', 'vehicles.create', 'vehicles.edit', 'vehicles.delete',
    'auctions.view', 'auctions.create',
    'announcements.view', 'announcements.create', 'announcements.edit'
  ],
  content_manager: [
    'content.view', 'content.create', 'content.edit', 'content.delete',
    'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.delete'
  ],
  support: [
    'users.view',
    'vehicles.view',
    'auctions.view',
    'announcements.view',
    'content.view',
    'logs.view'
  ],
  analyst: [
    'analytics.view', 'analytics.export',
    'users.view',
    'vehicles.view',
    'auctions.view',
    'logs.view', 'logs.export'
  ]
};

/**
 * Checks if a role has a specific permission
 * @param role The user role to check
 * @param permission The permission to check for
 * @returns boolean True if the role has the permission
 */
export const hasPermission = (role: AppRole, permission: Permission): boolean => {
  // If role doesn't exist in our mapping, return false
  if (!rolePermissions[role]) {
    console.warn(`Role '${role}' not found in permissions mapping`);
    return false;
  }
  
  return rolePermissions[role].includes(permission);
};

/**
 * Gets all permissions for a specific role
 * @param role The role to get permissions for
 * @returns Permission[] Array of permissions for the role
 */
export const getRolePermissions = (role: AppRole): Permission[] => {
  if (!rolePermissions[role]) {
    console.warn(`Role '${role}' not found in permissions mapping, returning empty permissions array`);
    return [];
  }
  
  return rolePermissions[role];
};

/**
 * Checks if a user has any of the specified permissions
 * @param role The user role to check
 * @param permissions Array of permissions to check (any match returns true)
 * @returns boolean True if the role has any of the permissions
 */
export const hasAnyPermission = (role: AppRole, permissions: Permission[]): boolean => {
  if (!rolePermissions[role]) {
    return false;
  }
  
  return permissions.some(permission => rolePermissions[role].includes(permission));
};

/**
 * Gets all roles that have a specific permission
 * @param permission The permission to check for
 * @returns AppRole[] Array of roles that have the permission
 */
export const getRolesWithPermission = (permission: Permission): AppRole[] => {
  return Object.entries(rolePermissions)
    .filter(([_, permissions]) => permissions.includes(permission))
    .map(([role]) => role as AppRole);
};
