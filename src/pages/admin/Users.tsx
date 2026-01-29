
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Loader2, Edit, Eye } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  contact_phone: string | null;
  country: string | null;
  address: string | null;
  business_type: string | null;
  trader_type: string | null;
  company_logo: string | null;
  total_operations: number;
  operations_breakdown: any;
  created_at: string;
  updated_at: string | null;
  registration_date: string | null;
  role: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('[AdminUsers] Fetching users via direct query');
      
      // Usar consulta directa a las tablas con join
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          company_name,
          contact_phone,
          country,
          address,
          business_type,
          trader_type,
          company_logo,
          total_operations,
          operations_breakdown,
          created_at,
          updated_at,
          registration_date
        `);
        
      if (error) {
        console.error('[AdminUsers] Error fetching users:', error);
        throw error;
      }
      
      // Obtener emails y roles para cada usuario
      const usersWithDetails = await Promise.all(
        (data || []).map(async (profile: any) => {
          // Obtener email del usuario
          const { data: authUser } = await supabase.auth.admin.getUserById(profile.user_id || profile.id);
          
          // Obtener rol del usuario
          const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.user_id || profile.id)
            .single();
          
          return {
            ...profile,
            id: profile.user_id || profile.id,
            email: authUser?.user?.email || profile.email || 'No disponible',
            role: userRole?.role || 'user'
          } as AdminUser;
        })
      );
      
      console.log('[AdminUsers] Users fetched successfully:', usersWithDetails.length, 'users');
      return usersWithDetails;
    }
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Administrador</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-500">Moderador</Badge>;
      case 'dealer':
        return <Badge className="bg-green-500">Distribuidor</Badge>;
      default:
        return <Badge>{role || 'Usuario'}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Gestión de Usuarios" 
        subtitle="Administra los usuarios registrados en la plataforma"
        showBackButton={true}
        backTo="/admin/control-panel"
        backText="Volver al Panel de Control"
      />
      
      <div className="flex justify-end mb-4">
        <Button variant="default" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Añadir Usuario
        </Button>
      </div>

      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No hay usuarios disponibles
                </TableCell>
              </TableRow>
            )}
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name || 'Sin nombre'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company_name || 'N/A'}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  <Badge className="bg-green-500">Activo</Badge>
                </TableCell>
                <TableCell>
                  {user.created_at ? format(new Date(user.created_at), 'dd/MM/yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate(`/admin/users/${user.id}/view`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
