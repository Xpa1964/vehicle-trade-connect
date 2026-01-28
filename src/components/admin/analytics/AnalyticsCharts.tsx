
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { AdminStats, RecentActivity } from '@/hooks/useAdminStatistics';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface ExtendedAdminStats extends AdminStats {
  messageHeatmap: Array<{ hour: number; count: number }>;
  engagement: {
    totalConversations: number;
    activeConversations: number;
    averageMessagesPerConversation: number;
    totalMessages: number;
  };
  retention: {
    totalUsers: number;
    activeUsers: number;
    retentionRate: number;
    newUsersThisMonth: number;
    churnRate: number;
  };
  geographic: Array<{ country: string; count: number }>;
  auctionDistribution: Array<{ status: string; count: number; name: string }>;
  auctionSuccess: {
    totalEndedAuctions: number;
    successfulAuctions: number;
    successRate: number;
    averageReserveMetPercentage: number;
  };
  vehiclePerformance: {
    averageDaysOnMarket: number;
    soldVehicles: number;
    totalVehicles: number;
    conversionRate: number;
    performanceByType: Array<{ type: string; total: number; sold: number; conversionRate: number; averagePrice: number }>;
  };
  trends: {
    userGrowth: number;
    vehicleListings: number;
    auctionActivity: number;
  };
  alerts: Array<{ type: string; title: string; message: string; severity: string }>;
}

interface AnalyticsChartsProps {
  data: ExtendedAdminStats;
  recentActivity: RecentActivity[];
  type: 'overview' | 'users' | 'vehicles' | 'performance';
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28'];

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data, recentActivity, type }) => {
  const chartConfig = {
    users: { label: "Usuarios", color: "#8884d8" },
    newUsers: { label: "Nuevos Usuarios", color: "#82ca9d" },
    active: { label: "Activos", color: "#00C49F" },
    transactions: { label: "Transacciones", color: "#ffc658" },
    revenue: { label: "Ingresos", color: "#ff7300" },
    activity: { label: "Actividad", color: "#8884d8" },
    messages: { label: "Mensajes", color: "#82ca9d" },
    count: { label: "Cantidad", color: "#8884d8" }
  };

  if (type === 'overview') {
    return (
      <div className="space-y-6">
        {/* Alertas críticas */}
        {data.alerts && data.alerts.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {data.alerts.map((alert, index) => (
              <Alert key={index} variant={alert.severity === 'high' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{alert.title}:</strong> {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Distribución de Estados de Subastas */}
          <Card>
            <CardHeader>
              <CardTitle>Estados de Subastas</CardTitle>
              <CardDescription>Distribución actual de estados de subastas</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={data.auctionDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {data.auctionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Heatmap de Actividad de Mensajes */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad de Mensajes por Hora</CardTitle>
              <CardDescription>Distribución de mensajes a lo largo del día</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={data.messageHeatmap}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-messages)" name="Mensajes" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Análisis Geográfico */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución Geográfica</CardTitle>
              <CardDescription>Usuarios por país (Top 10)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={data.geographic} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="country" type="category" width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-users)" name="Usuarios" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Actividad Reciente */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {recentActivity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.severity === 'warning' ? 'bg-yellow-500' : 
                      activity.severity === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (type === 'users') {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {/* Análisis de Retención */}
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Retención de Usuarios</CardTitle>
            <CardDescription>Métricas de retención y actividad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{data.retention.retentionRate}%</div>
                  <div className="text-sm text-muted-foreground">Tasa de Retención</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{data.retention.activeUsers}</div>
                  <div className="text-sm text-muted-foreground">Usuarios Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{data.retention.newUsersThisMonth}</div>
                  <div className="text-sm text-muted-foreground">Nuevos Este Mes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{data.retention.churnRate}%</div>
                  <div className="text-sm text-muted-foreground">Tasa de Abandono</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement de Conversaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Engagement</CardTitle>
            <CardDescription>Actividad de conversaciones y mensajes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.engagement.totalConversations}</div>
                  <div className="text-sm text-muted-foreground">Total Conversaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.engagement.activeConversations}</div>
                  <div className="text-sm text-muted-foreground">Conversaciones Activas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.engagement.averageMessagesPerConversation}</div>
                  <div className="text-sm text-muted-foreground">Mensajes por Conversación</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.engagement.totalMessages}</div>
                  <div className="text-sm text-muted-foreground">Total Mensajes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tendencias de Crecimiento */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tendencias de Crecimiento</CardTitle>
            <CardDescription>Cambios porcentuales vs mes anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  {data.trends.userGrowth > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`text-2xl font-bold ${data.trends.userGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.trends.userGrowth > 0 ? '+' : ''}{data.trends.userGrowth}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Crecimiento de Usuarios</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  {data.trends.vehicleListings > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`text-2xl font-bold ${data.trends.vehicleListings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.trends.vehicleListings > 0 ? '+' : ''}{data.trends.vehicleListings}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Listados de Vehículos</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  {data.trends.auctionActivity > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`text-2xl font-bold ${data.trends.auctionActivity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.trends.auctionActivity > 0 ? '+' : ''}{data.trends.auctionActivity}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Actividad de Subastas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === 'vehicles') {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance de Vehículos */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento de Vehículos</CardTitle>
            <CardDescription>Métricas de performance y conversión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.vehiclePerformance.averageDaysOnMarket}</div>
                  <div className="text-sm text-muted-foreground">Días Promedio en Mercado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.vehiclePerformance.conversionRate}%</div>
                  <div className="text-sm text-muted-foreground">Tasa de Conversión</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.vehiclePerformance.soldVehicles}</div>
                  <div className="text-sm text-muted-foreground">Vehículos Vendidos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.vehiclePerformance.totalVehicles}</div>
                  <div className="text-sm text-muted-foreground">Total Vehículos</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Performance por Tipo de Vehículo</CardTitle>
            <CardDescription>Análisis de conversión por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={data.vehiclePerformance.performanceByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="total" fill="var(--color-users)" name="Total" />
                <Bar dataKey="sold" fill="var(--color-active)" name="Vendidos" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Éxito de Subastas */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Análisis de Éxito de Subastas</CardTitle>
            <CardDescription>Métricas de rendimiento de subastas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{data.auctionSuccess.totalEndedAuctions}</div>
                <div className="text-sm text-muted-foreground">Subastas Terminadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.auctionSuccess.successfulAuctions}</div>
                <div className="text-sm text-muted-foreground">Subastas Exitosas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.auctionSuccess.successRate}%</div>
                <div className="text-sm text-muted-foreground">Tasa de Éxito</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{data.auctionSuccess.averageReserveMetPercentage}%</div>
                <div className="text-sm text-muted-foreground">Promedio vs Reserva</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === 'performance') {
    return (
      <div className="grid gap-6 md:grid-cols-1">
        {/* Métricas Combinadas de Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard de Performance General</CardTitle>
            <CardDescription>Vista consolidada de todas las métricas clave</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.users.total}</div>
                <div className="text-sm text-muted-foreground">Total Usuarios</div>
                <div className="text-xs text-green-600">+{data.trends.userGrowth}% vs mes anterior</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.vehicles.total}</div>
                <div className="text-sm text-muted-foreground">Vehículos Activos</div>
                <div className="text-xs text-green-600">+{data.trends.vehicleListings}% vs mes anterior</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.conversations.active}</div>
                <div className="text-sm text-muted-foreground">Conversaciones Activas</div>
                <div className="text-xs text-blue-600">{data.engagement.averageMessagesPerConversation} msgs promedio</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{data.transactions.completed}</div>
                <div className="text-sm text-muted-foreground">Transacciones Completadas</div>
                <div className="text-xs text-green-600">{data.vehiclePerformance.conversionRate}% tasa conversión</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default AnalyticsCharts;
