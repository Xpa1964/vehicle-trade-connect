
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
  backTo?: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ 
  title, 
  showBackButton = true,
  backTo = '/dashboard'
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBack = () => {
    navigate(backTo);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('navigation.backToDashboard', { fallback: 'Volver al Panel' })}</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Header con imagen siguiendo el patrón de otras secciones */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16">
          <img
            src="/lovable-uploads/d93bbb12-c5de-496d-b1f2-58e47f8d6b39.png"
            alt="Messages"
            className="w-full h-full object-contain"
            onError={(e) => {
              console.log('Error loading header image:', e);
            }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-auto-blue">{title}</h1>
          <p className="text-muted-foreground mt-1">
            {t('messages.description', { fallback: 'Gestiona tus conversaciones y mensajes' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
