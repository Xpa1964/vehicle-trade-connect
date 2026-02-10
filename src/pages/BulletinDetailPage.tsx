
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ContactPublisherDialog from '@/components/bulletin/ContactPublisherDialog';
import { useAnnouncementDetail } from '@/hooks/useAnnouncementDetail';

// Import refactored components
import AnnouncementHeader from '@/components/bulletin/detail/AnnouncementHeader';
import AnnouncementContent from '@/components/bulletin/detail/AnnouncementContent';
import AnnouncementActions from '@/components/bulletin/detail/AnnouncementActions';
import PrintHeader from '@/components/bulletin/detail/PrintHeader';
import PrintFooter from '@/components/bulletin/detail/PrintFooter';
import AnnouncementNotFound from '@/components/bulletin/detail/AnnouncementNotFound';
import PrintStyles from '@/components/bulletin/detail/PrintStyles';

const BulletinDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    announcement,
    isLoading,
    error,
    refetch,
    authorName,
    contactDialogOpen,
    setContactDialogOpen,
    handleDelete
  } = useAnnouncementDetail(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !announcement) {
    return <AnnouncementNotFound t={t} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95 print:bg-white">
      {/* Header with logo - visible on web */}
      <div className="print:hidden bg-card/50 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button 
                variant="ghost" 
                onClick={() => navigate('/bulletin')}
                className="flex items-center gap-2 hover:bg-accent/50"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('bulletin.backToBulletin', { fallback: 'Volver al Tablón' })}
              </Button>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-3 hidden sm:flex">
                <img 
                  src="/lovable-uploads/04f9dfe3-c94a-4610-8c2d-2bd0fc7136f0.png" 
                  alt="KONTACT Logo" 
                  className="h-8"
                />
                <div>
                  <span className="text-auto-gold font-black text-sm">KONTACT</span>
                  <span className="text-foreground font-bold text-sm ml-1">AUTOMOTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 print:p-0">
        <article className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg print:shadow-none print:border-none print:rounded-none overflow-hidden">
          <PrintHeader />
          
          <div id="printable-content" className="prose prose-lg max-w-none">
            <AnnouncementHeader 
              announcement={announcement} 
              authorName={authorName} 
              currentLanguage={currentLanguage} 
            />
            
            <AnnouncementContent 
              announcement={announcement} 
              currentLanguage={currentLanguage} 
            />
          </div>
          
          <AnnouncementActions 
            announcement={announcement}
            currentUserId={user?.id}
            onDelete={handleDelete}
            onContactPublisher={() => setContactDialogOpen(true)}
            onStatusUpdate={refetch}
            t={t}
          />

          <PrintFooter />
        </article>
      </div>
      
      <ContactPublisherDialog 
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        announcement={announcement}
      />

      <PrintStyles />
    </div>
  );
};

export default BulletinDetailPage;
