
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, MessageCircle, Share2, BookOpen } from 'lucide-react';
import { Announcement } from '@/types/announcement';
import AnnouncementStatusSelector from './AnnouncementStatusSelector';
import DeleteButton from '@/components/shared/DeleteButton';

interface AnnouncementActionsProps {
  announcement: Announcement;
  currentUserId?: string;
  onDelete: () => Promise<void>;
  onContactPublisher: () => void;
  onStatusUpdate: () => void;
  t: (key: string, options?: any) => string;
}

const AnnouncementActions: React.FC<AnnouncementActionsProps> = ({
  announcement,
  currentUserId,
  onDelete,
  onContactPublisher,
  onStatusUpdate,
  t
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = announcement.title;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Revisa este anuncio en Kontact Automotive',
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      // You could show a toast here
    }
  };

  const isOwner = currentUserId && announcement.user_id === currentUserId;

  return (
    <CardFooter className="flex flex-col gap-6 bg-gradient-to-r from-muted/30 to-muted/20 print:hidden border-t">
      {/* Owner controls */}
      {isOwner && (
        <div className="flex flex-wrap gap-3 w-full">
          <AnnouncementStatusSelector
            announcementId={announcement.id}
            currentStatus={announcement.status}
            onStatusUpdate={onStatusUpdate}
            t={t}
          />
          <DeleteButton
            onDelete={onDelete}
            itemType="announcement"
            subtle={true}
          />
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center w-full">
        {/* Print button - more prominent */}
        <Button
          variant="default"
          size="lg"
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium px-6"
        >
          <Printer className="h-4 w-4" />
          {t('bulletin.print', { fallback: 'Imprimir Artículo' })}
        </Button>
        
        {/* Share button */}
        <Button
          variant="outline"
          size="lg"
          onClick={handleShare}
          className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 font-medium px-6"
        >
          <Share2 className="h-4 w-4" />
          {t('bulletin.share', { fallback: 'Compartir' })}
        </Button>
        
        {/* Contact publisher button */}
        {!isOwner && (
          <Button
            variant="default"
            size="lg"
            onClick={onContactPublisher}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium px-6"
          >
            <MessageCircle className="h-4 w-4" />
            {t('bulletin.contactPublisher', { fallback: 'Contactar Publicador' })}
          </Button>
        )}
      </div>
      
      {/* Blog-style separator */}
      <div className="flex items-center justify-center w-full mt-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <BookOpen className="h-4 w-4" />
          <span>{t('bulletin.publishedIn', { fallback: 'Artículo publicado en Kontact Automotive' })}</span>
        </div>
      </div>
    </CardFooter>
  );
};

export default AnnouncementActions;
