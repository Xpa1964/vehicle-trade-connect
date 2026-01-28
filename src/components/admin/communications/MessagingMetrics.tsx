
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { auditLogger } from '@/services/messaging/auditLogger';
import { rateLimiter } from '@/services/messaging/rateLimiter';

interface MessagingMetricsProps {
  detailed?: boolean;
}

const MessagingMetrics: React.FC<MessagingMetricsProps> = ({ detailed = false }) => {
  const [metrics, setMetrics] = useState({
    hourlyActivity: [] as Array<{ hour: string; messages: number; recipients: number }>,
    templateUsage: [] as Array<{ template: string; count: number }>,
    successRates: [] as Array<{ period: string; rate: number }>,
    userActivity: [] as Array<{ user: string; messages: number }>
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = () => {
    const auditTrail = auditLogger.getAuditTrail();
    
    // Actividad por hora (últimas 24 horas)
    const hourlyData = generateHourlyActivity(auditTrail);
    
    // Uso de plantillas
    const templateData = generateTemplateUsage(auditTrail);
    
    // Tasas de éxito por período
    const successData = generateSuccessRates(auditTrail);
    
    // Actividad por usuario
    const userActivityData = generateUserActivity(auditTrail);

    setMetrics({
      hourlyActivity: hourlyData,
      templateUsage: templateData,
      successRates: successData,
      userActivity: userActivityData
    });
  };

  const generateHourlyActivity = (auditTrail: any[]) => {
    const hourlyMap = new Map();
    const now = new Date();
    
    // Inicializar últimas 24 horas
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourKey = hour.getHours().toString().padStart(2, '0') + ':00';
      hourlyMap.set(hourKey, { hour: hourKey, messages: 0, recipients: 0 });
    }
    
    // Procesar datos de auditoría
    auditTrail.forEach(entry => {
      if (entry.action === 'bulk_send') {
        const entryDate = new Date(entry.timestamp);
        const hourKey = entryDate.getHours().toString().padStart(2, '0') + ':00';
        
        if (hourlyMap.has(hourKey)) {
          const data = hourlyMap.get(hourKey);
          data.messages += 1;
          data.recipients += entry.recipientCount || 0;
        }
      }
    });
    
    return Array.from(hourlyMap.values());
  };

  const generateTemplateUsage = (auditTrail: any[]) => {
    const templateMap = new Map();
    
    auditTrail.forEach(entry => {
      if (entry.action === 'template_used' && entry.templateId) {
        const count = templateMap.get(entry.templateId) || 0;
        templateMap.set(entry.templateId, count + 1);
      }
    });
    
    return Array.from(templateMap.entries())
      .map(([template, count]) => ({ template: template.substring(0, 20) + '...', count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const generateSuccessRates = (auditTrail: any[]) => {
    const periods = ['Último día', 'Última semana', 'Último mes'];
    const now = new Date();
    
    return periods.map(period => {
      let cutoffDate: Date;
      
      switch (period) {
        case 'Último día':
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'Última semana':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'Último mes':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }
      
      const periodEntries = auditTrail.filter(entry => 
        new Date(entry.timestamp) >= cutoffDate
      );
      
      const totalMessages = periodEntries.filter(e => e.action === 'bulk_send').length;
      const failedMessages = periodEntries.filter(e => e.action === 'send_failed').length;
      
      const rate = totalMessages > 0 ? ((totalMessages - failedMessages) / totalMessages) * 100 : 100;
      
      return { period, rate: Math.round(rate) };
    });
  };

  const generateUserActivity = (auditTrail: any[]) => {
    const userMap = new Map();
    
    auditTrail.forEach(entry => {
      if (entry.action === 'bulk_send') {
        const count = userMap.get(entry.userId) || 0;
        userMap.set(entry.userId, count + 1);
      }
    });
    
    return Array.from(userMap.entries())
      .map(([user, messages]) => ({ 
        user: `Usuario ${user.substring(0, 8)}...`, 
        messages 
      }))
      .sort((a, b) => b.messages - a.messages)
      .slice(0, 5);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!detailed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métricas en Tiempo Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Actividad de la última hora</span>
                <span>{metrics.hourlyActivity.slice(-1)[0]?.messages || 0} mensajes</span>
              </div>
              <Progress 
                value={Math.min((metrics.hourlyActivity.slice(-1)[0]?.messages || 0) * 10, 100)} 
                className="h-2" 
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Plantillas más usadas</span>
                <span>{metrics.templateUsage.length} activas</span>
              </div>
              <div className="space-y-1">
                {metrics.templateUsage.slice(0, 3).map((template, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="truncate">{template.template}</span>
                    <Badge variant="outline" className="ml-2">
                      {template.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actividad por hora */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad de Mensajería (Últimas 24 horas)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#8884d8" name="Mensajes" />
              <Bar dataKey="recipients" fill="#82ca9d" name="Destinatarios" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasas de éxito */}
        <Card>
          <CardHeader>
            <CardTitle>Tasas de Éxito por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics.successRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Tasa de éxito']} />
                <Line type="monotone" dataKey="rate" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Uso de plantillas */}
        <Card>
          <CardHeader>
            <CardTitle>Plantillas Más Utilizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={metrics.templateUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ template, count }) => `${template}: ${count}`}
                >
                  {metrics.templateUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actividad por usuario */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Más Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metrics.userActivity} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="user" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="messages" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingMetrics;
