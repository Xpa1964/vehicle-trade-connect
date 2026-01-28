import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PerformanceDashboard from '@/components/admin/performance/PerformanceDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PerformanceMonitoring: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Redirect if user is not authenticated or not admin
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/admin/control-panel')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Panel de Control
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('performance.title')}</h1>
          <p className="text-muted-foreground">{t('performance.subtitle')}</p>
        </div>
      </div>
      <PerformanceDashboard />
    </div>
  );
};

export default PerformanceMonitoring;