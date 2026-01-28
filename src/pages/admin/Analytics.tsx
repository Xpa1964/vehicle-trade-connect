
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Car, ArrowLeft, Download, Filter, Calendar } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { useAdminStatistics } from '@/hooks/useAdminStatistics';
import AnalyticsCharts from '@/components/admin/analytics/AnalyticsCharts';
import AnalyticsKPIs from '@/components/admin/analytics/AnalyticsKPIs';
import AnalyticsFilters from '@/components/admin/analytics/AnalyticsFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminAnalyticsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { stats, structuredStats, extendedStats, recentActivity, isLoading, error } = useAdminStatistics();
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });
  const [selectedMetrics, setSelectedMetrics] = useState('all');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analítica Avanzada"
          description="Cargando datos analíticos..."
          showBackButton={true}
          backTo="/admin/dashboard"
          backText="Volver al Dashboard"
          icon={<BarChart3 className="h-8 w-8" />}
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-auto-blue"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analítica Avanzada"
          description="Error al cargar datos analíticos"
          showBackButton={true}
          backTo="/admin/dashboard"
          backText="Volver al Dashboard"
          icon={<BarChart3 className="h-8 w-8" />}
        />
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analítica Avanzada"
        description="Visualiza estadísticas detalladas y KPIs del marketplace con datos en tiempo real"
        showBackButton={true}
        backTo="/admin/dashboard"
        backText="Volver al Dashboard"
        icon={<BarChart3 className="h-8 w-8" />}
      />

      {/* Filtros y Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <AnalyticsFilters 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedMetrics={selectedMetrics}
            onMetricsChange={setSelectedMetrics}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* KPIs Principales */}
      <AnalyticsKPIs stats={structuredStats} />

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsCharts 
            data={extendedStats} 
            recentActivity={recentActivity}
            type="overview"
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <AnalyticsCharts 
            data={extendedStats} 
            recentActivity={recentActivity}
            type="users"
          />
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <AnalyticsCharts 
            data={extendedStats} 
            recentActivity={recentActivity}
            type="vehicles"
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <AnalyticsCharts 
            data={extendedStats} 
            recentActivity={recentActivity}
            type="performance"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsPage;
