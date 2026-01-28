import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { subDays, startOfDay, endOfDay } from 'date-fns';

interface DeletionMetrics {
  totalDeletions: number;
  deletionsThisWeek: number;
  deletionsByRole: {
    seller: number;
    buyer: number;
  };
  averageConversationAge: number;
  pinnedDeleted: number;
}

export function ConversationDeletionMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['conversation-deletion-metrics'],
    queryFn: async (): Promise<DeletionMetrics> => {
      const weekAgo = subDays(new Date(), 7);
      
      // Get all deletion logs
      const { data: allDeletions, error: allError } = await supabase
        .from('activity_logs')
        .select('*')
        .or('action_type.eq.conversation_deleted_by_seller,action_type.eq.conversation_deleted_by_buyer');
      
      if (allError) throw allError;

      // Get deletions from this week
      const { data: weekDeletions, error: weekError } = await supabase
        .from('activity_logs')
        .select('*')
        .or('action_type.eq.conversation_deleted_by_seller,action_type.eq.conversation_deleted_by_buyer')
        .gte('created_at', startOfDay(weekAgo).toISOString())
        .lte('created_at', endOfDay(new Date()).toISOString());
      
      if (weekError) throw weekError;

      const sellerDeletions = allDeletions?.filter(log => log.action_type === 'conversation_deleted_by_seller').length || 0;
      const buyerDeletions = allDeletions?.filter(log => log.action_type === 'conversation_deleted_by_buyer').length || 0;
      
      const averageAge = allDeletions?.reduce((sum, log) => {
        const details = log.details as any;
        return sum + (details?.conversation_age_hours || 0);
      }, 0) / (allDeletions?.length || 1);

      const pinnedDeleted = allDeletions?.filter(log => {
        const details = log.details as any;
        return details?.was_pinned;
      }).length || 0;

      return {
        totalDeletions: allDeletions?.length || 0,
        deletionsThisWeek: weekDeletions?.length || 0,
        deletionsByRole: {
          seller: sellerDeletions,
          buyer: buyerDeletions
        },
        averageConversationAge: averageAge || 0,
        pinnedDeleted
      };
    },
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  });

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Eliminaciones</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalDeletions}</div>
          <p className="text-xs text-muted-foreground">
            Histórico completo
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.deletionsThisWeek}</div>
          <p className="text-xs text-muted-foreground">
            Últimos 7 días
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDuration(metrics.averageConversationAge)}</div>
          <p className="text-xs text-muted-foreground">
            Duración antes de eliminar
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fijadas Eliminadas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.pinnedDeleted}</div>
          <p className="text-xs text-muted-foreground">
            Conversaciones importantes
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Por Rol de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Vendedores:</span>
              <span className="font-medium">{metrics.deletionsByRole.seller}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Compradores:</span>
              <span className="font-medium">{metrics.deletionsByRole.buyer}</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500" 
                style={{ 
                  width: `${(metrics.deletionsByRole.seller / metrics.totalDeletions) * 100 || 0}%` 
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.deletionsByRole.seller > metrics.deletionsByRole.buyer 
                ? 'Vendedores eliminan más conversaciones' 
                : 'Compradores eliminan más conversaciones'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}