import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  hasPermission, 
  getRolePermissions, 
  hasAnyPermission, 
  getRolesWithPermission 
} from '@/utils/roles/permissionsService';
import { AppRole, Permission } from '@/types/auth';

describe('permissionsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hasPermission', () => {
    it('returns true when admin has users.view permission', () => {
      const result = hasPermission('admin', 'users.view');
      expect(result).toBe(true);
    });

    it('returns true when admin has all permissions', () => {
      const adminPermissions: Permission[] = [
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'vehicles.view', 'vehicles.create', 'vehicles.edit', 'vehicles.delete',
        'auctions.view', 'auctions.create', 'auctions.edit', 'auctions.manage',
        'settings.view', 'settings.edit'
      ];

      adminPermissions.forEach(permission => {
        expect(hasPermission('admin', permission)).toBe(true);
      });
    });

    it('returns false when user does not have users.edit permission', () => {
      const result = hasPermission('user', 'users.edit');
      expect(result).toBe(false);
    });

    it('returns true when user has vehicles.view permission', () => {
      const result = hasPermission('user', 'vehicles.view');
      expect(result).toBe(true);
    });

    it('returns false when dealer does not have users.delete permission', () => {
      const result = hasPermission('dealer', 'users.delete');
      expect(result).toBe(false);
    });

    it('returns true when dealer has vehicles.create permission', () => {
      const result = hasPermission('dealer', 'vehicles.create');
      expect(result).toBe(true);
    });

    it('returns false and logs warning for non-existent role', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = hasPermission('invalid_role' as AppRole, 'users.view');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Role 'invalid_role' not found")
      );
      
      consoleSpy.mockRestore();
    });

    it('returns false when moderator lacks settings.edit permission', () => {
      const result = hasPermission('moderator', 'settings.edit');
      expect(result).toBe(false);
    });

    it('returns true when moderator has users.view permission', () => {
      const result = hasPermission('moderator', 'users.view');
      expect(result).toBe(true);
    });
  });

  describe('getRolePermissions', () => {
    it('returns correct permissions array for admin', () => {
      const permissions = getRolePermissions('admin');
      
      expect(permissions).toContain('users.view');
      expect(permissions).toContain('users.create');
      expect(permissions).toContain('users.edit');
      expect(permissions).toContain('users.delete');
      expect(permissions).toContain('settings.view');
      expect(permissions).toContain('settings.edit');
      expect(permissions.length).toBeGreaterThan(10);
    });

    it('returns correct permissions array for user', () => {
      const permissions = getRolePermissions('user');
      
      expect(permissions).toEqual([
        'vehicles.view',
        'auctions.view',
        'announcements.view',
        'content.view'
      ]);
    });

    it('returns correct permissions array for dealer', () => {
      const permissions = getRolePermissions('dealer');
      
      expect(permissions).toContain('vehicles.view');
      expect(permissions).toContain('vehicles.create');
      expect(permissions).toContain('vehicles.edit');
      expect(permissions).toContain('vehicles.delete');
      expect(permissions).toContain('auctions.view');
      expect(permissions).not.toContain('users.delete');
    });

    it('returns correct permissions array for moderator', () => {
      const permissions = getRolePermissions('moderator');
      
      expect(permissions).toContain('users.view');
      expect(permissions).toContain('users.edit');
      expect(permissions).toContain('vehicles.view');
      expect(permissions).not.toContain('users.delete');
      expect(permissions).not.toContain('settings.edit');
    });

    it('returns correct permissions for content_manager', () => {
      const permissions = getRolePermissions('content_manager');
      
      expect(permissions).toContain('content.view');
      expect(permissions).toContain('content.create');
      expect(permissions).toContain('content.edit');
      expect(permissions).toContain('content.delete');
      expect(permissions).toContain('announcements.view');
    });

    it('returns correct permissions for support', () => {
      const permissions = getRolePermissions('support');
      
      expect(permissions).toContain('users.view');
      expect(permissions).toContain('vehicles.view');
      expect(permissions).toContain('logs.view');
      expect(permissions).not.toContain('users.edit');
    });

    it('returns correct permissions for analyst', () => {
      const permissions = getRolePermissions('analyst');
      
      expect(permissions).toContain('analytics.view');
      expect(permissions).toContain('analytics.export');
      expect(permissions).toContain('logs.view');
      expect(permissions).toContain('logs.export');
    });

    it('returns empty array and logs warning for non-existent role', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const permissions = getRolePermissions('fake_role' as AppRole);
      
      expect(permissions).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Role 'fake_role' not found")
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('hasAnyPermission', () => {
    it('returns true when user has at least one of the specified permissions', () => {
      const result = hasAnyPermission('user', ['users.edit', 'vehicles.view', 'settings.edit']);
      expect(result).toBe(true);
    });

    it('returns false when user has none of the specified permissions', () => {
      const result = hasAnyPermission('user', ['users.edit', 'users.delete', 'settings.edit']);
      expect(result).toBe(false);
    });

    it('returns true when admin has any permission from list', () => {
      const result = hasAnyPermission('admin', ['logs.view', 'logs.export']);
      expect(result).toBe(true);
    });

    it('returns true when dealer has vehicles.create from list', () => {
      const result = hasAnyPermission('dealer', ['users.delete', 'vehicles.create', 'settings.edit']);
      expect(result).toBe(true);
    });

    it('returns false for empty permissions array', () => {
      const result = hasAnyPermission('admin', []);
      expect(result).toBe(false);
    });

    it('returns false for non-existent role', () => {
      const result = hasAnyPermission('invalid' as AppRole, ['users.view']);
      expect(result).toBe(false);
    });

    it('returns true when moderator has users.view from list', () => {
      const result = hasAnyPermission('moderator', ['users.view', 'settings.edit']);
      expect(result).toBe(true);
    });
  });

  describe('getRolesWithPermission', () => {
    it('returns all roles with users.view permission', () => {
      const roles = getRolesWithPermission('users.view');
      
      expect(roles).toContain('admin');
      expect(roles).toContain('moderator');
      expect(roles).toContain('support');
      expect(roles).toContain('analyst');
      expect(roles).not.toContain('user');
    });

    it('returns only admin role for settings.edit permission', () => {
      const roles = getRolesWithPermission('settings.edit');
      
      expect(roles).toEqual(['admin']);
    });

    it('returns multiple roles for vehicles.view permission', () => {
      const roles = getRolesWithPermission('vehicles.view');
      
      expect(roles).toContain('admin');
      expect(roles).toContain('moderator');
      expect(roles).toContain('user');
      expect(roles).toContain('dealer');
      expect(roles).toContain('support');
      expect(roles).toContain('analyst');
    });

    it('returns only admin for users.delete permission', () => {
      const roles = getRolesWithPermission('users.delete');
      
      expect(roles).toEqual(['admin']);
    });

    it('returns correct roles for content.edit permission', () => {
      const roles = getRolesWithPermission('content.edit');
      
      expect(roles).toContain('admin');
      expect(roles).toContain('moderator');
      expect(roles).toContain('content_manager');
      expect(roles).not.toContain('user');
      expect(roles).not.toContain('dealer');
    });

    it('returns correct roles for analytics.view permission', () => {
      const roles = getRolesWithPermission('analytics.view');
      
      expect(roles).toContain('admin');
      expect(roles).toContain('analyst');
      expect(roles).not.toContain('user');
      expect(roles).not.toContain('moderator');
    });

    it('returns empty array for non-existent permission', () => {
      const roles = getRolesWithPermission('fake.permission' as Permission);
      
      expect(roles).toEqual([]);
    });

    it('returns correct roles for auctions.manage permission', () => {
      const roles = getRolesWithPermission('auctions.manage');
      
      expect(roles).toEqual(['admin']);
    });
  });
});
