
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Car, MessageSquare, DollarSign, Activity, Target } from 'lucide-react';
import { AdminStats } from '@/hooks/useAdminStatistics';

interface AnalyticsKPIsProps {
  stats: AdminStats;
}

const AnalyticsKPIs: React.FC<AnalyticsKPIsProps> = ({ stats }) => {
  const kpis = [
    {
      title: 'Usuarios Totales',
      value: stats.users.total,
      change: stats.users.growthRate,
      changeLabel: 'crecimiento mensual',
      icon: <Users className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      title: 'Vehículos Activos',
      value: stats.vehicles.total,
      change: stats.vehicles.recentlyAdded,
      changeLabel: 'añadidos últimos 14 días',
      icon: <Car className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      title: 'Conversaciones Activas',
      value: stats.conversations.active,
      change: stats.conversations.newLastWeek,
      changeLabel: 'nuevas esta semana',
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'text-purple-600'
    },
    {
      title: 'Transacciones',
      value: stats.transactions.completed,
      change: stats.transactions.potential,
      changeLabel: 'en proceso',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-orange-600'
    },
    {
      title: 'Tasa de Conversión',
      value: stats.transactions.completed > 0 ? Math.round((stats.transactions.completed / stats.vehicles.total) * 100) : 0,
      change: 2.3,
      changeLabel: 'vs mes anterior',
      icon: <Target className="h-4 w-4" />,
      color: 'text-red-600',
      isPercentage: true
    },
    {
      title: 'Engagement Rate',
      value: stats.conversations.active > 0 ? Math.round((stats.conversations.active / stats.users.total) * 100) : 0,
      change: 5.1,
      changeLabel: 'vs mes anterior',
      icon: <Activity className="h-4 w-4" />,
      color: 'text-indigo-600',
      isPercentage: true
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {kpi.title}
            </CardTitle>
            <div className={kpi.color}>
              {kpi.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpi.value.toLocaleString()}{kpi.isPercentage ? '%' : ''}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {kpi.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={kpi.change > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(kpi.change)}%
              </span>
              <span>{kpi.changeLabel}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsKPIs;
