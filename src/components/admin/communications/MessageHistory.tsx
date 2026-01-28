
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Download, 
  Eye, 
  Calendar,
  Users,
  Send,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { auditLogger, MessageAuditEntry } from '@/services/messaging/auditLogger';

const MessageHistory: React.FC = () => {
  const [messages, setMessages] = useState<MessageAuditEntry[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<MessageAuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<MessageAuditEntry | null>(null);

  useEffect(() => {
    loadMessageHistory();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter]);

  const loadMessageHistory = () => {
    const auditTrail = auditLogger.getAuditTrail();
    setMessages(auditTrail);
  };

  const filterMessages = () => {
    let filtered = messages;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(message => 
        message.messageId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.templateId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.action === statusFilter);
    }

    setFilteredMessages(filtered);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'bulk_send':
        return <Send className="h-4 w-4 text-blue-600" />;
      case 'template_used':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rate_limit_hit':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'queue_added':
        return <Clock className="h-4 w-4 text-purple-600" />;
      case 'send_failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Send className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'bulk_send':
        return 'Mensaje Enviado';
      case 'template_used':
        return 'Plantilla Usada';
      case 'rate_limit_hit':
        return 'Límite Alcanzado';
      case 'queue_added':
        return 'En Cola';
      case 'send_failed':
        return 'Error de Envío';
      default:
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'bulk_send':
        return 'default';
      case 'template_used':
        return 'secondary';
      case 'rate_limit_hit':
        return 'destructive';
      case 'queue_added':
        return 'outline';
      case 'send_failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const exportHistory = () => {
    const csvData = filteredMessages.map(message => ({
      'ID': message.id,
      'Usuario': message.userId.substring(0, 8) + '...',
      'Acción': getActionLabel(message.action),
      'Destinatarios': message.recipientCount || 'N/A',
      'Fecha': new Date(message.timestamp).toLocaleString(),
      'Error': message.errorMessage || 'N/A'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial-mensajes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Mensajes Masivos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por ID de mensaje, plantilla o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por acción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                <SelectItem value="bulk_send">Mensajes enviados</SelectItem>
                <SelectItem value="template_used">Plantillas usadas</SelectItem>
                <SelectItem value="rate_limit_hit">Límites alcanzados</SelectItem>
                <SelectItem value="queue_added">En cola</SelectItem>
                <SelectItem value="send_failed">Errores</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportHistory} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredMessages.filter(m => m.action === 'bulk_send').length}
              </div>
              <div className="text-sm text-gray-600">Mensajes Enviados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredMessages.filter(m => m.action === 'template_used').length}
              </div>
              <div className="text-sm text-gray-600">Plantillas Usadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredMessages.filter(m => m.action === 'rate_limit_hit').length}
              </div>
              <div className="text-sm text-gray-600">Límites Alcanzados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredMessages.filter(m => m.action === 'send_failed').length}
              </div>
              <div className="text-sm text-gray-600">Errores</div>
            </div>
          </div>

          {/* Tabla de mensajes */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Acción</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Destinatarios</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron mensajes con los filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(message.action)}
                          <span className="font-medium">{getActionLabel(message.action)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {message.userId.substring(0, 8)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        {message.recipientCount ? (
                          <Badge variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            {message.recipientCount}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(message.action)}>
                          {message.errorMessage ? 'Error' : 'Exitoso'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedMessage(message)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles del Mensaje</DialogTitle>
                            </DialogHeader>
                            {selectedMessage && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">ID del Mensaje</label>
                                    <p className="text-sm text-gray-600 font-mono">
                                      {selectedMessage.id}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Usuario</label>
                                    <p className="text-sm text-gray-600 font-mono">
                                      {selectedMessage.userId}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Acción</label>
                                    <p className="text-sm text-gray-600">
                                      {getActionLabel(selectedMessage.action)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Fecha</label>
                                    <p className="text-sm text-gray-600">
                                      {new Date(selectedMessage.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                
                                {selectedMessage.recipientCount && (
                                  <div>
                                    <label className="text-sm font-medium">Destinatarios</label>
                                    <p className="text-sm text-gray-600">
                                      {selectedMessage.recipientCount} usuarios
                                    </p>
                                  </div>
                                )}
                                
                                {selectedMessage.templateId && (
                                  <div>
                                    <label className="text-sm font-medium">Plantilla Utilizada</label>
                                    <p className="text-sm text-gray-600 font-mono">
                                      {selectedMessage.templateId}
                                    </p>
                                  </div>
                                )}
                                
                                {selectedMessage.errorMessage && (
                                  <div>
                                    <label className="text-sm font-medium">Error</label>
                                    <p className="text-sm text-red-600">
                                      {selectedMessage.errorMessage}
                                    </p>
                                  </div>
                                )}
                                
                                {selectedMessage.metadata && (
                                  <div>
                                    <label className="text-sm font-medium">Metadatos</label>
                                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                                      {JSON.stringify(selectedMessage.metadata, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageHistory;
