
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentRole, hasPermission } = useUserRole();
  
  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has admin role
  const isAdmin = currentRole === 'admin' || 
                 currentRole === 'content_manager' || 
                 currentRole === 'analyst';
                 
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permiso para acceder al panel de administración.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return <AdminDashboard />;
};

export default AdminDashboardPage;
