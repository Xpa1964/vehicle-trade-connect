
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LOGO_IMAGES } from '@/constants/imageAssets';
import {
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RegisterHeader: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/login');
  };

  return (
    <CardHeader className="space-y-1">
      <Button 
        variant="ghost" 
        className="mb-4 -ml-4 text-gray-600 hover:text-gray-900"
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('auth.register.back')}
      </Button>
      
      {/* KONTACT VO Logo */}
      <div className="flex justify-center mb-6">
        <img 
          src={LOGO_IMAGES.primaryPNG} 
          alt="KONTACT VO Logo" 
          className="h-24 w-auto drop-shadow-sm"
          loading="eager"
          fetchPriority="high"
          onError={(e) => {
            console.log('Error loading primary logo, trying fallback');
            e.currentTarget.src = LOGO_IMAGES.fallbacks[0];
            e.currentTarget.onerror = () => {
              console.log('Error loading fallback logo, using text fallback');
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'text-2xl font-bold text-primary';
              fallback.textContent = 'KONTACT VO';
              e.currentTarget.parentNode?.appendChild(fallback);
            };
          }}
        />
      </div>
      
      <CardTitle className="text-2xl font-bold text-center">
        {t('auth.register')}
      </CardTitle>
      <CardDescription className="text-center">
        <p>
          {t('auth.register.completeInfo')}
        </p>
      </CardDescription>
    </CardHeader>
  );
};

export default RegisterHeader;
