import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Activity, Users, AlertCircle } from 'lucide-react';
import { useAPIStats } from '@/hooks/useAPIStats';
import { useLanguage } from '@/contexts/LanguageContext';

const APIStats: React.FC = () => {
  const { stats, isLoading } = useAPIStats();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-20 animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: t('api.stats.totalKeys'),
      value: stats?.totalKeys || 0,
      icon: Key,
      color: 'text-blue-600'
    },
    {
      title: t('api.stats.activeKeys'),
      value: stats?.activeKeys || 0,
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: t('api.stats.totalUsers'),
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: t('api.stats.totalRequests'),
      value: stats?.totalRequests || 0,
      icon: AlertCircle,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default APIStats;
