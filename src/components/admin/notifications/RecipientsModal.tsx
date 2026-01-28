import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Building, 
  MapPin,
  Download
} from 'lucide-react';
import { NotificationRecipient, recipientTrackingService } from '@/services/notifications/recipientTracking';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RecipientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationId: string;
  notificationSubject: string;
}

export const RecipientsModal: React.FC<RecipientsModalProps> = ({
  isOpen,
  onClose,
  notificationId,
  notificationSubject
}) => {
  const [recipients, setRecipients] = useState<NotificationRecipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');

  useEffect(() => {
    if (isOpen && notificationId) {
      loadRecipients();
    }
  }, [isOpen, notificationId]);

  const loadRecipients = async () => {
    setLoading(true);
    try {
      const data = await recipientTrackingService.getNotificationRecipients(notificationId);
      setRecipients(data);
    } catch (error) {
      console.error('Error loading recipients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipients = recipients.filter(recipient => {
    if (filter === 'all') return true;
    return recipient.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs";
    switch (status) {
      case 'sent':
        return <Badge variant="default" className={`${baseClasses} bg-success/10 text-success border-success/20`}>Enviado</Badge>;
      case 'failed':
        return <Badge variant="destructive" className={baseClasses}>Fallido</Badge>;
      case 'pending':
        return <Badge variant="secondary" className={`${baseClasses} bg-warning/10 text-warning border-warning/20`}>Pendiente</Badge>;
      default:
        return <Badge variant="outline" className={baseClasses}>Desconocido</Badge>;
    }
  };

  const exportRecipients = () => {
    const csvContent = [
      ['Nombre', 'Email', 'Empresa', 'País', 'Estado', 'Fecha de Envío', 'Error'].join(','),
      ...filteredRecipients.map(recipient => [
        recipient.name,
        recipient.email,
        recipient.user_profile?.company || '',
        recipient.user_profile?.country || '',
        recipient.status === 'sent' ? 'Enviado' : recipient.status === 'failed' ? 'Fallido' : 'Pendiente',
        recipient.sent_at ? format(new Date(recipient.sent_at), 'dd/MM/yyyy HH:mm', { locale: es }) : '',
        recipient.error_message || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `destinatarios_${notificationSubject.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = recipients.reduce((acc, recipient) => {
    acc.total++;
    acc[recipient.status]++;
    return acc;
  }, { total: 0, sent: 0, failed: 0, pending: 0 });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Destinatarios: {notificationSubject}
          </DialogTitle>
        </DialogHeader>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{stats.sent}</div>
            <div className="text-sm text-muted-foreground">Enviados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
            <div className="text-sm text-muted-foreground">Fallidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </div>
        </div>

        {/* Filter and Export */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {(['all', 'sent', 'failed', 'pending'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                className="text-xs"
              >
                {status === 'all' ? 'Todos' : 
                 status === 'sent' ? 'Enviados' : 
                 status === 'failed' ? 'Fallidos' : 'Pendientes'}
                <span className="ml-1 px-1.5 py-0.5 bg-background/20 rounded text-xs">
                  {status === 'all' ? stats.total : stats[status]}
                </span>
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={exportRecipients}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        <Separator />

        {/* Recipients List */}
        <ScrollArea className="h-96">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-muted-foreground">Cargando destinatarios...</div>
            </div>
          ) : filteredRecipients.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-muted-foreground">No se encontraron destinatarios</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(recipient.status)}
                        <div>
                          <h4 className="font-medium text-foreground">
                            {recipient.user_profile?.full_name || recipient.name}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {recipient.email}
                          </div>
                        </div>
                        {getStatusBadge(recipient.status)}
                      </div>
                      
                      {recipient.user_profile && (
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                          {recipient.user_profile.company && (
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {recipient.user_profile.company}
                            </div>
                          )}
                          {recipient.user_profile.country && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {recipient.user_profile.country}
                            </div>
                          )}
                          <div className={`px-2 py-1 rounded text-xs ${
                            recipient.user_profile.is_active 
                              ? 'bg-success/10 text-success' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {recipient.user_profile.is_active ? 'Activo' : 'Inactivo'}
                          </div>
                        </div>
                      )}
                      
                      {recipient.sent_at && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Enviado: {format(new Date(recipient.sent_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </div>
                      )}
                      
                      {recipient.error_message && (
                        <div className="text-xs text-destructive mt-2 p-2 bg-destructive/5 rounded">
                          Error: {recipient.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};