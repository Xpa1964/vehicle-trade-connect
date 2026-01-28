
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Car, MessageSquare, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentActivity } from '@/hooks/useAdminStatistics';

interface RecentActivityFeedProps {
  activities: RecentActivity[];
  loading: boolean;
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3 border-b pb-2">
                <div className="h-6 w-6 rounded-full bg-slate-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse" />
                </div>
                <div className="h-3 bg-slate-200 rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'vehicle_added':
        return <Car className="h-4 w-4 text-green-500" />;
      case 'conversation':
        return <MessageSquare className="h-4 w-4 text-amber-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getSeverityClass = (severity?: string) => {
    switch (severity) {
      case 'warning':
        return 'bg-yellow-50 border-l-2 border-yellow-400';
      case 'alert':
        return 'bg-red-50 border-l-2 border-red-400';
      default:
        return 'border-l-2 border-transparent hover:border-slate-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No hay actividad reciente
          </div>
        ) : (
          <div className="divide-y">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-center justify-between p-3 hover:bg-slate-50 ${getSeverityClass(activity.severity)}`}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="bg-slate-100 rounded-full p-1 shrink-0">
                    {getIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <span className="text-xs text-muted-foreground line-clamp-1">{activity.description}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {format(new Date(activity.timestamp), 'dd MMM, HH:mm', { locale: es })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
