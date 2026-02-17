
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AppRole, Permission } from '@/types/auth';
import { logSystemActivity } from '@/utils/activityLogger';
import { PermissionItem } from '@/hooks/useAdminStatistics';

interface RolePermissionMapping {
  role: AppRole;
  permissions: Permission[];
}

export const useRolesAndPermissions = () => {
  const [activeTab, setActiveTab] = useState<string>("roles");
  const [rolePermissions, setRolePermissions] = useState<RolePermissionMapping[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Mock permissions data since we can't access the permissions table
        const mockPermissionsData: PermissionItem[] = [
          { id: '1', name: 'users.view', description: 'View user information', category: 'Users' },
          { id: '2', name: 'users.edit', description: 'Edit user information', category: 'Users' },
          { id: '3', name: 'users.create', description: 'Create new users', category: 'Users' },
          { id: '4', name: 'users.delete', description: 'Delete users', category: 'Users' },
          { id: '5', name: 'vehicles.view', description: 'View vehicle information', category: 'Vehicles' },
          { id: '6', name: 'vehicles.edit', description: 'Edit vehicle details', category: 'Vehicles' },
          { id: '7', name: 'vehicles.create', description: 'Add new vehicles', category: 'Vehicles' },
          { id: '8', name: 'vehicles.delete', description: 'Remove vehicles', category: 'Vehicles' },
          { id: '9', name: 'auctions.view', description: 'View auctions', category: 'Auctions' },
          { id: '10', name: 'auctions.create', description: 'Create auctions', category: 'Auctions' },
          { id: '11', name: 'auctions.edit', description: 'Edit auctions', category: 'Auctions' },
          { id: '12', name: 'auctions.manage', description: 'Manage auction lifecycle', category: 'Auctions' },
          { id: '13', name: 'announcements.view', description: 'View announcements', category: 'Announcements' },
          { id: '14', name: 'announcements.create', description: 'Create announcements', category: 'Announcements' },
          { id: '15', name: 'announcements.edit', description: 'Edit announcements', category: 'Announcements' },
          { id: '16', name: 'announcements.delete', description: 'Delete announcements', category: 'Announcements' },
          { id: '17', name: 'content.view', description: 'View content', category: 'Content' },
          { id: '18', name: 'content.create', description: 'Create content', category: 'Content' },
          { id: '19', name: 'content.edit', description: 'Edit content', category: 'Content' },
          { id: '20', name: 'content.delete', description: 'Delete content', category: 'Content' },
          { id: '21', name: 'analytics.view', description: 'View analytics data', category: 'Analytics' },
          { id: '22', name: 'analytics.export', description: 'Export analytics data', category: 'Analytics' },
          { id: '23', name: 'settings.view', description: 'View system settings', category: 'Settings' },
          { id: '24', name: 'settings.edit', description: 'Edit system settings', category: 'Settings' },
          { id: '25', name: 'logs.view', description: 'View system logs', category: 'Logs' },
          { id: '26', name: 'logs.export', description: 'Export system logs', category: 'Logs' }
        ];
        
        setAllPermissions(mockPermissionsData);
        
        // Mock role-permission mappings aligned with DB enum values
        const mockRolePermissionMappings: RolePermissionMapping[] = [
          {
            role: 'admin',
            permissions: [
              'users.view', 'users.create', 'users.edit', 'users.delete',
              'vehicles.view', 'vehicles.create', 'vehicles.edit', 'vehicles.delete',
              'auctions.view', 'auctions.create', 'auctions.edit', 'auctions.manage',
              'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.delete',
              'content.view', 'content.create', 'content.edit', 'content.delete',
              'analytics.view', 'analytics.export',
              'settings.view', 'settings.edit',
              'logs.view', 'logs.export'
            ]
          },
          {
            role: 'dealer',
            permissions: [
              'vehicles.view', 'vehicles.create', 'vehicles.edit', 'vehicles.delete',
              'auctions.view', 'auctions.create',
              'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.delete'
            ]
          },
          {
            role: 'user',
            permissions: [
              'vehicles.view',
              'auctions.view',
              'announcements.view'
            ]
          },
          {
            role: 'content_manager',
            permissions: [
              'content.view', 'content.create', 'content.edit', 'content.delete',
              'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.delete'
            ]
          },
          {
            role: 'analyst',
            permissions: [
              'users.view',
              'vehicles.view',
              'auctions.view',
              'announcements.view',
              'analytics.view', 'analytics.export',
              'logs.view', 'logs.export'
            ]
          },
          {
            role: 'professional',
            permissions: [
              'vehicles.view', 'vehicles.create', 'vehicles.edit',
              'auctions.view',
              'announcements.view', 'announcements.create'
            ]
          },
          {
            role: 'individual',
            permissions: [
              'vehicles.view', 'vehicles.create',
              'auctions.view',
              'announcements.view'
            ]
          },
          {
            role: 'fleet_manager',
            permissions: [
              'vehicles.view', 'vehicles.create', 'vehicles.edit', 'vehicles.delete',
              'auctions.view'
            ]
          },
          {
            role: 'transporter',
            permissions: [
              'vehicles.view',
              'announcements.view'
            ]
          },
          {
            role: 'workshop',
            permissions: [
              'vehicles.view',
              'announcements.view'
            ]
          }
        ];
        
        setRolePermissions(mockRolePermissionMappings);
        
        // Log this activity
        await logSystemActivity('permissions_view', { 
          message: 'User viewed roles and permissions' 
        });
      } catch (error: any) {
        console.error("Error loading roles and permissions:", error);
        toast.error("Error loading roles and permissions");
        
        // Fallback to minimal mock data if everything fails
        setAllPermissions([
          { id: '1', name: 'users.view', description: 'View user information', category: 'Users' },
          { id: '2', name: 'users.edit', description: 'Edit user information', category: 'Users' },
          { id: '3', name: 'vehicles.view', description: 'View vehicle information', category: 'Vehicles' },
        ]);
        
        setRolePermissions([
          { role: 'admin', permissions: ['users.view', 'users.edit', 'vehicles.view'] },
          { role: 'user', permissions: ['vehicles.view'] }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Function to check if a role has a specific permission
  const roleHasPermission = (role: AppRole, permission: string): boolean => {
    const roleMapping = rolePermissions.find(r => r.role === role);
    return roleMapping ? roleMapping.permissions.includes(permission as Permission) : false;
  };
  
  // Group permissions by category
  const permissionsByCategory = allPermissions.reduce((acc, permission) => {
    const category = permission.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, PermissionItem[]>);
  
  return {
    activeTab,
    setActiveTab,
    rolePermissions,
    allPermissions,
    permissionsByCategory,
    roleHasPermission,
    isLoading
  };
};
