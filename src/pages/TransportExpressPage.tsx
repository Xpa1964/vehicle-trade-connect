
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { TransportHighlights } from '@/components/transport';
import SafeImage from '@/components/shared/SafeImage';

const TransportExpressPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 max-w-full">
        {/* Header con imagen de fondo */}
        <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
          <div className="absolute inset-0">
            <SafeImage 
              imageId="hero.transport.express"
              alt="Transport Express Background"
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
                    {t('navigation.backToControlPanel')}
                  </Button>
                </div>
                
                <div className="flex-1 flex flex-col justify-end space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {t('transport.express.title')}
                  </h1>
                  <p className="text-lg text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {t('transport.express.subtitle')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed mb-4">
              {t('transport.express.intro')}
            </p>

            <p className="text-foreground leading-relaxed mb-6">
              {t('transport.express.description')}
            </p>

            <TransportHighlights />

            <p className="text-foreground leading-relaxed mb-6">
              {t('transport.express.idealFor')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportExpressPage;
