
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Shield, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getSecurityAlerts } from '@/hooks/admin-statistics/suspiciousActivityService';

const ConversationMonitoringLink: React.FC = () => {
  const { data: securityAlerts = [], isLoading } = useQuery({
    queryKey: ['security-alerts-summary'],
    queryFn: getSecurityAlerts,
    refetchInterval: 60000 // Refresh every minute
  });

  const highPriorityAlerts = securityAlerts.filter(alert => alert.severity === 'high').length;
  const totalAlerts = securityAlerts.length;

  return (
    <Link to="/admin/conversations" className="block">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500 bg-orange-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Monitoreo de Conversaciones
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">
            Supervisión Activa
          </div>
          <p className="text-xs text-orange-600 mt-1 mb-3">
            Detecta actividades sospechosas y transacciones al margen
          </p>
          
          {!isLoading && totalAlerts > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {highPriorityAlerts > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {highPriorityAlerts} Críticas
                </Badge>
              )}
              {totalAlerts > highPriorityAlerts && (
                <Badge variant="secondary">
                  {totalAlerts - highPriorityAlerts} Moderadas
                </Badge>
              )}
            </div>
          )}
          
          {!isLoading && totalAlerts === 0 && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Sin alertas activas
            </Badge>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">
            Haz clic para acceder al panel completo
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ConversationMonitoringLink;
