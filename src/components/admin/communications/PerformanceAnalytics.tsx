
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Target,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { auditLogger } from '@/services/messaging/auditLogger';
import { messagingQueue } from '@/services/messaging/messagingQueue';

const PerformanceAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    deliveryMetrics: [] as Array<{ date: string; delivered: number; failed: number; pending: number }>,
    responseTimeMetrics: [] as Array<{ hour: string; avgTime: number; maxTime: number }>,
    volumeAnalysis: [] as Array<{ period: string; volume: number; growth: number }>,
    efficiencyScores: {
      overall: 0,
      delivery: 0,
      speed: 0,
      reliability: 0
    },
    insights: [] as Array<{ type: 'warning' | 'success' | 'info'; title: string; description: string }>
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const auditTrail = auditLogger.getAuditTrail();
    const queueStatus = messagingQueue.getQueueStatus();
    
    // Generar métricas de entrega
    const deliveryData = generateDeliveryMetrics(auditTrail);
    
    // Generar métricas de tiempo de respuesta
    const responseData = generateResponseTimeMetrics(auditTrail);
    
    // Análisis de volumen
    const volumeData = generateVolumeAnalysis(auditTrail);
    
    // Calcular puntuaciones de eficiencia
    const efficiency = calculateEfficiencyScores(auditTrail, queueStatus);
    
    // Generar insights
    const insights = generateInsights(auditTrail, efficiency);

    setAnalytics({
      deliveryMetrics: deliveryData,
      responseTimeMetrics: responseData,
      volumeAnalysis: volumeData,
      efficiencyScores: efficiency,
      insights: insights
    });
  };

  const generateDeliveryMetrics = (auditTrail: any[]) => {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEntries = auditTrail.filter(entry => {
        const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
        return entryDate === dateStr;
      });
      
      const delivered = dayEntries.filter(e => e.action === 'bulk_send').length;
      const failed = dayEntries.filter(e => e.action === 'send_failed').length;
      const pending = dayEntries.filter(e => e.action === 'queue_added').length;
      
      last7Days.push({
        date: date.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit' }),
        delivered,
        failed,
        pending
      });
    }
    
    return last7Days;
  };

  const generateResponseTimeMetrics = (auditTrail: any[]) => {
    const hourlyData = [];
    
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0') + ':00';
      
      // Simular tiempos de respuesta basados en actividad real
      const hourlyActivity = auditTrail.filter(entry => {
        const entryHour = new Date(entry.timestamp).getHours();
        return entryHour === hour;
      }).length;
      
      // Calcular tiempo promedio simulado (más actividad = mayor tiempo)
      const avgTime = Math.max(0.5, Math.min(5, 1 + (hourlyActivity * 0.1)));
      const maxTime = avgTime * 1.5;
      
      hourlyData.push({
        hour: hourStr,
        avgTime: Math.round(avgTime * 100) / 100,
        maxTime: Math.round(maxTime * 100) / 100
      });
    }
    
    return hourlyData;
  };

  const generateVolumeAnalysis = (auditTrail: any[]) => {
    const periods = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    const now = new Date();
    
    return periods.map((period, index) => {
      const weekStart = new Date(now.getTime() - (3 - index) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const weekEntries = auditTrail.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= weekStart && entryDate < weekEnd;
      });
      
      const volume = weekEntries.filter(e => e.action === 'bulk_send').length;
      const previousVolume = index > 0 ? 
        auditTrail.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          const prevWeekStart = new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
          const prevWeekEnd = new Date(prevWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          return entryDate >= prevWeekStart && entryDate < prevWeekEnd && entry.action === 'bulk_send';
        }).length : volume;
      
      const growth = previousVolume > 0 ? ((volume - previousVolume) / previousVolume) * 100 : 0;
      
      return { period, volume, growth: Math.round(growth) };
    });
  };

  const calculateEfficiencyScores = (auditTrail: any[], queueStatus: any) => {
    const totalMessages = auditTrail.filter(e => e.action === 'bulk_send').length;
    const failedMessages = auditTrail.filter(e => e.action === 'send_failed').length;
    const rateLimitHits = auditTrail.filter(e => e.action === 'rate_limit_hit').length;
    
    // Puntuación de entrega (% de mensajes exitosos)
    const delivery = totalMessages > 0 ? ((totalMessages - failedMessages) / totalMessages) * 100 : 100;
    
    // Puntuación de velocidad (basada en cola actual)
    const totalInQueue = queueStatus.pending + queueStatus.processing;
    const speed = Math.max(0, 100 - (totalInQueue * 5));
    
    // Puntuación de confiabilidad (basada en rate limits)
    const reliability = Math.max(0, 100 - (rateLimitHits * 10));
    
    // Puntuación general
    const overall = (delivery + speed + reliability) / 3;
    
    return {
      overall: Math.round(overall),
      delivery: Math.round(delivery),
      speed: Math.round(speed),
      reliability: Math.round(reliability)
    };
  };

  const generateInsights = (auditTrail: any[], efficiency: any) => {
    const insights = [];
    
    // Análisis de rendimiento
    if (efficiency.overall >= 90) {
      insights.push({
        type: 'success' as const,
        title: 'Rendimiento Excelente',
        description: 'El sistema de mensajería está funcionando de manera óptima con alta eficiencia.'
      });
    } else if (efficiency.overall >= 70) {
      insights.push({
        type: 'info' as const,
        title: 'Rendimiento Bueno',
        description: 'El sistema funciona bien, pero hay margen de mejora en algunos aspectos.'
      });
    } else {
      insights.push({
        type: 'warning' as const,
        title: 'Rendimiento Mejorable',
        description: 'Se recomienda revisar la configuración y optimizar el sistema de mensajería.'
      });
    }
    
    // Análisis de fallos
    const recentFailures = auditTrail.filter(e => 
      e.action === 'send_failed' && 
      new Date(e.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    if (recentFailures.length > 5) {
      insights.push({
        type: 'warning' as const,
        title: 'Aumento en Fallos',
        description: `Se han detectado ${recentFailures.length} fallos en las últimas 24 horas. Revisar configuración.`
      });
    }
    
    // Análisis de rate limiting
    const recentRateLimits = auditTrail.filter(e => 
      e.action === 'rate_limit_hit' && 
      new Date(e.timestamp) > new Date(Date.now() - 60 * 60 * 1000)
    );
    
    if (recentRateLimits.length > 0) {
      insights.push({
        type: 'info' as const,
        title: 'Límites de Velocidad Activos',
        description: 'Los límites de velocidad están funcionando correctamente para prevenir sobrecarga.'
      });
    }
    
    return insights;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 70) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Puntuaciones de eficiencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eficiencia General</p>
                <p className={`text-2xl font-bold ${getScoreColor(analytics.efficiencyScores.overall)}`}>
                  {analytics.efficiencyScores.overall}%
                </p>
              </div>
              {getScoreIcon(analytics.efficiencyScores.overall)}
            </div>
            <Progress value={analytics.efficiencyScores.overall} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa de Entrega</p>
                <p className={`text-2xl font-bold ${getScoreColor(analytics.efficiencyScores.delivery)}`}>
                  {analytics.efficiencyScores.delivery}%
                </p>
              </div>
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <Progress value={analytics.efficiencyScores.delivery} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Velocidad</p>
                <p className={`text-2xl font-bold ${getScoreColor(analytics.efficiencyScores.speed)}`}>
                  {analytics.efficiencyScores.speed}%
                </p>
              </div>
              <Zap className="h-4 w-4 text-yellow-600" />
            </div>
            <Progress value={analytics.efficiencyScores.speed} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confiabilidad</p>
                <p className={`text-2xl font-bold ${getScoreColor(analytics.efficiencyScores.reliability)}`}>
                  {analytics.efficiencyScores.reliability}%
                </p>
              </div>
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <Progress value={analytics.efficiencyScores.reliability} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Insights y recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Insights y Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {insight.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                {insight.type === 'info' && <Clock className="h-5 w-5 text-blue-600 mt-0.5" />}
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Métricas de entrega */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Entrega (Últimos 7 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.deliveryMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="delivered" stackId="1" stroke="#8884d8" fill="#8884d8" name="Entregados" />
                <Area type="monotone" dataKey="failed" stackId="1" stroke="#ff7c7c" fill="#ff7c7c" name="Fallidos" />
                <Area type="monotone" dataKey="pending" stackId="1" stroke="#ffbb28" fill="#ffbb28" name="Pendientes" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tiempos de respuesta */}
        <Card>
          <CardHeader>
            <CardTitle>Tiempos de Respuesta por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.responseTimeMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}s`, '']} />
                <Line type="monotone" dataKey="avgTime" stroke="#8884d8" strokeWidth={2} name="Tiempo Promedio" />
                <Line type="monotone" dataKey="maxTime" stroke="#ff7c7c" strokeWidth={1} strokeDasharray="5 5" name="Tiempo Máximo" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de volumen */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Volumen y Crecimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.volumeAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#8884d8" name="Volumen de Mensajes" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {analytics.volumeAnalysis.map((period, index) => (
              <div key={index} className="text-center">
                <p className="text-sm text-gray-600">{period.period}</p>
                <div className="flex items-center justify-center gap-1">
                  {period.growth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={period.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                    {period.growth > 0 ? '+' : ''}{period.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
