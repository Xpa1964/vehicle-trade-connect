
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavigation from '@/components/layout/AdminNavigation';

const AdminLayout: React.FC = () => {
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
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
