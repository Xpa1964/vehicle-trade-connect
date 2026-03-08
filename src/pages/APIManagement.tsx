import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import APIDocumentation from '@/components/dashboard/APIDocumentation';
import APIIntegrationSection from '@/components/dashboard/APIIntegrationSection';
import APISyncStatusBanner from '@/components/dashboard/APISyncStatusBanner';
import apiKeysImage from '@/assets/api-keys-image.png';

const APIManagement: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden rounded-none sm:rounded-xl shadow-lg mx-0 sm:mx-4 mt-0 sm:mt-4">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-no-repeat"
            style={{ 
              minHeight: '280px',
              backgroundImage: `url(${apiKeysImage})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover'
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8" style={{ minHeight: '280px' }}>
          <div className="flex flex-col justify-between h-full">
            {/* Botón Volver al Panel de Control */}
            <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-fit" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2 text-white" />
              {t('navigation.backToDashboard', { fallback: 'Volver al Dashboard' })}
            </Button>
            </div>
            
            {/* Logo + Title */}
            <div className="flex-1 flex flex-col justify-end space-y-3">
              <div className="w-full">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight break-words drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
                  {t('api.management.title')}
                </h1>
              </div>
              
              {/* Description */}
              <div className="w-full mt-3">
                <p className="text-sm sm:text-base md:text-lg text-white font-medium leading-relaxed break-words drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
                  {t('api.management.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
          <div className="space-y-8">
            <APIDocumentation />
            <APIIntegrationSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIManagement;
