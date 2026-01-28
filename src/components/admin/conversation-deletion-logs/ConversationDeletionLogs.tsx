import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Users, MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DeletionLog {
  id: string;
  user_id: string;
  action_type: string;
  entity_id: string;
  details: any;
  created_at: string;
  severity: string;
}

export function ConversationDeletionLogs() {
  const [selectedLog, setSelectedLog] = useState<DeletionLog | null>(null);

  const { data: deletionLogs, isLoading } = useQuery({
    queryKey: ['conversation-deletion-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .or('action_type.eq.conversation_deleted_by_seller,action_type.eq.conversation_deleted_by_buyer')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as DeletionLog[];
    }
  });

  const getDeletionBadgeColor = (actionType: string) => {
    return actionType.includes('seller') ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} minutos`;
    if (hours < 24) return `${Math.round(hours)} horas`;
    return `${Math.round(hours / 24)} días`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversaciones Eliminadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversaciones Eliminadas
        </CardTitle>
        <CardDescription>
          Registro de eliminaciones de conversaciones por usuarios. Total: {deletionLogs?.length || 0}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {deletionLogs?.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getDeletionBadgeColor(log.action_type)}>
                        {log.action_type.includes('seller') ? 'Vendedor' : 'Comprador'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{log.details?.message_count || 0} mensajes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(log.details?.conversation_age_hours || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Origen:</span>
                        <span className="font-medium">{log.details?.source_type || 'N/A'}</span>
                      </div>
                      {log.details?.was_pinned && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs">Fijada</span>
                        </div>
                      )}
                    </div>

                    {log.details?.source_title && (
                      <p className="text-sm text-muted-foreground truncate">
                        {log.details.source_title}
                      </p>
                    )}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedLog(log)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Detalles de Eliminación de Conversación</DialogTitle>
                        <DialogDescription>
                          Información completa del registro de eliminación
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-96">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">ID de Conversación</label>
                              <p className="text-sm text-muted-foreground font-mono">
                                {log.details?.conversation_id}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Eliminado por</label>
                              <p className="text-sm text-muted-foreground">
                                {log.details?.deleted_by_role === 'seller' ? 'Vendedor' : 'Comprador'}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Usuario ID</label>
                              <p className="text-sm text-muted-foreground font-mono">
                                {log.user_id}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Otro Participante</label>
                              <p className="text-sm text-muted-foreground font-mono">
                                {log.details?.other_participant_id || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium">Mensajes</label>
                              <p className="text-sm text-muted-foreground">
                                {log.details?.message_count || 0}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">No leídos</label>
                              <p className="text-sm text-muted-foreground">
                                {log.details?.unread_count || 0}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Estado</label>
                              <p className="text-sm text-muted-foreground">
                                {log.details?.conversation_status || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Tipo de Origen</label>
                            <p className="text-sm text-muted-foreground">
                              {log.details?.source_type || 'N/A'}
                            </p>
                          </div>

                          {log.details?.source_title && (
                            <div>
                              <label className="text-sm font-medium">Título de Origen</label>
                              <p className="text-sm text-muted-foreground">
                                {log.details.source_title}
                              </p>
                            </div>
                          )}

                          {log.details?.vehicle_id && (
                            <div>
                              <label className="text-sm font-medium">ID de Vehículo</label>
                              <p className="text-sm text-muted-foreground font-mono">
                                {log.details.vehicle_id}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Duración</label>
                              <p className="text-sm text-muted-foreground">
                                {formatDuration(log.details?.conversation_age_hours || 0)}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Fecha de Eliminación</label>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {log.details?.was_pinned && (
                              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                Conversación Fijada
                              </Badge>
                            )}
                            {log.details?.is_admin_conversation && (
                              <Badge variant="outline" className="text-purple-700 border-purple-300">
                                Conversación de Admin
                              </Badge>
                            )}
                            <Badge variant="outline" className={log.severity === 'warning' ? 'text-orange-700 border-orange-300' : ''}>
                              {log.severity}
                            </Badge>
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}

            {deletionLogs?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No se han encontrado eliminaciones de conversaciones</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}