
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CommissionCalculator from '@/components/commission/CommissionCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import SafeImage from '@/components/shared/SafeImage';

const CommissionCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con imagen de fondo estilo consistente */}
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
        {/* Background usando la imagen de calculadora y dinero - SIN FILTROS */}
        <div className="absolute inset-0">
          <SafeImage 
            imageId="hero.commission.calculator"
            alt="Commission Calculator Background"
            className="w-full h-full object-cover object-center"
            style={{ minHeight: '320px' }}
          />
        </div>
        
        {/* Content - SIN OVERLAY OSCURO */}
        <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 h-full">
            <div className="flex flex-col justify-end flex-1 h-full">
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Panel de Control
                </Button>
              </div>
              
              {/* Title text - TODO EN NEGRITA Y TRANSPARENTE */}
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <span className="font-bold">{t('commission.title')}</span>
                </h1>
              </div>
              
              {/* Description text - SOLO LIGERO FONDO PARA ESTE TEXTO */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-lg text-white font-bold">
                  {t('commission.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <CommissionCalculator showTitle={false} />
      </div>
    </div>
  );
};

export default CommissionCalculatorPage;
