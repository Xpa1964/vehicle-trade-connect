import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { TransportFormHeader } from '@/components/transport';
import TransportRequestForm from '@/components/transport/TransportRequestForm';
import SafeImage from '@/components/shared/SafeImage';

const Transport: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen">
      {/* Custom Header with background image and semi-transparent mask */}
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8" style={{ minHeight: '320px' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <SafeImage 
            imageId="hero.transport"
            alt="Transport Background"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
        </div>
        
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Header content */}
        <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
          <div className="flex flex-col justify-between h-full">
            {/* Back button */}
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-fit" 
                onClick={() => navigate('/admin/control-panel')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.backToControlPanel', { fallback: 'Volver al Panel de Control' })}
              </Button>
            </div>
            
            {/* Title and description */}
            <div className="flex flex-col justify-end flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
                {t('transport.title')}
              </h1>
              <p className="text-lg text-white font-bold drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
                {t('transport.quote')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Card>
          <TransportFormHeader />
          <CardContent>
            <TransportRequestForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transport;
