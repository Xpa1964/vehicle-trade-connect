
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppRole } from '@/types/auth';

interface RoleMapping {
  role: AppRole;
  permissions: string[];
}

interface RolesViewProps {
  rolePermissions: RoleMapping[];
}

const RolesView = ({ rolePermissions }: RolesViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles del Sistema</CardTitle>
        <CardDescription>
          Estos son los roles disponibles en el sistema y sus permisos asociados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rolePermissions.map(roleMapping => (
            <Card key={roleMapping.role} className="overflow-hidden">
              <CardHeader className={`
                ${roleMapping.role === 'admin' ? 'bg-blue-50' : 
                  roleMapping.role === 'moderator' ? 'bg-green-50' : 
                  roleMapping.role === 'support' ? 'bg-yellow-50' :
                  roleMapping.role === 'content_manager' ? 'bg-purple-50' :
                  roleMapping.role === 'analyst' ? 'bg-indigo-50' :
                  'bg-gray-50'}
              `}>
                <div className="flex items-center gap-2">
                  <Badge variant={roleMapping.role === 'admin' ? 'default' : 'outline'} className="text-xs">
                    {roleMapping.role}
                  </Badge>
                  <CardTitle className="text-base">{roleMapping.role.charAt(0).toUpperCase() + roleMapping.role.slice(1)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold mb-2">Permisos: {roleMapping.permissions.length}</h4>
                <div className="flex flex-wrap gap-1">
                  {roleMapping.permissions.map(permission => (
                    <Badge variant="outline" key={permission} className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesView;
