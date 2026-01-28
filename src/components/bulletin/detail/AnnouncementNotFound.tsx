
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AnnouncementNotFoundProps {
  t: (key: string, params?: Record<string, string | number | undefined>) => string;
}

const AnnouncementNotFound: React.FC<AnnouncementNotFoundProps> = ({ t }) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 text-center">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/bulletin')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('bulletin.backToBulletin')}
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">{t('bulletin.announcementNotFound')}</h1>
      <p className="text-muted-foreground">{t('bulletin.announcementNotFoundDescription')}</p>
    </div>
  );
};

export default AnnouncementNotFound;
