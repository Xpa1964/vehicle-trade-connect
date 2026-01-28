
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ShieldAlert, Bell, AlertTriangle, RefreshCw, BarChart3, Users, Car, Truck, MessageSquare, Activity } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useAdminStatistics } from '@/hooks/useAdminStatistics';
import { useComprehensiveKPIs } from '@/hooks/useComprehensiveKPIs';
import { Permission } from '@/types/auth';
import EnhancedKPIs from './dashboard/EnhancedKPIs';
import ComprehensiveKPIs from './dashboard/ComprehensiveKPIs';
import RecentActivityFeed from './RecentActivityFeed';
import AnalyticsCharts from './analytics/AnalyticsCharts';
import ConversationMonitoringLink from '../dashboard/ConversationMonitoringLink';
import { ConversationDeletionMetrics } from './conversation-deletion-logs/ConversationDeletionMetrics';
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard: React.FC = () => {
  const { hasPermission } = useUserRole();
  const { stats, structuredStats, extendedStats, recentActivity, isLoading, error } = useAdminStatistics();
  const { data: comprehensiveKPIs, isLoading: isLoadingKPIs } = useComprehensiveKPIs();
  const [retryCount, setRetryCount] = React.useState(0);
  
  // Query to fetch pending registration requests count
  const { data: pendingRequestsCount, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['pendingRegistrations', retryCount],
    queryFn: async () => {
      try {
        const { data, error, count } = await supabase
          .from('registration_requests')
          .select('id', { count: 'exact' })
          .eq('status', 'pending');
          
        if (error) {
          console.error('Error fetching registration requests:', error);
          throw error;
        }
        
        console.log('Pending registration requests found:', count);
        return count || 0;
      } catch (error) {
        console.error('Error in pendingRegistrations query:', error);
        return 0;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };
  
  const adminCards = [
    {
      title: 'Analítica Avanzada',
      description: 'Análisis detallado de KPIs y métricas del marketplace',
      icon: <BarChart3 className="h-5 w-5" />,
      href: '/admin/analytics',
      permission: 'analytics.view' as Permission,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'Solicitudes de Registro',
      description: 'Revisar y aprobar solicitudes de registro',
      icon: <FileText className="h-5 w-5" />,
      href: '/admin/registration-requests',
      permission: 'registrations.manage' as Permission,
      badge: pendingRequestsCount ? pendingRequestsCount : undefined,
      color: 'bg-green-50 border-green-200',
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios y perfiles',
      icon: <Users className="h-5 w-5" />,
      href: '/admin/users',
      permission: 'users.view' as Permission,
      color: 'bg-purple-50 border-purple-200',
    },
    {
      title: 'Vehículos y Contenido',
      description: 'Supervisar vehículos y contenido publicado',
      icon: <Car className="h-5 w-5" />,
      href: '/admin/vehicles',
      permission: 'vehicles.view' as Permission,
      color: 'bg-orange-50 border-orange-200',
    },
    {
      title: 'Cotizaciones de Transporte',
      description: 'Gestionar solicitudes y cotizaciones de transporte',
      icon: <Truck className="h-5 w-5" />,
      href: '/admin/transport-quotes',
      permission: 'admin' as Permission,
      color: 'bg-cyan-50 border-cyan-200',
    },
    {
      title: 'Roles y Permisos',
      description: 'Configuración de roles y permisos',
      icon: <ShieldAlert className="h-5 w-5" />,
      href: '/admin/roles',
      permission: 'roles.manage' as Permission,
      color: 'bg-red-50 border-red-200',
    },
    {
      title: 'Registros de Actividad',
      description: 'Auditoría y logs del sistema',
      icon: <Activity className="h-5 w-5" />,
      href: '/admin/activity-logs',
      permission: 'logs.view' as Permission,
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      title: 'Notificaciones',
      description: 'Gestión de notificaciones del sistema',
      icon: <Bell className="h-5 w-5" />,
      href: '/admin/notifications',
      permission: 'notifications.manage' as Permission,
      color: 'bg-gray-50 border-gray-200',
    },
  ];

  if (error) {
    return (
      <div className="container px-0">
        <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
        
        <Card className="bg-red-50 border-red-200 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error al cargar los datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              Ocurrió un error al cargar las estadísticas: {error}
            </p>
            <Button 
              variant="outline" 
              className="mt-4 flex items-center gap-2"
              onClick={handleRetry}
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
        
        {/* Fallback UI - Show admin cards even if stats failed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminCards.map((card, index) => {
            const hasRequiredPermission = hasPermission(card.permission);
            if (!hasRequiredPermission) return null;
            
            return (
              <Card key={index} className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${card.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {card.icon}
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {card.title}
                      {isLoadingRequests ? (
                        <Skeleton className="h-6 w-6 rounded-full" />
                      ) : card.badge ? (
                        <Badge className="bg-red-500">{card.badge}</Badge>
                      ) : null}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <CardDescription className="text-sm mb-4">{card.description}</CardDescription>
                </CardContent>
                <CardFooter className="bg-white/50 pb-4">
                  <Button variant="default" asChild className="w-full">
                    <Link to={card.href}>Acceder</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Button variant="outline" asChild>
          <Link to="/admin/analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Analítica Completa
          </Link>
        </Button>
      </div>
      
      {/* Enhanced KPIs - Ahora con datos reales */}
      {!isLoading && extendedStats && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Métricas Principales</h2>
          <EnhancedKPIs stats={structuredStats} realStats={extendedStats.realStats} />
        </div>
      )}

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen Ejecutivo</TabsTrigger>
          <TabsTrigger value="comprehensive">KPIs Detallados</TabsTrigger>
          <TabsTrigger value="activity">Actividad Reciente</TabsTrigger>
          <TabsTrigger value="management">Gestión</TabsTrigger>
          <TabsTrigger value="analytics">Gráficos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Conversation Deletion Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Métricas de Eliminación de Conversaciones</h3>
            <ConversationDeletionMetrics />
          </div>
          
          {/* Quick Access Cards Grid with Enhanced Conversation Monitoring */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminCards.slice(0, 3).map((card, index) => {
              const hasRequiredPermission = hasPermission(card.permission);
              if (!hasRequiredPermission) return null;
              
              return (
                <Card key={index} className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${card.color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {card.icon}
                      <CardTitle className="flex items-center gap-2 text-sm">
                        {card.title}
                        {isLoadingRequests ? (
                          <Skeleton className="h-5 w-5 rounded-full" />
                        ) : card.badge ? (
                          <Badge className="bg-red-500 text-xs">{card.badge}</Badge>
                        ) : null}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <CardDescription className="text-xs mb-3">{card.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="bg-white/50 pb-3">
                    <Button variant="default" size="sm" asChild className="w-full">
                      <Link to={card.href}>Acceder</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            
            {/* Enhanced Conversation Monitoring Card */}
            <ConversationMonitoringLink />
          </div>
          
          {/* Charts Overview */}
          {!isLoading && extendedStats && (
            <AnalyticsCharts 
              data={extendedStats} 
              recentActivity={recentActivity}
              type="overview"
            />
          )}
        </TabsContent>

        <TabsContent value="comprehensive" className="space-y-6">
          {/* Comprehensive KPIs Section */}
          {!isLoadingKPIs && comprehensiveKPIs ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">KPIs Comprehensivos</h2>
                <Badge variant="outline" className="text-sm">
                  {Object.keys(comprehensiveKPIs).length} métricas disponibles
                </Badge>
              </div>
              <ComprehensiveKPIs kpiData={comprehensiveKPIs} />
            </div>
          ) : isLoadingKPIs ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            </div>
          ) : (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-700">KPIs no disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700">
                  No se pudieron cargar los KPIs comprehensivos. Intenta recargar la página.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Recent Activity - Full width */}
          <RecentActivityFeed 
            activities={recentActivity || []} 
            loading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          {/* Management Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminCards.slice(4).map((card, index) => {
              const hasRequiredPermission = hasPermission(card.permission);
              if (!hasRequiredPermission) return null;
              
              return (
                <Card key={index} className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${card.color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {card.icon}
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {card.title}
                        {isLoadingRequests ? (
                          <Skeleton className="h-6 w-6 rounded-full" />
                        ) : card.badge ? (
                          <Badge className="bg-red-500">{card.badge}</Badge>
                        ) : null}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <CardDescription className="text-sm mb-4">{card.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="bg-white/50 pb-4">
                    <Button variant="default" asChild className="w-full">
                      <Link to={card.href}>Acceder</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Advanced Charts */}
          {!isLoading && extendedStats && (
            <>
              <AnalyticsCharts 
                data={extendedStats} 
                recentActivity={recentActivity}
                type="users"
              />
              <AnalyticsCharts 
                data={extendedStats} 
                recentActivity={recentActivity}
                type="vehicles"
              />
              <AnalyticsCharts 
                data={extendedStats} 
                recentActivity={recentActivity}
                type="performance"
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
