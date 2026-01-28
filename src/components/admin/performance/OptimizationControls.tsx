import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Zap, Database, Activity, RotateCcw, AlertTriangle } from 'lucide-react';
import { PerformanceMetrics, PerformanceAlert } from '@/hooks/usePerformanceMonitor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OptimizationControlsProps {
  currentMetrics: PerformanceMetrics;
  alerts: PerformanceAlert[];
}

const OptimizationControls: React.FC<OptimizationControlsProps> = ({
  currentMetrics,
  alerts
}) => {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [optimizations, setOptimizations] = useState({
    reactQuery: false,
    realtime: false,
    database: false
  });
  const [isApplying, setIsApplying] = useState(false);

  const getRecommendedOptimizations = () => {
    const recommendations = [];

    if (currentMetrics.activeUsers >= 25) {
      recommendations.push({
        type: 'reactQuery',
        title: 'React Query Optimization',
        description: 'Increase staleTime to 30 seconds, reduce refetch frequency',
        impact: 'Medium',
        users: currentMetrics.activeUsers
      });
    }

    if (currentMetrics.activeUsers >= 50) {
      recommendations.push({
        type: 'realtime',
        title: 'Realtime Optimization',
        description: 'Consolidate channels, enable throttling',
        impact: 'High',
        users: currentMetrics.activeUsers
      });
    }

    if (currentMetrics.activeUsers >= 75) {
      recommendations.push({
        type: 'database',
        title: 'Database Optimization',
        description: 'Add indexes, enable query caching',
        impact: 'High',
        users: currentMetrics.activeUsers
      });
    }

    return recommendations;
  };

  const applyOptimization = async (type: string, enable: boolean) => {
    setIsApplying(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('performance-optimizer', {
        body: {
          optimization_type: type,
          action: enable ? 'enable' : 'disable',
          level: isAutoMode ? 'aggressive' : 'moderate'
        },
        headers: {
          'x-user-id': userData.user?.id || ''
        }
      });

      if (error) throw error;

      setOptimizations(prev => ({
        ...prev,
        [type]: enable
      }));

      // Apply client-side optimizations if React Query
      if (type === 'reactQuery' && enable) {
        const { performanceOptimizer } = await import('@/lib/performanceOptimizer');
        performanceOptimizer.applyReactQueryOptimization(isAutoMode ? 'aggressive' : 'moderate');
      } else if (type === 'reactQuery' && !enable) {
        const { performanceOptimizer } = await import('@/lib/performanceOptimizer');
        performanceOptimizer.rollbackReactQueryOptimization();
      }

      toast.success(
        `${type} optimization ${enable ? 'enabled' : 'disabled'} successfully`,
        { description: data?.recommendations ? `Applied ${Object.keys(data.recommendations).length} config changes` : undefined }
      );
    } catch (error) {
      console.error('Error applying optimization:', error);
      toast.error(`Failed to ${enable ? 'apply' : 'disable'} optimization: ${error.message}`);
    } finally {
      setIsApplying(false);
    }
  };

  const rollbackOptimizations = async () => {
    setIsApplying(true);
    
    try {
      const rollbackPromises = Object.entries(optimizations)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([type]) => applyOptimization(type, false));
      
      await Promise.all(rollbackPromises);
      
      toast.success('All optimizations rolled back successfully');
    } catch (error) {
      console.error('Error during rollback:', error);
      toast.error('Failed to rollback some optimizations');
    } finally {
      setIsApplying(false);
    }
  };

  const recommendations = getRecommendedOptimizations();
  const hasActiveOptimizations = Object.values(optimizations).some(Boolean);
  const criticalAlerts = alerts.filter(a => a.alertType === 'critical');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Optimization Controls
            </CardTitle>
            <CardDescription>
              Manual and automatic performance optimizations
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-mode"
                checked={isAutoMode}
                onCheckedChange={setIsAutoMode}
              />
              <label htmlFor="auto-mode" className="text-sm font-medium">
                Auto Mode
              </label>
            </div>
            
            {hasActiveOptimizations && (
              <Button
                variant="outline"
                size="sm"
                onClick={rollbackOptimizations}
                disabled={isApplying}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Rollback All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="recommendations">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">
              Recommendations ({recommendations.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({Object.values(optimizations).filter(Boolean).length})
            </TabsTrigger>
            <TabsTrigger value="manual">
              Manual Controls
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No optimizations needed at current load</p>
                <p className="text-sm">System is running optimally</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.type}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge variant={rec.impact === 'High' ? 'default' : 'secondary'}>
                          {rec.impact} Impact
                        </Badge>
                        {rec.users >= 100 && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Critical
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Triggered by {rec.users} active users
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {optimizations[rec.type as keyof typeof optimizations] ? (
                        <Badge variant="outline">Applied</Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => applyOptimization(rec.type, true)}
                          disabled={isApplying}
                          variant={rec.users >= 100 ? 'default' : 'outline'}
                        >
                          {isApplying ? 'Applying...' : 'Apply'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {!hasActiveOptimizations ? (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active optimizations</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(optimizations).map(([type, isEnabled]) => {
                  if (!isEnabled) return null;
                  
                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <div>
                          <h4 className="font-medium capitalize">{type} Optimization</h4>
                          <p className="text-sm text-muted-foreground">
                            Currently active and improving performance
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyOptimization(type, false)}
                        disabled={isApplying}
                      >
                        Disable
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    React Query
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Optimization</span>
                      <Switch
                        checked={optimizations.reactQuery}
                        onCheckedChange={(checked) => applyOptimization('reactQuery', checked)}
                        disabled={isApplying}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Increase cache times and reduce refetch frequency
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Realtime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Optimization</span>
                      <Switch
                        checked={optimizations.realtime}
                        onCheckedChange={(checked) => applyOptimization('realtime', checked)}
                        disabled={isApplying}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Consolidate channels and enable throttling
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Optimization</span>
                      <Switch
                        checked={optimizations.database}
                        onCheckedChange={(checked) => applyOptimization('database', checked)}
                        disabled={isApplying}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add indexes and enable query caching
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {criticalAlerts.length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h4 className="font-medium text-red-800">Critical Performance Issue</h4>
            </div>
            <p className="text-sm text-red-700 mb-3">
              Your system is experiencing critical load. Immediate optimization is recommended.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                recommendations.forEach(rec => {
                  applyOptimization(rec.type, true);
                });
              }}
              disabled={isApplying}
            >
              Apply All Critical Optimizations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationControls;