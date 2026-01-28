
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useRolesAndPermissions } from '@/hooks/useRolesAndPermissions';
import RolesView from '@/components/admin/roles/RolesView';
import PermissionsView from '@/components/admin/roles/PermissionsView';
import AccessDeniedCard from '@/components/admin/roles/AccessDeniedCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const RolesAndPermissions = () => {
  const { user } = useAuth();
  const { hasPermission } = useUserRole();
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    rolePermissions,
    permissionsByCategory,
    roleHasPermission,
    isLoading
  } = useRolesAndPermissions();
  
  // Check if the user has permissions to manage roles
  if (!hasPermission('users.edit')) {
    return <AccessDeniedCard />;
  }

  return (
    <div className="container">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/admin/control-panel')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Panel de Control
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Roles y Permisos</h1>
      </div>
      
      <Tabs defaultValue="roles" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Roles</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Permisos</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles">
          <RolesView rolePermissions={rolePermissions} />
        </TabsContent>
        
        <TabsContent value="permissions">
          <PermissionsView 
            permissionsByCategory={permissionsByCategory}
            rolePermissions={rolePermissions}
            roleHasPermission={roleHasPermission}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RolesAndPermissions;
