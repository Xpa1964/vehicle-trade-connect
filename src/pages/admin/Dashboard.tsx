
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { currentRole, isReloading } = useUserRole();
  
  // Show loading while auth or role is being determined
  if (authLoading || isReloading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated - using window.location for stability
  if (!isAuthenticated || !user) {
    window.location.href = '/login';
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check if user has admin role - use both user.role and currentRole for redundancy
  const effectiveRole = currentRole || user?.role;
  const isAdmin = effectiveRole === 'admin' || 
                 effectiveRole === 'content_manager' || 
                 effectiveRole === 'analyst';
                 
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permiso para acceder al panel de administración.
            Rol actual: {effectiveRole || 'No asignado'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return <AdminDashboard />;
};

export default AdminDashboardPage;
