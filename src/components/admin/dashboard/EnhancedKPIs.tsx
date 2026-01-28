
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Car, MessageSquare, DollarSign, Activity, Target, Clock, ThumbsUp, MapPin, Zap } from 'lucide-react';

interface EnhancedKPIsProps {
  stats: {
    users: { total: number; growthRate: number };
    vehicles: { total: number; recentlyAdded: number };
    conversations: { active: number; newLastWeek: number };
    transactions: { potential: number; completed: number };
  };
  realStats: {
    averageResponseTime: number;
    averageTransactionValue: number;
    monthlyCommissions: number;
    commissionGrowthRate: number;
    qualityScore: number;
    qualityGrowthRate: number;
    activeUsersLast30Days: number;
    activeUsersGrowthRate: number;
    regionsCount: number;
    newRegionsCount: number;
  };
}

const EnhancedKPIs: React.FC<EnhancedKPIsProps> = ({ stats, realStats }) => {
  // Cálculos para KPIs basados en datos reales
  const conversionRate = stats.vehicles.total > 0 ? 
    Math.round((stats.transactions.completed / stats.vehicles.total) * 100) : 0;
  
  const engagementRate = stats.users.total > 0 ? 
    Math.round((stats.conversations.active / stats.users.total) * 100) : 0;
  
  const kpis = [
    {
      title: 'Usuarios Totales',
      value: stats.users.total,
      change: stats.users.growthRate,
      changeLabel: 'crecimiento mensual',
      icon: <Users className="h-4 w-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      category: 'usuarios'
    },
    {
      title: 'Vehículos Activos',
      value: stats.vehicles.total,
      change: stats.vehicles.recentlyAdded,
      changeLabel: 'añadidos últimos 14 días',
      icon: <Car className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      category: 'inventario'
    },
    {
      title: 'Conversaciones Activas',
      value: stats.conversations.active,
      change: stats.conversations.newLastWeek,
      changeLabel: 'nuevas esta semana',
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      category: 'comunicación'
    },
    {
      title: 'Transacciones Completadas',
      value: stats.transactions.completed,
      change: stats.transactions.potential,
      changeLabel: 'en proceso',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      category: 'ventas'
    },
    {
      title: 'Comisiones del Mes',
      value: realStats.monthlyCommissions,
      change: realStats.commissionGrowthRate,
      changeLabel: 'vs mes anterior',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      category: 'finanzas',
      isEuro: true
    },
    {
      title: 'Valor Promedio Transacción',
      value: realStats.averageTransactionValue,
      change: 0, // No tenemos cálculo histórico todavía
      changeLabel: 'promedio actual',
      icon: <Target className="h-4 w-4" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      category: 'finanzas',
      isEuro: true
    },
    {
      title: 'Tasa de Conversión',
      value: conversionRate,
      change: 0, // Calculado dinámicamente
      changeLabel: 'vehículos a ventas',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      category: 'rendimiento',
      isPercentage: true
    },
    {
      title: 'Engagement Rate',
      value: engagementRate,
      change: 0, // Calculado dinámicamente
      changeLabel: 'usuarios en conversaciones',
      icon: <Activity className="h-4 w-4" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      category: 'rendimiento',
      isPercentage: true
    },
    {
      title: 'Tiempo Respuesta Promedio',
      value: realStats.averageResponseTime,
      change: 0, // No tenemos histórico todavía
      changeLabel: 'entre mensajes',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      category: 'calidad',
      suffix: 'h'
    },
    {
      title: 'Score de Calidad',
      value: realStats.qualityScore,
      change: realStats.qualityGrowthRate,
      changeLabel: 'mejora continua',
      icon: <ThumbsUp className="h-4 w-4" />,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      category: 'calidad',
      suffix: '/10'
    },
    {
      title: 'Usuarios Activos (30d)',
      value: realStats.activeUsersLast30Days,
      change: realStats.activeUsersGrowthRate,
      changeLabel: 'vs mes anterior',
      icon: <Zap className="h-4 w-4" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      category: 'engagement'
    },
    {
      title: 'Distribución Geográfica',
      value: realStats.regionsCount,
      change: realStats.newRegionsCount,
      changeLabel: 'nuevas regiones',
      icon: <MapPin className="h-4 w-4" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      category: 'alcance',
      suffix: ' regiones'
    }
  ];

  // Agrupar KPIs por categoría
  const categories = {
    'core': kpis.filter(kpi => ['usuarios', 'inventario', 'comunicación', 'ventas'].includes(kpi.category)),
    'finanzas': kpis.filter(kpi => kpi.category === 'finanzas'),
    'rendimiento': kpis.filter(kpi => kpi.category === 'rendimiento'),
    'calidad': kpis.filter(kpi => ['calidad', 'engagement', 'alcance'].includes(kpi.category))
  };

  const formatValue = (kpi: any) => {
    let formattedValue = '';
    
    if (kpi.isEuro) {
      formattedValue = `€${kpi.value.toLocaleString()}`;
    } else if (kpi.isPercentage) {
      formattedValue = `${kpi.value}%`;
    } else {
      formattedValue = kpi.value.toLocaleString();
    }
    
    if (kpi.suffix) {
      formattedValue += kpi.suffix;
    }
    
    return formattedValue;
  };

  const renderKPISection = (title: string, kpis: any[]) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className={`${kpi.bgColor} border-l-4 border-l-current ${kpi.color}`}>
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
                {formatValue(kpi)}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                {kpi.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : kpi.change < 0 ? (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                ) : (
                  <Activity className="h-3 w-3 text-gray-400" />
                )}
                <span className={kpi.change > 0 ? 'text-green-600' : kpi.change < 0 ? 'text-red-600' : 'text-gray-600'}>
                  {kpi.change !== 0 ? `${Math.abs(kpi.change)}%` : 'Actual'}
                </span>
                <span>{kpi.changeLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {renderKPISection('Métricas Fundamentales', categories.core)}
      {renderKPISection('Indicadores Financieros', categories.finanzas)}
      {renderKPISection('Rendimiento y Conversión', categories.rendimiento)}
      {renderKPISection('Calidad y Experiencia', categories.calidad)}
    </div>
  );
};

export default EnhancedKPIs;
