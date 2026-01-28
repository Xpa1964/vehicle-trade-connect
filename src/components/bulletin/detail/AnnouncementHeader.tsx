import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Eye, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Announcement } from '@/types/announcement';
import TranslatedContent from '@/components/translation/TranslatedContent';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnnouncementHeaderProps {
  announcement: Announcement;
  authorName: string | null;
  currentLanguage: string;
}

const AnnouncementHeader: React.FC<AnnouncementHeaderProps> = ({
  announcement,
  authorName,
  currentLanguage
}) => {
  const { t } = useLanguage();

  const getStatusBadge = () => {
    const isActive = announcement.status === 'active';
    return (
      <Badge 
        variant={isActive ? 'default' : 'secondary'} 
        className="shrink-0 px-3 py-1 font-medium"
      >
        {isActive ? t('bulletin.statusActive', { fallback: 'Activo' }) : t('bulletin.statusFinished', { fallback: 'Finalizado' })}
      </Badge>
    );
  };

  const getTypeBadge = () => {
    const isOffer = announcement.type === 'offer';
    return (
      <Badge 
        variant={isOffer ? 'destructive' : 'outline'} 
        className="shrink-0 px-3 py-1 font-medium"
      >
        {isOffer ? t('bulletin.form.offer', { fallback: 'Oferta' }) : t('bulletin.form.search', { fallback: 'Búsqueda' })}
      </Badge>
    );
  };

  const getCategoryName = (category: string) => {
    const translationKey = `bulletin.${category}`;
    return t(translationKey, { fallback: category });
  };

  return (
    <CardHeader className="space-y-8 pb-8 border-b print:border-b-2 print:border-gray-300">
      {/* Featured badge */}
      {announcement.is_featured && (
        <div className="flex justify-center">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-4 py-2 text-sm">
            ⭐ DESTACADO
          </Badge>
        </div>
      )}
      
      {/* Title */}
      <div className="text-center space-y-4">
        <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
          <TranslatedContent 
            originalText={announcement.title} 
            originalLanguage={announcement.original_language || "es"}
            targetLanguage={currentLanguage}
          />
        </CardTitle>
      </div>
      
      {/* Badges row */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {getStatusBadge()}
        {getTypeBadge()}
        <Badge variant="outline" className="shrink-0 px-3 py-1 font-medium">
          <Tag className="h-3 w-3 mr-1" />
          {getCategoryName(announcement.category)}
        </Badge>
      </div>
      
      {/* Meta information */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground print:text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">{format(new Date(announcement.created_at), 'dd/MM/yyyy')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="font-medium">{authorName || 'Usuario Anónimo'}</span>
        </div>
        
        {announcement.view_count && announcement.view_count > 0 && (
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="font-medium">{announcement.view_count} visualizaciones</span>
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default AnnouncementHeader;
