
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ExchangeRequestForm } from '@/components/exchanges/ExchangeRequestForm';
import SafeImage from '@/components/shared/SafeImage';

const ExchangeForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-6 mx-4 mt-4">
        <div className="absolute inset-0">
          <SafeImage 
            imageId="hero.exchange.form"
            alt="Intercambio de Vehículos"
            className="w-full h-full object-cover object-center"
            style={{ minHeight: '320px' }}
          />
        </div>
        
        <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
          <div className="flex flex-col justify-between h-full">
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('navigation.backToControlPanel')}
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col justify-end">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {t('exchanges.requestExchange')}
                </h1>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit mt-3">
                <p className="text-lg text-white font-bold">
                  {t('exchanges.formDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="container mx-auto p-6 max-w-4xl">
        <ExchangeRequestForm />
      </div>
    </div>
  );
};

export default ExchangeForm;
