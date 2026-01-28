import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import APIKeysList from '@/components/admin/api-management/APIKeysList';
import APIStats from '@/components/admin/api-management/APIStats';
import APIKeyRequestsList from '@/components/admin/api-management/APIKeyRequestsList';
import apiKeysImage from '@/assets/api-keys-image.png';

const APIManagement: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentRole } = useUserRole();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  const isAdmin = currentRole === 'admin' || 
                 currentRole === 'moderator' || 
                 currentRole === 'support';
                  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permiso para acceder a la gestión de APIs.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/admin/control-panel')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Panel de Control
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={apiKeysImage} 
              alt="API Keys" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('api.management.title')}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {t('api.management.subtitle')}
        </p>
      </div>

      <div className="space-y-8">
        <APIStats />
        <APIKeyRequestsList />
        <APIKeysList />
      </div>
    </div>
  );
};

export default APIManagement;
