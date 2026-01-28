
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'accent' | 'info' | 'default';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className = '',
  isLoading = false,
  variant = 'default'
}) => {
  // Función para obtener estilos por variante
  const getVariantStyles = (variant: string) => {
    const styles = {
      primary: {
        card: 'card-primary',
        iconContainer: 'icon-container-primary',
        iconColor: 'text-blue-600',
        trendPositive: 'text-green-600',
        trendNegative: 'text-red-500'
      },
      success: {
        card: 'card-success',
        iconContainer: 'icon-container-success',
        iconColor: 'text-green-600',
        trendPositive: 'text-green-600',
        trendNegative: 'text-red-500'
      },
      warning: {
        card: 'card-warning',
        iconContainer: 'icon-container-warning',
        iconColor: 'text-orange-600',
        trendPositive: 'text-green-600',
        trendNegative: 'text-red-500'
      },
      accent: {
        card: 'card-accent',
        iconContainer: 'icon-container-accent',
        iconColor: 'text-purple-600',
        trendPositive: 'text-green-600',
        trendNegative: 'text-red-500'
      },
      info: {
        card: 'card-professional border-teal-200',
        iconContainer: 'icon-container-info',
        iconColor: 'text-teal-600',
        trendPositive: 'text-green-600',
        trendNegative: 'text-red-500'
      },
      default: {
        card: 'card-professional',
        iconContainer: 'p-3 rounded-xl bg-muted',
        iconColor: 'text-muted-foreground',
        trendPositive: 'text-green-600',
        trendNegative: 'text-red-500'
      }
    };
    return styles[variant] || styles.default;
  };

  const styles = getVariantStyles(variant);
  if (isLoading) {
    return (
      <Card className={`${styles.card} ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">{title}</CardTitle>
          <div className="h-6 w-6 bg-muted rounded-xl animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-20 bg-muted rounded animate-pulse mb-2" />
          {description && (
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-full min-h-[120px] sm:min-h-[140px] hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ${styles.card} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-sm font-semibold leading-tight text-card-foreground pr-2">
          {title}
        </CardTitle>
        <div className={`flex-shrink-0 ${styles.iconContainer}`}>
          <Icon className={`h-5 w-5 ${styles.iconColor}`} strokeWidth={1.2} />
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="text-2xl sm:text-3xl font-bold leading-none mb-2 text-card-foreground">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground leading-tight mb-2">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1">
            <span className={`text-xs font-medium ${trend.isPositive ? styles.trendPositive : styles.trendNegative}`}>
              {trend.isPositive ? '↗' : '↘'} {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
