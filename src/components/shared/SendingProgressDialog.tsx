
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { messagingQueue, QueueStatus } from '@/services/messaging/messagingQueue';

interface SendingProgressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messageId?: string;
  recipientCount: number;
}

const SendingProgressDialog: React.FC<SendingProgressDialogProps> = ({
  isOpen,
  onClose,
  messageId,
  recipientCount
}) => {
  const [queueStatus, setQueueStatus] = useState<QueueStatus>({ pending: 0, processing: 0, completed: 0, failed: 0 });
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const status = messagingQueue.getQueueStatus();
      setQueueStatus(status);
      
      const total = status.pending + status.processing + status.completed + status.failed;
      if (total > 0) {
        const completedProgress = ((status.completed + status.failed) / total) * 100;
        setProgress(completedProgress);
        
        // Marcar como completado cuando no hay mensajes pendientes o en proceso
        if (status.pending === 0 && status.processing === 0) {
          setIsCompleted(true);
          setCanClose(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const getStatusIcon = (type: keyof QueueStatus) => {
    switch (type) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusLabel = (type: keyof QueueStatus) => {
    switch (type) {
      case 'completed':
        return 'Completados';
      case 'failed':
        return 'Fallidos';
      case 'processing':
        return 'Enviando';
      case 'pending':
        return 'Pendientes';
    }
  };

  const getStatusColor = (type: keyof QueueStatus) => {
    switch (type) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={canClose ? onClose : undefined}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
            {isCompleted ? 'Envío Completado' : 'Enviando Mensajes'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barra de progreso */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progreso del envío</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Estadísticas */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(queueStatus) as Array<keyof QueueStatus>).map((status) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="text-sm">{getStatusLabel(status)}</span>
                    </div>
                    <Badge variant="outline" className={getStatusColor(status)}>
                      {queueStatus[status]}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mensaje de estado */}
          {isCompleted ? (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">¡Envío completado!</span>
              </div>
              <p className="text-sm text-gray-600">
                {queueStatus.completed > 0 && (
                  <span className="text-green-600">{queueStatus.completed} mensajes enviados exitosamente. </span>
                )}
                {queueStatus.failed > 0 && (
                  <span className="text-red-600">{queueStatus.failed} mensajes fallaron.</span>
                )}
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Enviando mensajes a {recipientCount} destinatarios...</span>
              </div>
              {queueStatus.failed > 0 && (
                <div className="flex items-center justify-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">Algunos mensajes están siendo reintentados</span>
                </div>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2">
            {isCompleted ? (
              <Button onClick={onClose} className="w-full">
                Cerrar
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  disabled={!canClose}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (messageId) {
                      messagingQueue.cancelMessage(messageId);
                    }
                  }}
                  className="flex-1"
                  disabled={isCompleted}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendingProgressDialog;
