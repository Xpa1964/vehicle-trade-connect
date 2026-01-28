
import React from 'react';
import { User, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Conversation } from '@/types/conversation';
import { useNavigate } from 'react-router-dom';

interface ConversationHeaderProps {
  conversation: Conversation;
  getSourceTitle: (conversation: Conversation) => string;
  currentUserId: string;
  t: (key: string, options?: Record<string, string | number | undefined>) => string;
  sourceLink: string | null;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  getSourceTitle,
  currentUserId,
  t,
  sourceLink
}) => {
  const navigate = useNavigate();
  
  const handleViewItem = () => {
    if (sourceLink) {
      // Use navigate instead of window.location to prevent full page reload
      console.log("Navigating to source link:", sourceLink);
      navigate(sourceLink);
    }
  };

  return (
    <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            {conversation.vehicle_info?.thumbnailurl ? (
              <AvatarImage src={conversation.vehicle_info.thumbnailurl} alt="Vehicle" />
            ) : (
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-medium text-foreground line-clamp-1">
              {getSourceTitle(conversation)}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentUserId === conversation.buyer_id ? 
                t('messages.talkingToSeller', {}) : 
                t('messages.talkingToBuyer', {})}
            </p>
          </div>
        </div>
        
        {sourceLink && (
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center space-x-1"
            onClick={handleViewItem}
          >
            <span>{t('messages.viewItem', {})}</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConversationHeader;
