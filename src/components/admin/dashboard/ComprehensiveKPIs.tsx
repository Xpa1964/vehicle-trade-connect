
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, TrendingDown, Users, Car, MessageSquare, DollarSign, 
  Activity, Target, Clock, ThumbsUp, MapPin, Zap, AlertTriangle,
  UserCheck, Timer, Calculator, Truck, FileText, Shield
} from 'lucide-react';

interface ComprehensiveKPIsProps {
  kpiData: {
    // Acquisition KPIs
    totalRegistrations: number;
    verifiedAccounts: number;
    avgVerificationTime: number;
    registrationConversionRate: number;
    
    // Engagement KPIs
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    userRetentionRate: number;
    avgSessionDuration: number;
    totalRatingsGiven: number;
    
    // Marketplace KPIs
    totalVehiclesListed: number;
    totalAdsListed: number;
    successfulTransactionsRate: number;
    avgTimeToTransaction: number;
    totalTransactionValue: number;
    avgBidsPerAuction: number;
    totalExchangeProposals: number;
    
    // Services KPIs
    totalTransportRequests: number;
    totalVehicleReports: number;
    importCalculatorUses: number;
    totalPartnerContacts: number;
    serviceConversionRate: number;
    
    // Communication KPIs
    totalChatConversations: number;
    avgMessagesPerUser: number;
    translationFeatureUses: number;
    avgSupportResponseTime: number;
    
    // Performance KPIs
    avgPageLoadTime: number;
    errorRate: number;
    formAbandonmentRate: number;
    
    // Security Alerts
    securityAlerts: Array<{
      type: string;
      severity: string;
      count: number;
      message: string;
    }>;
  };
}

const ComprehensiveKPIs: React.FC<ComprehensiveKPIsProps> = ({ kpiData }) => {
  const kpiSections = [
    {
      title: 'Adquisición y Activación',
      color: 'blue',
      kpis: [
        {
          title: 'Registros Completados',
          value: kpiData.totalRegistrations,
          icon: <Users className="h-4 w-4" />,
          trend: 5
        },
        {
          title: 'Cuentas Verificadas',
          value: kpiData.verifiedAccounts,
          icon: <UserCheck className="h-4 w-4" />,
          trend: 3
        },
        {
          title: 'Tiempo Verificación',
          value: kpiData.avgVerificationTime,
          icon: <Timer className="h-4 w-4" />,
          suffix: 'h',
          trend: -2
        },
        {
          title: 'Tasa Conversión Registro',
          value: kpiData.registrationConversionRate,
          icon: <Target className="h-4 w-4" />,
          suffix: '%',
          trend: 1
        }
      ]
    },
    {
      title: 'Compromiso y Retención',
      color: 'green',
      kpis: [
        {
          title: 'Usuarios Activos Diarios',
          value: kpiData.dailyActiveUsers,
          icon: <Zap className="h-4 w-4" />,
          trend: 8
        },
        {
          title: 'Usuarios Activos Semanales',
          value: kpiData.weeklyActiveUsers,
          icon: <Activity className="h-4 w-4" />,
          trend: 12
        },
        {
          title: 'Usuarios Activos Mensuales',
          value: kpiData.monthlyActiveUsers,
          icon: <Users className="h-4 w-4" />,
          trend: 15
        },
        {
          title: 'Tasa de Retención',
          value: kpiData.userRetentionRate,
          icon: <TrendingUp className="h-4 w-4" />,
          suffix: '%',
          trend: 4
        },
        {
          title: 'Duración Sesión Promedio',
          value: kpiData.avgSessionDuration,
          icon: <Clock className="h-4 w-4" />,
          suffix: 'min',
          trend: 2
        },
        {
          title: 'Valoraciones Realizadas',
          value: kpiData.totalRatingsGiven,
          icon: <ThumbsUp className="h-4 w-4" />,
          trend: 7
        }
      ]
    },
    {
      title: 'Actividad del Marketplace',
      color: 'purple',
      kpis: [
        {
          title: 'Vehículos Publicados',
          value: kpiData.totalVehiclesListed,
          icon: <Car className="h-4 w-4" />,
          trend: 6
        },
        {
          title: 'Anuncios Publicados',
          value: kpiData.totalAdsListed,
          icon: <FileText className="h-4 w-4" />,
          trend: 4
        },
        {
          title: 'Tasa Éxito Transacciones',
          value: kpiData.successfulTransactionsRate,
          icon: <Target className="h-4 w-4" />,
          suffix: '%',
          trend: 3
        },
        {
          title: 'Tiempo Promedio a Venta',
          value: kpiData.avgTimeToTransaction,
          icon: <Timer className="h-4 w-4" />,
          suffix: 'd',
          trend: -5
        },
        {
          title: 'Valor Total Transacciones',
          value: kpiData.totalTransactionValue,
          icon: <DollarSign className="h-4 w-4" />,
          prefix: '€',
          trend: 10
        },
        {
          title: 'Pujas por Subasta',
          value: kpiData.avgBidsPerAuction,
          icon: <TrendingUp className="h-4 w-4" />,
          trend: 8
        },
        {
          title: 'Propuestas Intercambio',
          value: kpiData.totalExchangeProposals,
          icon: <Activity className="h-4 w-4" />,
          trend: 12
        }
      ]
    },
    {
      title: 'Servicios Auxiliares',
      color: 'orange',
      kpis: [
        {
          title: 'Solicitudes Transporte',
          value: kpiData.totalTransportRequests,
          icon: <Truck className="h-4 w-4" />,
          trend: 0
        },
        {
          title: 'Informes Solicitados',
          value: kpiData.totalVehicleReports,
          icon: <FileText className="h-4 w-4" />,
          trend: 0
        },
        {
          title: 'Usos Calculadora',
          value: kpiData.importCalculatorUses,
          icon: <Calculator className="h-4 w-4" />,
          trend: 5
        },
        {
          title: 'Contactos Partners',
          value: kpiData.totalPartnerContacts,
          icon: <MapPin className="h-4 w-4" />,
          trend: 3
        },
        {
          title: 'Conversión Servicios',
          value: kpiData.serviceConversionRate,
          icon: <Target className="h-4 w-4" />,
          suffix: '%',
          trend: 2
        }
      ]
    },
    {
      title: 'Comunicación',
      color: 'cyan',
      kpis: [
        {
          title: 'Conversaciones Chat',
          value: kpiData.totalChatConversations,
          icon: <MessageSquare className="h-4 w-4" />,
          trend: 8
        },
        {
          title: 'Mensajes por Usuario',
          value: kpiData.avgMessagesPerUser,
          icon: <Activity className="h-4 w-4" />,
          trend: 6
        },
        {
          title: 'Usos Traducción',
          value: kpiData.translationFeatureUses,
          icon: <MapPin className="h-4 w-4" />,
          trend: 15
        },
        {
          title: 'Tiempo Respuesta Soporte',
          value: kpiData.avgSupportResponseTime,
          icon: <Clock className="h-4 w-4" />,
          suffix: 'h',
          trend: -3
        }
      ]
    },
    {
      title: 'Rendimiento y Usabilidad',
      color: 'red',
      kpis: [
        {
          title: 'Tiempo Carga Páginas',
          value: kpiData.avgPageLoadTime,
          icon: <Zap className="h-4 w-4" />,
          suffix: 's',
          trend: -1
        },
        {
          title: 'Tasa de Errores',
          value: kpiData.errorRate,
          icon: <AlertTriangle className="h-4 w-4" />,
          suffix: '%',
          trend: -2
        },
        {
          title: 'Abandono Formularios',
          value: kpiData.formAbandonmentRate,
          icon: <TrendingDown className="h-4 w-4" />,
          suffix: '%',
          trend: -4
        }
      ]
    }
  ];

  const formatValue = (kpi: any) => {
    let formattedValue = '';
    
    if (kpi.prefix) {
      formattedValue = `${kpi.prefix}${kpi.value.toLocaleString()}`;
    } else {
      formattedValue = kpi.value.toLocaleString();
    }
    
    if (kpi.suffix) {
      formattedValue += kpi.suffix;
    }
    
    return formattedValue;
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-l-blue-500 bg-blue-50',
      green: 'border-l-green-500 bg-green-50',
      purple: 'border-l-purple-500 bg-purple-50',
      orange: 'border-l-orange-500 bg-orange-50',
      cyan: 'border-l-cyan-500 bg-cyan-50',
      red: 'border-l-red-500 bg-red-50'
    };
    return colorMap[color as keyof typeof colorMap] || 'border-l-gray-500 bg-gray-50';
  };

  return (
    <div className="space-y-8">
      {/* Alertas de Seguridad */}
      {kpiData.securityAlerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Alertas de Seguridad
          </h3>
          {kpiData.securityAlerts.map((alert, index) => (
            <Alert key={index} variant={alert.severity === 'high' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{alert.message}</span>
                <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Secciones de KPIs */}
      {kpiSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {section.kpis.map((kpi, index) => (
              <Card key={index} className={`border-l-4 ${getColorClasses(section.color)}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {kpi.title}
                  </CardTitle>
                  <div className="text-gray-600">
                    {kpi.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatValue(kpi)}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                    {kpi.trend > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : kpi.trend < 0 ? (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    ) : (
                      <Activity className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={kpi.trend > 0 ? 'text-green-600' : kpi.trend < 0 ? 'text-red-600' : 'text-gray-600'}>
                      {kpi.trend !== 0 ? `${Math.abs(kpi.trend)}%` : 'Sin cambios'}
                    </span>
                    <span>vs período anterior</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComprehensiveKPIs;
