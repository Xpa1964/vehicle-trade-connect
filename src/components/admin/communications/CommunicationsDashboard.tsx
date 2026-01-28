
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Send, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Download,
  RefreshCcw
} from 'lucide-react';
import { auditLogger } from '@/services/messaging/auditLogger';
import { messagingQueue } from '@/services/messaging/messagingQueue';
import { rateLimiter } from '@/services/messaging/rateLimiter';
import MessagingMetrics from './MessagingMetrics';
import MessageHistory from './MessageHistory';
import PerformanceAnalytics from './PerformanceAnalytics';

const CommunicationsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalRecipients: 0,
    successRate: 0,
    averageDeliveryTime: 0
  });
  const [queueStatus, setQueueStatus] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0
  });

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Obtener estadísticas de auditoría
      const auditStats = auditLogger.getAuditStats();
      setStats({
        totalMessages: auditStats.totalMessages,
        totalRecipients: auditStats.totalRecipients,
        successRate: auditStats.totalMessages > 0 
          ? ((auditStats.totalMessages - auditStats.failures) / auditStats.totalMessages) * 100 
          : 0,
        averageDeliveryTime: 2.3 // Simulado - en producción vendría de métricas reales
      });

      // Obtener estado de la cola
      const currentQueueStatus = messagingQueue.getQueueStatus();
      setQueueStatus(currentQueueStatus);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Comunicaciones</h1>
          <p className="text-gray-600">Monitoreo y análisis del sistema de mensajería masiva</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensajes Enviados</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Total de mensajes masivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destinatarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecipients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios alcanzados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Mensajes entregados exitosamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDeliveryTime}s</div>
            <p className="text-xs text-muted-foreground">
              Tiempo de entrega
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estado de la cola */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Estado de la Cola de Mensajería
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-gray-600">Pendientes:</span>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                {queueStatus.pending}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm text-gray-600">Procesando:</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {queueStatus.processing}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Completados:</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {queueStatus.completed}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-600">Fallidos:</span>
              <Badge variant="outline" className="bg-red-100 text-red-800">
                {queueStatus.failed}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MessagingMetrics />
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogger.getAuditTrail(undefined, 5).map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {entry.action === 'bulk_send' && <Send className="h-4 w-4 text-blue-600" />}
                        {entry.action === 'template_used' && <MessageSquare className="h-4 w-4 text-green-600" />}
                        {entry.action === 'rate_limit_hit' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                        {entry.action === 'send_failed' && <XCircle className="h-4 w-4 text-red-600" />}
                        <div>
                          <p className="text-sm font-medium">
                            {entry.action === 'bulk_send' && 'Mensaje masivo enviado'}
                            {entry.action === 'template_used' && 'Plantilla utilizada'}
                            {entry.action === 'rate_limit_hit' && 'Límite de velocidad alcanzado'}
                            {entry.action === 'send_failed' && 'Error en envío'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {entry.recipientCount && (
                        <Badge variant="secondary">
                          {entry.recipientCount} destinatarios
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <MessagingMetrics detailed />
        </TabsContent>

        <TabsContent value="history">
          <MessageHistory />
        </TabsContent>

        <TabsContent value="analytics">
          <PerformanceAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationsDashboard;
