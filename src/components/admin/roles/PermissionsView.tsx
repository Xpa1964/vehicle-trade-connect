
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert } from 'lucide-react';
import { AppRole } from '@/types/auth';

export interface PermissionItem {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RoleMapping {
  role: AppRole;
  permissions: string[];
}

interface PermissionsViewProps {
  permissionsByCategory: Record<string, PermissionItem[]>;
  rolePermissions: RoleMapping[];
  roleHasPermission: (role: AppRole, permission: string) => boolean;
}

const PermissionsView = ({ 
  permissionsByCategory, 
  rolePermissions, 
  roleHasPermission 
}: PermissionsViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permisos por Categoría</CardTitle>
        <CardDescription>
          Lista completa de permisos agrupados por categoría y asignados a roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(permissionsByCategory).map(category => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">{category}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Permiso</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="w-[400px]">Roles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionsByCategory[category].map(permission => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                        <code>{permission.name}</code>
                      </div>
                    </TableCell>
                    <TableCell>{permission.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rolePermissions
                          .filter(roleMapping => roleHasPermission(roleMapping.role, permission.name))
                          .map(roleMapping => (
                            <Badge 
                              key={roleMapping.role}
                              variant={roleMapping.role === 'admin' ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {roleMapping.role}
                            </Badge>
                          ))
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PermissionsView;
