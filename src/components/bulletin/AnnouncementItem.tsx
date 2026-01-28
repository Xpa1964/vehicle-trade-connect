
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Briefcase, Search, Car, Wrench, MessageCircle, Star, Eye, Paperclip, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TranslatedContent from '@/components/translation/TranslatedContent';
import DeleteButton from '@/components/shared/DeleteButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Announcement } from '@/types/announcement';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AnnouncementItemProps {
  announcement: Announcement;
  currentUserId?: string | null;
  onDelete: (id: string) => Promise<void>;
}

const AnnouncementItem: React.FC<AnnouncementItemProps> = ({ 
  announcement, 
  currentUserId, 
  onDelete 
}) => {
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { startConversation } = useConversations();
  const [isStartingConversation, setIsStartingConversation] = useState(false);

  // Don't allow users to message themselves
  const canMessage = user && announcement.user_id && announcement.user_id !== user.id;

  const handleStartConversation = async () => {
    if (!user) {
      toast.error(t('auth.loginRequired'));
      return;
    }

    if (!announcement.user_id) {
      toast.error(t('bulletin.noPublisherError'));
      return;
    }

    try {
      setIsStartingConversation(true);
      const conversation = await startConversation(
        announcement.user_id, 
        null,
        {
          sourceType: 'announcement',
          sourceId: announcement.id,
          sourceTitle: announcement.title
        }
      );

      if (conversation) {
        toast.success(t('messages.conversationStarted'));
        window.location.href = `/messages?conversation=${conversation.id}`;
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error(t('common.error'));
    } finally {
      setIsStartingConversation(false);
    }
  };

  const handleViewCountIncrement = async () => {
    try {
      await supabase
        .from('announcements')
        .update({ 
          view_count: (announcement.view_count || 0) + 1 
        } as any)
        .eq('id', announcement.id);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleDownloadFile = () => {
    if (announcement.attachment_url) {
      window.open(announcement.attachment_url, '_blank');
    }
  };

  const getCategoryIcon = () => {
    switch(announcement.category) {
      case 'business_opportunities':
        return <Briefcase className="h-3 w-3 mr-1" />;
      case 'vehicle_search':
        return <Search className="h-3 w-3 mr-1" />;
      case 'available_vehicles':
        return <Car className="h-3 w-3 mr-1" />;
      case 'professional_services':
        return <Wrench className="h-3 w-3 mr-1" />;
      default:
        return <Briefcase className="h-3 w-3 mr-1" />;
    }
  };

  const getCategoryColor = () => {
    switch(announcement.category) {
      case 'business_opportunities':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'vehicle_search':
        return 'bg-green-50 text-green-700 border border-green-100';
      case 'available_vehicles':
        return 'bg-red-50 text-red-700 border border-red-100';
      case 'professional_services':
        return 'bg-purple-50 text-purple-700 border border-purple-100';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
  };

  const getCategoryName = () => {
    return t(`bulletin.${announcement.category}`) || announcement.category;
  };

  const isFeatured = announcement.is_featured && 
    announcement.featured_until && 
    new Date(announcement.featured_until) > new Date();

  return (
    <div className={`grid grid-cols-12 gap-2 p-3 hover:bg-gray-50 border-b last:border-b-0 items-center ${
      isFeatured ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''
    }`}>
      {/* Category */}
      <div className="col-span-1 flex justify-center">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-xs px-2 py-1 rounded-full flex items-center ${getCategoryColor()}`}>
            {getCategoryIcon()}
            <span className="hidden sm:inline">{getCategoryName()}</span>
          </span>
          {isFeatured && (
            <Badge variant="default" className="bg-yellow-500 text-white">
              <Star className="h-2 w-2 mr-1" />
              <span className="text-xs">Premium</span>
            </Badge>
          )}
        </div>
      </div>
      
      {/* Title with truncated content */}
      <div className="col-span-6 pr-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium truncate">
            <TranslatedContent 
              originalText={announcement.title} 
              originalLanguage={announcement.original_language || "es"} 
              targetLanguage={currentLanguage}
            />
          </h3>
          {announcement.attachment_url && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDownloadFile}
              title={`${t('bulletin.downloadFile')}: ${announcement.attachment_name}`}
            >
              <Paperclip className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500 line-clamp-1">
          <TranslatedContent 
            originalText={announcement.content} 
            originalLanguage={announcement.original_language || "es"} 
            targetLanguage={currentLanguage}
          />
        </p>
        {announcement.view_count !== undefined && announcement.view_count > 0 && (
          <div className="flex items-center mt-1">
            <Eye className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-xs text-gray-400">{announcement.view_count} {t('bulletin.views')}</span>
          </div>
        )}
      </div>
      
      {/* Date */}
      <div className="col-span-2 text-xs text-gray-500 flex items-center">
        <CalendarIcon className="h-3 w-3 mr-1" />
        {new Date(announcement.created_at).toLocaleDateString()}
      </div>
      
      {/* Status */}
      <div className="col-span-1">
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          announcement.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-600 border border-gray-100'
        }`}>
          {announcement.status === 'active' ? t('bulletin.statusActive') : t('bulletin.statusFinished')}
        </span>
      </div>
      
      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-2 items-center">
        {canMessage && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3 py-1 text-xs flex items-center" 
            onClick={handleStartConversation}
            disabled={isStartingConversation}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            {t('messages.contact')}
          </Button>
        )}

        <Link to={`/bulletin/${announcement.id}`} onClick={handleViewCountIncrement}>
          <Button variant="outline" size="sm" className="h-8 px-3 py-1 text-xs">
            {t('bulletin.readMore')}
          </Button>
        </Link>
        
        {currentUserId === announcement.user_id && (
          <DeleteButton
            onDelete={() => onDelete(announcement.id)}
            itemType={t('bulletin.announcement')}
            subtle={true}
          />
        )}
      </div>
    </div>
  );
};

export default AnnouncementItem;
