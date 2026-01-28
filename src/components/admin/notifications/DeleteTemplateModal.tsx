import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { NotificationTemplate, notificationTemplateService } from '@/services/notifications/notificationTemplates';
import { Trash2, X, AlertTriangle } from 'lucide-react';

interface DeleteTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: NotificationTemplate | null;
  onSuccess: () => void;
}

export const DeleteTemplateModal: React.FC<DeleteTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!template) return;

    setIsLoading(true);
    try {
      await notificationTemplateService.deleteTemplate(template.id);

      toast({
        title: 'Éxito',
        description: 'Plantilla eliminada correctamente'
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar la plantilla',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Plantilla
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. La plantilla será eliminada permanentemente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium">{template.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {template.subject}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            <Trash2 className="h-4 w-4 mr-2" />
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};