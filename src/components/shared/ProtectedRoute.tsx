
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredPermission, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/vehicles', '/blog'];
  const isPublicRoute = publicRoutes.includes(location.pathname) || 
                       location.pathname.startsWith('/vehicles/') ||
                       location.pathname.startsWith('/blog/');

  useEffect(() => {
    if (!isLoading) {
      setHasCheckedAuth(true);
    }
  }, [isLoading]);

  // Show loading while auth is being determined
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Allow access to public routes regardless of auth status
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin routes
  if (isAdminRoute && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check specific role requirements
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
