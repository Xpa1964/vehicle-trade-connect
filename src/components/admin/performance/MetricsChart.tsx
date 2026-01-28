import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricsChartProps {
  data: any[];
  dataKey: string;
  secondaryKey?: string;
  color?: string;
  secondaryColor?: string;
  isLoading?: boolean;
}

const MetricsChart: React.FC<MetricsChartProps> = ({
  data,
  dataKey,
  secondaryKey,
  color = '#8884d8',
  secondaryColor = '#82ca9d',
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="h-64 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  // Format data for chart
  const chartData = data.slice(-20).map(item => ({
    ...item,
    timestamp: new Date(item.timestamp || item.created_at).toLocaleTimeString(),
    [dataKey]: Number(item[dataKey]) || 0,
    ...(secondaryKey && { [secondaryKey]: Number(item[secondaryKey]) || 0 })
  }));

  const formatTooltipValue = (value: number, name: string) => {
    if (name.includes('memory') || name.includes('Memory')) {
      return `${value.toFixed(1)} MB`;
    }
    if (name.includes('time') || name.includes('Time')) {
      return `${value.toFixed(2)} ms`;
    }
    return value.toString();
  };

  const formatLabel = (label: string) => {
    return `Time: ${label}`;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="timestamp" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              fontSize: '12px'
            }}
            formatter={formatTooltipValue}
            labelFormatter={formatLabel}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5, stroke: color, strokeWidth: 2 }}
          />
          {secondaryKey && (
            <Line
              type="monotone"
              dataKey={secondaryKey}
              stroke={secondaryColor}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5, stroke: secondaryColor, strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;