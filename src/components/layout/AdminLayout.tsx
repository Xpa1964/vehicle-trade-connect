
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavigation from '@/components/layout/AdminNavigation';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin header with navigation */}
      <div className="bg-card shadow-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <AdminNavigation />
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AdminLayout;
