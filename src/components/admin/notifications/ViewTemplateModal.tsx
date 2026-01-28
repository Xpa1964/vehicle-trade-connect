import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationTemplate } from '@/services/notifications/notificationTemplates';
import { Users, Clock, Bell, AlertCircle, Mail } from 'lucide-react';

interface ViewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: NotificationTemplate | null;
}

export const ViewTemplateModal: React.FC<ViewTemplateModalProps> = ({
  isOpen,
  onClose,
  template
}) => {
  if (!template) return null;

  const getTypeIcon = (type: string) => {
    const icons = {
      welcome: <Users className="h-4 w-4" />,
      reminder: <Clock className="h-4 w-4" />,
      promotion: <Bell className="h-4 w-4" />,
      system_update: <AlertCircle className="h-4 w-4" />,
      general: <Mail className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || icons.general;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(template.type)}
            {template.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{template.type}</Badge>
            <Badge variant={template.is_active ? 'default' : 'secondary'}>
              {template.is_active ? 'active' : 'inactive'}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Asunto</label>
              <p className="text-sm bg-muted p-3 rounded-md">{template.subject}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Contenido</label>
              <ScrollArea className="h-32">
                <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                  {template.content}
                </div>
              </ScrollArea>
            </div>

            {template.variables && template.variables.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Variables disponibles</label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.variables.map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {`{${variable}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Creado: {new Date(template.created_at).toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};