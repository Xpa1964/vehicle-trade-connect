import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import messagesImage from '@/assets/messages-image.png';

const DashboardMessaging: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <Card className="border-2 border-primary/30 shadow-lg bg-gradient-to-br from-card to-secondary h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/80"></div>
      <CardHeader className="pb-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <img 
              src={messagesImage} 
              alt="Messages" 
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground uppercase tracking-wide">
            {t('messages.title')}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          {t('dashboard.messagesDescription')}
        </p>
        
        <div className="pt-2">
          <Button 
            onClick={() => navigate('/messages')}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t('messages.title')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMessaging;
