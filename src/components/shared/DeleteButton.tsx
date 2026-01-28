
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface DeleteButtonProps {
  onDelete: () => Promise<void>;
  itemType: string;
  showIcon?: boolean;
  subtle?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  onDelete, 
  itemType, 
  showIcon = true,
  subtle = false 
}) => {
  const { t } = useLanguage();
  
  const handleDelete = async () => {
    try {
      await onDelete();
      toast.success(t('common.deleteSuccess', { item: itemType }));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t('common.deleteError'));
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {subtle ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full w-8 h-8 flex items-center justify-center p-0 z-10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t('common.delete')}</span>
          </Button>
        ) : (
          <Button variant="destructive" size="sm">
            {showIcon && <Trash2 className="h-4 w-4 mr-2" />}
            {t('common.delete')}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('common.deleteWarning', { item: itemType })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
