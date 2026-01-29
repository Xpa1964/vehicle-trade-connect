
import { AppRole, Permission } from '@/types/auth';

// Define permission sets for each role (matching database enum)
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
  analyst: [
    'analytics.view', 'analytics.export',
    'users.view',
    'vehicles.view',
    'auctions.view',
    'logs.view', 'logs.export'
  ],
  content_manager: [
    'content.view', 'content.create', 'content.edit', 'content.delete',
    'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.delete'
  ],
  dealer: [
    'vehicles.view', 'vehicles.create', 'vehicles.edit', 'vehicles.delete',
    'auctions.view', 'auctions.create',
    'announcements.view', 'announcements.create', 'announcements.edit'
  ],
  fleet_manager: [
    'vehicles.view', 'vehicles.create', 'vehicles.edit',
    'auctions.view'
  ],
  individual: [
    'vehicles.view',
    'auctions.view',
    'announcements.view',
    'content.view'
  ],
  professional: [
    'vehicles.view', 'vehicles.create', 'vehicles.edit',
    'auctions.view', 'auctions.create',
    'announcements.view', 'announcements.create'
  ],
  transporter: [
    'vehicles.view',
    'auctions.view'
  ],
  user: [
    'vehicles.view',
    'auctions.view',
    'announcements.view',
    'content.view'
  ],
  workshop: [
    'vehicles.view',
    'auctions.view'
  ]
};

export const hasPermission = (role: AppRole, permission: Permission): boolean => {
  if (!rolePermissions[role]) {
    console.warn(`Role '${role}' not found in permissions mapping`);
    return false;
  }
  return rolePermissions[role].includes(permission);
};

export const getRolePermissions = (role: AppRole): Permission[] => {
  if (!rolePermissions[role]) {
    console.warn(`Role '${role}' not found in permissions mapping`);
    return [];
  }
  return rolePermissions[role];
};

export const hasAnyPermission = (role: AppRole, permissions: Permission[]): boolean => {
  if (!rolePermissions[role]) return false;
  return permissions.some(permission => rolePermissions[role].includes(permission));
};

export const getRolesWithPermission = (permission: Permission): AppRole[] => {
  return Object.entries(rolePermissions)
    .filter(([_, permissions]) => permissions.includes(permission))
    .map(([role]) => role as AppRole);
};
