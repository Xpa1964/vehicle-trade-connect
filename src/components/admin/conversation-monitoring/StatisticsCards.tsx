
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type StatisticsCardsProps = {
  isLoadingStats: boolean;
  conversationStats: {
    total: number;
    active: number;
    new: number;
    potential: number;
  } | null;
};

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ 
  isLoadingStats, 
  conversationStats 
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Total Conversaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold">{conversationStats?.total || 0}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Conversaciones Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold">{conversationStats?.active || 0}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Nuevas (Esta Semana)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold">{conversationStats?.new || 0}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Transacciones Potenciales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold">{conversationStats?.potential || 0}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
