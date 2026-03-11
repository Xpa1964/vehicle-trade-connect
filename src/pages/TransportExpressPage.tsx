
import React from 'react';
import { ArrowLeft, ExternalLink, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { TransportHighlights } from '@/components/transport';
import SafeImage from '@/components/shared/SafeImage';

const CALCULATOR_URL = 'https://mover-pro-flow.lovable.app';

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

        {/* Calculadora de Transporte - Preview embebida */}
        <div className="mt-8 bg-card rounded-lg shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {t('transport.express.cta')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('transport.formDescription')}
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.open(CALCULATOR_URL, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {t('transport.express.cta')}
            </Button>
          </div>
          
          {/* Iframe preview - clickable */}
          <a
            href={CALCULATOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative group cursor-pointer"
          >
            <iframe
              src={CALCULATOR_URL}
              title="Transport Calculator"
              className="w-full h-[500px] border-0 pointer-events-none"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg">
                <ExternalLink className="h-5 w-5" />
                {t('transport.express.cta')}
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TransportExpressPage;
