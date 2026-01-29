
import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import AnnouncementItem from './AnnouncementItem';
import { Announcement } from '@/types/announcement';

interface AnnouncementListProps {
  announcements: Announcement[];
  isLoading: boolean;
  error: unknown;
  onDeleteAnnouncement: (id: string) => Promise<void>;
  currentUserId?: string | null;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({ 
  announcements, 
  isLoading, 
  error, 
  onDeleteAnnouncement,
  currentUserId
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>{t('common.error')}</p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t('bulletin.noAnnouncements')}</h3>
        <p className="text-muted-foreground mb-6">{t('bulletin.createFirst')}</p>
        <Link to="/publish-announcement">
          <Button className="bg-primary hover:bg-primary/90">
            {t('bulletin.form.submit')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1 border border-border rounded-lg overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-12 gap-2 bg-secondary p-4 border-b border-border font-medium text-sm text-muted-foreground">
        <div className="col-span-1 text-center">{t('bulletin.type')}</div>
        <div className="col-span-6">{t('bulletin.titleColumn')}</div>
        <div className="col-span-2">{t('bulletin.dateColumn')}</div>
        <div className="col-span-1">{t('bulletin.stateColumn')}</div>
        <div className="col-span-2 text-right">{t('bulletin.actionsColumn')}</div>
      </div>
      
      {/* Announcement rows */}
      {announcements.map(announcement => (
        <AnnouncementItem 
          key={announcement.id}
          announcement={announcement}
          currentUserId={currentUserId}
          onDelete={onDeleteAnnouncement}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;
