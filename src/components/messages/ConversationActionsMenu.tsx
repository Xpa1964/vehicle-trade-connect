import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pin, PinOff, Trash2 } from 'lucide-react';
import { Conversation } from '@/types/conversation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConversationActionsMenuProps {
  conversation: Conversation;
  onTogglePin: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  t: (key: string, params?: any) => string;
}

const ConversationActionsMenu: React.FC<ConversationActionsMenuProps> = ({
  conversation,
  onTogglePin,
  onDelete,
  t
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleTogglePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTogglePin(conversation.id);
    setIsOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(conversation.id);
    setShowDeleteDialog(false);
  };

  return (
    <div className="relative">
      <Button 
        ref={buttonRef}
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 hover:bg-muted border border-transparent hover:border-border relative z-[1000] bg-white/80 hover:bg-white"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">{t('messages.conversationOptions')}</span>
      </Button>

      {isOpen && (
        <div
          className="absolute top-8 left-0 z-[999999] min-w-40 bg-white border border-gray-200 rounded-md shadow-2xl py-1"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            zIndex: 999999,
          }}
        >
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center"
            onClick={handleTogglePin}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {conversation.is_pinned ? (
              <>
                <PinOff className="h-4 w-4 mr-2" />
                {t('messages.unpin', {})}
              </>
            ) : (
              <>
                <Pin className="h-4 w-4 mr-2" />
                {t('messages.pin', {})}
              </>
            )}
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center text-red-600"
            onClick={handleDeleteClick}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('messages.delete', {})}
          </button>
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('messages.deleteConversation')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('messages.deleteConversationConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConversationActionsMenu;
