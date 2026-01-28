
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, MessageSquare, Clock } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  recipientCount: number;
  estimatedTime?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  recipientCount,
  estimatedTime,
  isDestructive = false,
  isLoading = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDestructive ? (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            ) : (
              <MessageSquare className="h-5 w-5" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del envío */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Destinatarios
              </span>
              <Badge variant="secondary">
                {recipientCount}
              </Badge>
            </div>
            
            {estimatedTime && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tiempo estimado
                </span>
                <Badge variant="outline">
                  {estimatedTime}
                </Badge>
              </div>
            )}
          </div>

          {/* Advertencias para envíos masivos */}
          {recipientCount > 50 && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Envío masivo detectado</p>
                  <p className="text-yellow-700">
                    Este mensaje se enviará a {recipientCount} personas. Por favor, verifica que el contenido sea apropiado.
                  </p>
                </div>
              </div>
            </div>
          )}

          {recipientCount > 100 && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">Envío muy masivo</p>
                  <p className="text-red-700">
                    Este es un envío a gran escala. Se aplicarán límites de velocidad y el envío puede tomar varios minutos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={onConfirm}
              disabled={isLoading}
              variant={isDestructive ? "destructive" : "default"}
              className="flex-1"
            >
              {isLoading ? 'Procesando...' : 'Confirmar Envío'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
