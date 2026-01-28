import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, XCircle, X } from 'lucide-react';
import { PerformanceAlert } from '@/hooks/usePerformanceMonitor';

interface AlertsPanelProps {
  currentAlerts: PerformanceAlert[];
  historicalAlerts?: any[];
  isLoading?: boolean;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  currentAlerts,
  historicalAlerts = [],
  isLoading = false
}) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-4 w-4" />;
      case 'red':
        return <AlertTriangle className="h-4 w-4" />;
      case 'yellow':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'red':
        return 'secondary';
      case 'yellow':
        return 'default';
      default:
        return 'outline';
    }
  };

  const allAlerts = [
    ...currentAlerts.map(alert => ({ ...alert, source: 'current' })),
    ...historicalAlerts.map(alert => ({ ...alert, source: 'historical' }))
  ].sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());

  if (allAlerts.length === 0) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-yellow-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Performance Alerts
            </CardTitle>
            <CardDescription>
              Current and recent performance warnings
            </CardDescription>
          </div>
          <Badge variant="outline">
            {allAlerts.filter(a => a.isActive || a.is_active).length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {allAlerts.slice(0, 10).map((alert, index) => (
            <div
              key={alert.id || index}
              className={`flex items-start justify-between p-3 rounded-lg border ${
                alert.alertType === 'critical' || alert.alert_type === 'critical'
                  ? 'bg-red-50 border-red-200'
                  : alert.alertType === 'red' || alert.alert_type === 'red'
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className={`mt-0.5 ${
                  alert.alertType === 'critical' || alert.alert_type === 'critical'
                    ? 'text-red-600'
                    : alert.alertType === 'red' || alert.alert_type === 'red'
                    ? 'text-orange-600'
                    : 'text-yellow-600'
                }`}>
                  {getAlertIcon(alert.alertType || alert.alert_type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getAlertVariant(alert.alertType || alert.alert_type)}>
                      {(alert.alertType || alert.alert_type).toUpperCase()}
                    </Badge>
                    {alert.source === 'current' && (
                      <Badge variant="outline" className="text-xs">
                        Live
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                    <span>
                      Current: {alert.currentValue || alert.current_value}
                    </span>
                    <span>
                      Threshold: {alert.thresholdValue || alert.threshold_value}
                    </span>
                    <span>
                      {new Date(alert.createdAt || alert.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {alert.source === 'current' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => {
                    // In a real implementation, you would dismiss the alert
                    console.log('Dismiss alert:', alert.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          {allAlerts.length > 10 && (
            <div className="text-center py-2">
              <Button variant="ghost" size="sm">
                View {allAlerts.length - 10} more alerts
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;