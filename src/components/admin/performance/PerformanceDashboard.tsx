import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Activity, Users, Database, Zap, Play, Square, RefreshCw } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useWebVitalsMonitor } from '@/hooks/useWebVitalsMonitor';
import { useLanguage } from '@/contexts/LanguageContext';
import MetricsChart from './MetricsChart';
import AlertsPanel from './AlertsPanel';
import OptimizationControls from './OptimizationControls';
import InfoPanel from './InfoPanel';
import WebVitalsChart from './WebVitalsChart';

const PerformanceDashboard: React.FC = () => {
  const { t } = useLanguage();
  const {
    metrics,
    alerts,
    historicalMetrics,
    activeAlerts,
    isCollecting,
    isLoadingHistory,
    isLoadingAlerts,
    startMonitoring,
    stopMonitoring,
    sendMetricsToServer
  } = usePerformanceMonitor();

  const {
    currentMetrics: webVitals,
    ratings: webVitalsRatings,
    history: webVitalsHistory,
    formatMetricValue
  } = useWebVitalsMonitor();

  const getStatusBadgeVariant = (value: number, thresholds: { yellow: number; red: number; critical: number }) => {
    if (value >= thresholds.critical) return 'destructive';
    if (value >= thresholds.red) return 'secondary';
    if (value >= thresholds.yellow) return 'default';
    return 'outline';
  };

  const getStatusText = (value: number, thresholds: { yellow: number; red: number; critical: number }) => {
    if (value >= thresholds.critical) return t('performance.status.critical');
    if (value >= thresholds.red) return t('performance.status.veryHigh');
    if (value >= thresholds.yellow) return t('performance.status.high');
    return t('performance.status.normal');
  };

  const getStatusColor = (value: number, thresholds: { yellow: number; red: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600 bg-red-50 border-red-200';
    if (value >= thresholds.red) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (value >= thresholds.yellow) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('performance.title')}</h1>
          <p className="text-muted-foreground">
            {t('performance.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isCollecting ? 'default' : 'secondary'} className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {isCollecting ? t('performance.monitoring.active') : t('performance.monitoring.stopped')}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={isCollecting ? stopMonitoring : startMonitoring}
          >
            {isCollecting ? <Square className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isCollecting ? t('performance.button.stop') : t('performance.button.start')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={sendMetricsToServer}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            {t('performance.button.sync')}
          </Button>
        </div>
      </div>

      {/* Info Panel */}
      <InfoPanel />

      {/* Alerts Panel */}
      {(alerts.length > 0 || (activeAlerts && activeAlerts.length > 0)) && (
        <AlertsPanel 
          currentAlerts={alerts} 
          historicalAlerts={activeAlerts} 
          isLoading={isLoadingAlerts}
        />
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('performance.metrics.activeUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrics.activeUsers}</div>
              <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(metrics.activeUsers, { yellow: 25, red: 50, critical: 100 })}`}>
                {getStatusText(metrics.activeUsers, { yellow: 25, red: 50, critical: 100 })}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('performance.desc.activeUsers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('performance.metrics.activeQueries')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrics.activeQueries}</div>
              <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(metrics.activeQueries, { yellow: 20, red: 50, critical: 100 })}`}>
                {getStatusText(metrics.activeQueries, { yellow: 20, red: 50, critical: 100 })}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('performance.desc.activeQueries')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('performance.metrics.realtimeChannels')}</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrics.realtimeChannels}</div>
              <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(metrics.realtimeChannels, { yellow: 10, red: 25, critical: 50 })}`}>
                {getStatusText(metrics.realtimeChannels, { yellow: 10, red: 25, critical: 50 })}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('performance.desc.realtimeChannels')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('performance.metrics.memoryUsage')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{formatBytes(metrics.memoryUsage * 1024 * 1024)}</div>
              <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(metrics.memoryUsage, { yellow: 250, red: 500, critical: 1000 })}`}>
                {getStatusText(metrics.memoryUsage, { yellow: 250, red: 500, critical: 1000 })}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('performance.desc.memoryUsage')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('performance.chart.userActivity')}</CardTitle>
            <CardDescription>
              {t('performance.chart.userActivityDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetricsChart 
              data={historicalMetrics || []} 
              dataKey="active_users"
              color="#8884d8"
              isLoading={isLoadingHistory}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('performance.chart.systemPerformance')}</CardTitle>
            <CardDescription>
              {t('performance.chart.systemPerformanceDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetricsChart 
              data={historicalMetrics || []} 
              dataKey="average_response_time"
              secondaryKey="memory_usage"
              color="#82ca9d"
              secondaryColor="#ffc658"
              isLoading={isLoadingHistory}
            />
          </CardContent>
        </Card>
      </div>

      {/* Core Web Vitals Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('performance.webVitals.title')}</h2>
        
        {/* Web Vitals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('performance.webVitals.cls')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {formatMetricValue('CLS', webVitals.CLS)}
                </div>
                <Badge 
                  variant={
                    webVitalsRatings.CLS === 'good' ? 'default' : 
                    webVitalsRatings.CLS === 'needs-improvement' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {webVitalsRatings.CLS === 'good' && t('performance.webVitals.good')}
                  {webVitalsRatings.CLS === 'needs-improvement' && t('performance.webVitals.needsImprovement')}
                  {webVitalsRatings.CLS === 'poor' && t('performance.webVitals.poor')}
                  {webVitalsRatings.CLS === 'unknown' && 'N/A'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('performance.webVitals.desc.cls')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('performance.webVitals.inp')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {formatMetricValue('INP', webVitals.INP)}
                </div>
                <Badge 
                  variant={
                    webVitalsRatings.INP === 'good' ? 'default' : 
                    webVitalsRatings.INP === 'needs-improvement' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {webVitalsRatings.INP === 'good' && t('performance.webVitals.good')}
                  {webVitalsRatings.INP === 'needs-improvement' && t('performance.webVitals.needsImprovement')}
                  {webVitalsRatings.INP === 'poor' && t('performance.webVitals.poor')}
                  {webVitalsRatings.INP === 'unknown' && 'N/A'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('performance.webVitals.desc.inp')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('performance.webVitals.lcp')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {formatMetricValue('LCP', webVitals.LCP)}
                </div>
                <Badge 
                  variant={
                    webVitalsRatings.LCP === 'good' ? 'default' : 
                    webVitalsRatings.LCP === 'needs-improvement' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {webVitalsRatings.LCP === 'good' && t('performance.webVitals.good')}
                  {webVitalsRatings.LCP === 'needs-improvement' && t('performance.webVitals.needsImprovement')}
                  {webVitalsRatings.LCP === 'poor' && t('performance.webVitals.poor')}
                  {webVitalsRatings.LCP === 'unknown' && 'N/A'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('performance.webVitals.desc.lcp')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('performance.webVitals.ttfb')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {formatMetricValue('TTFB', webVitals.TTFB)}
                </div>
                <Badge 
                  variant={
                    webVitalsRatings.TTFB === 'good' ? 'default' : 
                    webVitalsRatings.TTFB === 'needs-improvement' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {webVitalsRatings.TTFB === 'good' && t('performance.webVitals.good')}
                  {webVitalsRatings.TTFB === 'needs-improvement' && t('performance.webVitals.needsImprovement')}
                  {webVitalsRatings.TTFB === 'poor' && t('performance.webVitals.poor')}
                  {webVitalsRatings.TTFB === 'unknown' && 'N/A'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('performance.webVitals.desc.ttfb')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Web Vitals Chart */}
        <WebVitalsChart data={webVitalsHistory} />
      </div>

      {/* Optimization Controls */}
      <OptimizationControls 
        currentMetrics={metrics}
        alerts={alerts}
      />

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>{t('performance.system.title')}</CardTitle>
          <CardDescription>
            {t('performance.system.desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                <span className="font-medium">{t('performance.system.monitoringActive')}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {t('performance.system.collectingMetrics')}
              </div>
            </div>

            {metrics.activeUsers >= 25 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">{t('performance.system.optimizationRecommended')}</span>
                </div>
                <div className="text-sm text-yellow-700">
                  {t('performance.system.optimizationRecommendedDesc')}
                </div>
              </div>
            )}

            {metrics.activeUsers >= 50 && (
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">{t('performance.system.highLoad')}</span>
                </div>
                <div className="text-sm text-red-700">
                  {t('performance.system.highLoadDesc')}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              {t('performance.system.lastUpdated')}: {new Date(metrics.timestamp).toLocaleString()}<br />
              {t('performance.system.nextCheck')}: {metrics.activeUsers >= 25 ? t('performance.system.ready') : t('performance.system.moreUsers', { count: 25 - metrics.activeUsers })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;