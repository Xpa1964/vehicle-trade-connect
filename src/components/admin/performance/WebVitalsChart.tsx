import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WebVitalMetric } from '@/utils/webVitals';
import { useLanguage } from '@/contexts/LanguageContext';

interface WebVitalsChartProps {
  data: {
    CLS: WebVitalMetric[];
    INP: WebVitalMetric[];
    LCP: WebVitalMetric[];
    TTFB: WebVitalMetric[];
  };
  isLoading?: boolean;
}

const WebVitalsChart: React.FC<WebVitalsChartProps> = ({ data, isLoading = false }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Combinar todas las métricas en un formato de serie temporal (FID removed in v4)
  const allMetrics = [
    ...data.CLS.map(m => ({ ...m, metric: 'CLS' })),
    ...data.INP.map(m => ({ ...m, metric: 'INP' })),
    ...data.LCP.map(m => ({ ...m, metric: 'LCP' })),
    ...data.TTFB.map(m => ({ ...m, metric: 'TTFB' })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  if (allMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('performance.webVitals.title')}</CardTitle>
          <CardDescription>{t('performance.chart.systemPerformanceDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No Web Vitals data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  // Agrupar por timestamp para el gráfico (últimas 20 muestras únicas)
  const timeGroups = new Map<number, any>();
  
  allMetrics.forEach(metric => {
    const roundedTime = Math.floor(metric.timestamp / 5000) * 5000; // Agrupar por ventanas de 5s
    
    if (!timeGroups.has(roundedTime)) {
      timeGroups.set(roundedTime, {
        timestamp: roundedTime,
        CLS: null,
        INP: null,
        LCP: null,
        TTFB: null,
      });
    }
    
    const group = timeGroups.get(roundedTime)!;
    group[metric.metric] = metric.value;
  });

  const chartData = Array.from(timeGroups.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-20)
    .map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
      CLS: point.CLS ? point.CLS * 1000 : null, // Escalar para visibilidad
      INP: point.INP,
      LCP: point.LCP ? point.LCP / 1000 : null, // Convertir a segundos
      TTFB: point.TTFB,
    }));

  const formatTooltipValue = (value: number, name: string) => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (name) {
      case 'CLS':
        return (value / 1000).toFixed(3); // Revertir escala
      case 'INP':
      case 'TTFB':
        return `${Math.round(value)}ms`;
      case 'LCP':
        return `${value.toFixed(2)}s`;
      default:
        return value.toFixed(2);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('performance.webVitals.title')}</CardTitle>
        <CardDescription>Real-time Core Web Vitals metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={formatTooltipValue}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="CLS" 
              stroke="hsl(220, 70%, 50%)" 
              strokeWidth={2}
              dot={false}
              name="CLS (×1000)"
              connectNulls
            />
            <Line 
              type="monotone" 
              dataKey="INP" 
              stroke="hsl(142, 70%, 45%)" 
              strokeWidth={2}
              dot={false}
              name="INP (ms)"
              connectNulls
            />
            <Line 
              type="monotone" 
              dataKey="LCP" 
              stroke="hsl(25, 95%, 53%)" 
              strokeWidth={2}
              dot={false}
              name="LCP (s)"
              connectNulls
            />
            <Line 
              type="monotone" 
              dataKey="TTFB" 
              stroke="hsl(340, 70%, 50%)" 
              strokeWidth={2}
              dot={false}
              name="TTFB (ms)"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WebVitalsChart;
