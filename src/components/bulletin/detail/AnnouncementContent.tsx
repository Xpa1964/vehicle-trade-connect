
import React from 'react';
import { CardContent } from '@/components/ui/card';
import TranslatedContent from '@/components/translation/TranslatedContent';
import AttachmentDisplay from './AttachmentDisplay';
import { Announcement } from '@/types/announcement';
import { supabase } from '@/integrations/supabase/client';

interface AnnouncementContentProps {
  announcement: Announcement;
  currentLanguage: string;
}

const AnnouncementContent: React.FC<AnnouncementContentProps> = ({ 
  announcement, 
  currentLanguage 
}) => {
  const [currentUserId, setCurrentUserId] = React.useState<string | undefined>();

  React.useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id);
    };
    getCurrentUser();
  }, []);

  return (
    <CardContent className="prose prose-lg max-w-none px-8 py-8 space-y-8">
      {/* Content */}
      <div className="text-lg leading-relaxed">
        <TranslatedContent 
          originalText={announcement.content} 
          originalLanguage={announcement.original_language || "es"}
          targetLanguage={currentLanguage}
          className="whitespace-pre-wrap text-foreground/90 leading-relaxed" 
        />
      </div>
      
      {/* Separator */}
      <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto my-8"></div>
      
      {/* Attachments */}
      <AttachmentDisplay 
        announcement={announcement}
        currentUserId={currentUserId}
      />
    </CardContent>
  );
};

export default AnnouncementContent;
