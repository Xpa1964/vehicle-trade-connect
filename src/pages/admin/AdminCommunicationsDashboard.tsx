
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { Navigate } from 'react-router-dom';
import CommunicationsDashboard from '@/components/admin/communications/CommunicationsDashboard';

const AdminCommunicationsDashboard: React.FC = () => {
  const { hasPermission, isReloading } = useUserRole();

  if (isReloading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('users.view')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <CommunicationsDashboard />;
};

export default AdminCommunicationsDashboard;
