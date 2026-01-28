
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import AdminUserEditForm from '@/components/admin/AdminUserEditForm';
import PageHeader from '@/components/layout/PageHeader';

const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { hasPermission } = useUserRole();
  
  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has permission to edit users
  const canEditUsers = hasPermission('users.edit');
  
  if (!canEditUsers) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permiso para editar usuarios.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            ID de usuario no válido.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Editar Usuario" 
        subtitle="Modifica la información del usuario y sus permisos"
        showBackButton={true}
        backTo="/admin/control-panel"
        backText="Volver al Panel de Control"
      />
      <AdminUserEditForm userId={id} />
    </div>
  );
};

export default UserEditPage;
