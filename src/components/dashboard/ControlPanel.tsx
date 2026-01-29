import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Car, RefreshCw, BarChart3, 
  Truck, Calculator, BookOpen, Coins, 
  Plus, Eye, Settings, Key
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReportRequestForm } from '@/components/vehicle-reports/ReportRequestForm';
import RegistryImage from '@/components/shared/RegistryImage';

const ControlPanel: React.FC = () => {
  const { t } = useLanguage();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  // Acciones principales con diseño minimalista
  const primaryActions = [
    {
      title: t('services.vehicleGallery'),
      icon: Car,
      description: t('control.vehiclesDescription'),
      link: '/vehicles',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.vehicles'
    },
    {
      title: t('quickActions.publishVehicle'),
      icon: Plus,
      description: t('quickActions.publishVehicleDescription'),
      link: '/vehicle-management',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.publish.vehicle'
    },
    {
      title: t('nav.exchanges'),
      icon: null,
      description: t('dashboard.exchangesDescription'),
      link: '/exchanges',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.exchanges'
    },
    {
      title: t('quickActions.publishExchange'),
      icon: null,
      description: t('quickActions.publishExchangeDescription'),
      link: '/exchange-form',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.publish.exchange'
    },
    {
      title: t('nav.auctionRoom'),
      icon: null,
      description: t('control.auctionRoomDescription'),
      link: '/auctions',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.auctions'
    },
    {
      title: t('nav.publishAuction'),
      icon: null,
      description: t('control.publishAuctionDescription'),
      link: '/publish-auction',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.auctions'
    }
  ];

  const communicationActions = [
    {
      title: t('nav.bulletinBoard'),
      icon: null,
      description: t('control.bulletinDescription'),
      link: '/bulletin',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.bulletin'
    },
    {
      title: t('quickActions.publishAnnouncement'),
      icon: null,
      description: t('control.publishAnnouncementDescription'),
      link: '/publish-announcement',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.publish.announcement'
    }
  ];

  const serviceActions = [
    {
      title: t('nav.transportQuotes'),
      icon: null,
      description: t('control.transportQuotesDescription'),
      link: '/transport-quotes',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.transport'
    },
    {
      title: t('quickActions.quoteTransport'),
      icon: null,
      description: t('control.quoteTransportDescription'),
      link: '/transport',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.quote.transport'
    },
    {
      title: t('nav.vehicleReports'),
      icon: BarChart3,
      description: t('dashboard.reportsDescription'),
      link: '/vehicle-reports',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.reports'
    },
    {
      title: t('quickActions.requestReport'),
      icon: Eye,
      description: t('quickActions.requestReportDescription'),
      link: '/vehicle-reports',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.request.report',
      isReportRequest: true
    }
  ];

  // Herramientas con diseño minimalista
  const toolsSection = [
    {
      title: t('nav.importCalculator'),
      icon: Calculator,
      description: t('calculator.subtitle', { fallback: 'Calcula costes de importación de vehículos' }),
      link: '/import-calculator',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.import.calculator'
    },
    {
      title: t('nav.commissionCalculator'),
      icon: Coins,
      description: t('dashboard.commissionCalculatorDescription'),
      link: '/commission-calculator',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.commission.calculator'
    },
    {
      title: t('nav.blog'),
      icon: BookOpen,
      description: t('control.blogDescription'),
      link: '/blog',
      iconColor: 'text-muted-foreground',
      registryId: 'dashboard.blog'
    },
    {
      title: t('api.card.title'),
      icon: Key,
      description: t('api.card.description'),
      link: '/api-management',
      iconColor: 'text-muted-foreground',
      registryId: null // API uses icon only
    }
  ];

  // Función para estilos minimalistas unificados
  const getMinimalStyles = () => ({
    card: 'card-minimal',
    iconContainer: 'icon-container-minimal',
    titleHover: 'group-hover:text-foreground'
  });
  
  // Función para renderizar sección de acciones
  const renderActionSection = (actions: any[], title: string) => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          {title}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action, index) => {
          const styles = getMinimalStyles();
          const isReportRequest = action.isReportRequest;
          
          const cardContent = (
            <Card className={`h-full transition-all duration-300 hover:scale-[1.01] ${styles.card}`}>
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className={`transition-all duration-300 group-hover:scale-105 ${styles.iconContainer}`}>
                    {action.registryId ? (
                      <RegistryImage 
                        imageId={action.registryId}
                        alt={action.title}
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : action.icon ? (
                      <action.icon className={`w-12 h-12 ${action.iconColor} group-hover:text-foreground`} strokeWidth={0.8} />
                    ) : null}
                  </div>
                </div>
                <h4 className={`text-lg font-semibold text-foreground mb-4 transition-colors duration-300 ${styles.titleHover}`}>
                  {action.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          );
          
          return isReportRequest ? (
            <div 
              key={index} 
              className="group block cursor-pointer"
              onClick={() => setIsReportDialogOpen(true)}
            >
              {cardContent}
            </div>
          ) : (
            <Link key={index} to={action.link} className="group block">
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Header Profesional del Panel de Control */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="icon-container-minimal">
            <Settings className="h-8 w-8 text-auto-blue" strokeWidth={0.8} />
          </div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            {t('control.title')}
          </h2>
        </div>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {t('dashboard.controlPanelDescription')}
        </p>
      </div>

      {/* Acciones Principales */}
      {renderActionSection(primaryActions, t('control.primaryFunctions'))}

      {/* Comunicación y Anuncios */}
      {renderActionSection(communicationActions, t('control.communication'))}

      {/* Servicios */}
      {renderActionSection(serviceActions, t('control.services'))}

      {/* Herramientas con Diseño Diferenciado */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground tracking-tight">
            {t('control.professionalTools')}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {toolsSection.map((tool, index) => {
            const styles = getMinimalStyles();
            return (
              <Link key={index} to={tool.link} className="group block">
                <Card className={`h-full transition-all duration-300 hover:scale-[1.01] ${styles.card}`}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className={`transition-all duration-300 group-hover:scale-105 ${styles.iconContainer}`}>
                        {tool.registryId ? (
                          <RegistryImage 
                            imageId={tool.registryId}
                            alt={tool.title}
                            className="w-28 h-28 rounded-full object-cover"
                          />
                        ) : (
                          <tool.icon className={`w-10 h-10 ${tool.iconColor} group-hover:text-foreground`} strokeWidth={0.8} />
                        )}
                      </div>
                    </div>
                    <h4 className={`text-base font-semibold text-foreground mb-3 transition-colors duration-300 ${styles.titleHover}`}>
                      {tool.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dialog para Solicitar Informe */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('reports.form.title')}</DialogTitle>
          </DialogHeader>
          <ReportRequestForm onSuccess={() => setIsReportDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ControlPanel;
