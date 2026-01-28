
import React from 'react';
import AdminNavigation from '@/components/layout/AdminNavigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin header with navigation */}
      <div className="bg-card shadow sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <AdminNavigation />
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
