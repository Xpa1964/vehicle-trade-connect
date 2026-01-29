import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import ReportPaymentsManager from '@/components/admin/report-payments/ReportPaymentsManager';
import { Button } from '@/components/ui/button';

const ReportPaymentsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentRole } = useUserRole();
  const navigate = useNavigate();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  const isAdmin = currentRole === 'admin' || 
                 currentRole === 'analyst';
                  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permiso para acceder a la gestión de pagos.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/admin/control-panel')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Panel de Control
      </Button>
      <ReportPaymentsManager />
    </AdminLayout>
  );
};

export default ReportPaymentsPage;
