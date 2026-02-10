
import * as React from 'react';
const { useEffect, useState } = React;
import { useLocation } from 'react-router-dom';
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

  const loginRedirectUrl = `/login?redirect=${encodeURIComponent(
    `${location.pathname}${location.search}`
  )}`;
  
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Allow access to public routes regardless of auth status
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated and trying to access protected route
  // Using window.location for stable redirect to avoid React context issues
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to login');
    window.location.href = loginRedirectUrl;
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check admin routes - allow admin, content_manager, and analyst roles
  if (isAdminRoute) {
    const userRole = user?.role;
    const allowedRoles = ['admin', 'content_manager', 'analyst'];
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log('[ProtectedRoute] User role not allowed for admin route:', userRole);
      window.location.href = '/dashboard';
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
  }

  // Check specific role requirements
  if (requiredRole && user?.role !== requiredRole) {
    console.log('[ProtectedRoute] Required role not met:', requiredRole, 'vs', user?.role);
    window.location.href = '/dashboard';
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
