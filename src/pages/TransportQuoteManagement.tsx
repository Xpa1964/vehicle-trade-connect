
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import TransportQuotesList from '@/components/transport/TransportQuotesList';
import transportQuotesImage from '@/assets/transport-quotes-image.png';

const TransportQuoteManagement: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 max-w-full">
        {/* Header con imagen de fondo */}
        <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
          <div className="absolute inset-0">
            <img 
              src={transportQuotesImage}
              alt="Transport Quote Background"
              className="w-full h-full object-cover object-center"
              style={{ minHeight: '320px' }}
            />
          </div>
          
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
                    {t('transportQuotes.backToDashboard')}
                  </Button>
                </div>
                
                <div className="inline-block bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {t('transportQuotes.title')}
                  </h1>
                  <p className="text-lg text-white font-bold">
                    {t('transportQuotes.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{t('transportQuotes.title')}</h2>
          <p className="text-gray-600 mb-6">
            {t('transportQuotes.description')}
          </p>
          
          {/* Enhanced Quote Management Interface */}
          <TransportQuotesList />
        </div>
      </div>
    </div>
  );
};

export default TransportQuoteManagement;
