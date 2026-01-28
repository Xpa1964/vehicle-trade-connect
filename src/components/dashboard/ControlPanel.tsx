import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car, RefreshCw, Volume2, BarChart3, 
  Truck, Calculator, BookOpen, Coins, 
  Plus, MessageCircle, FileText,
  Eye, Settings, Gavel, Upload
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReportRequestForm } from '@/components/vehicle-reports/ReportRequestForm';
import { Key } from 'lucide-react';

import transportImage from '@/assets/transport-image.png';
import transportQuotesImage from '@/assets/transport-quotes-image.png';
import bulletinImage from '@/assets/bulletin-image.png';
import announcementImage from '@/assets/announcement-image.png';
import importCalculatorImage from '@/assets/import-calculator-image.png';
import commissionCalculatorImage from '@/assets/commission-calculator-image.png';
import blogImage from '@/assets/blog-image.png';
import vehiclesImage from '@/assets/vehicles-image.png';
import publishVehicleImage from '@/assets/publish-vehicle-image.png';
import requestReportImage from '@/assets/request-report-image.png';
import reportDeliveryImage from '@/assets/report-delivery-image.png';
import auctionRoomImage from '@/assets/auction-room-image.png';
import vehicleGalleryImage from '@/assets/vehicle-gallery-image.png';

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
      isVehiclesImage: true
    },
    {
      title: t('quickActions.publishVehicle'),
      icon: Plus,
      description: t('quickActions.publishVehicleDescription'),
      link: '/vehicle-management',
      iconColor: 'text-muted-foreground',
      isPublishVehicleImage: true
    },
    {
      title: t('nav.exchanges'),
      icon: null,
      description: t('dashboard.exchangesDescription'),
      link: '/exchanges',
      iconColor: 'text-muted-foreground',
      isExchangeImage: true
    },
    {
      title: t('quickActions.publishExchange'),
      icon: null,
      description: t('quickActions.publishExchangeDescription'),
      link: '/exchange-form',
      iconColor: 'text-muted-foreground',
      isExchangeImage: true
    },
    {
      title: t('nav.auctionRoom'),
      icon: null,
      description: t('control.auctionRoomDescription'),
      link: '/auctions',
      iconColor: 'text-muted-foreground',
      isAuctionRoomImage: true
    },
    {
      title: t('nav.publishAuction'),
      icon: null,
      description: t('control.publishAuctionDescription'),
      link: '/publish-auction',
      iconColor: 'text-muted-foreground',
      isPublishAuctionImage: true
    }
  ];

  const communicationActions = [
    {
      title: t('nav.bulletinBoard'),
      icon: null,
      description: t('control.bulletinDescription'),
      link: '/bulletin',
      iconColor: 'text-muted-foreground',
      isBulletinImage: true
    },
    {
      title: t('quickActions.publishAnnouncement'),
      icon: null,
      description: t('control.publishAnnouncementDescription'),
      link: '/publish-announcement',
      iconColor: 'text-muted-foreground',
      isAnnouncementImage: true
    }
  ];

  const serviceActions = [
    {
      title: t('nav.transportQuotes'),
      icon: null,
      description: t('control.transportQuotesDescription'),
      link: '/transport-quotes',
      iconColor: 'text-muted-foreground',
      isTransportQuotesImage: true
    },
    {
      title: t('quickActions.quoteTransport'),
      icon: null,
      description: t('control.quoteTransportDescription'),
      link: '/transport',
      iconColor: 'text-muted-foreground',
      isTransportImage: true
    },
    {
      title: t('nav.vehicleReports'),
      icon: BarChart3,
      description: t('dashboard.reportsDescription'),
      link: '/vehicle-reports',
      iconColor: 'text-muted-foreground',
      isReportDeliveryImage: true
    },
    {
      title: t('quickActions.requestReport'),
      icon: Eye,
      description: t('quickActions.requestReportDescription'),
      link: '/vehicle-reports',
      iconColor: 'text-muted-foreground',
      isRequestReportImage: true
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
      isImportCalculatorImage: true
    },
    {
      title: t('nav.commissionCalculator'),
      icon: Coins,
      description: t('dashboard.commissionCalculatorDescription'),
      link: '/commission-calculator',
      iconColor: 'text-muted-foreground',
      isCommissionCalculatorImage: true
    },
    {
      title: t('nav.blog'),
      icon: BookOpen,
      description: t('control.blogDescription'),
      link: '/blog',
      iconColor: 'text-muted-foreground',
      isBlogImage: true
    },
    {
      title: t('api.card.title'),
      icon: Key,
      description: t('api.card.description'),
      link: '/api-management',
      iconColor: 'text-muted-foreground',
      isAPIImage: false
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
          const isReportRequest = action.isRequestReportImage;
          
          const cardContent = (
            <Card className={`h-full transition-all duration-300 hover:scale-[1.01] ${styles.card}`}>
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className={`transition-all duration-300 group-hover:scale-105 ${styles.iconContainer}`}>
                    {action.isVehiclesImage ? (
                      <img 
                        src={vehicleGalleryImage} 
                        alt="Galería de vehículos disponibles para compra y venta" 
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : action.isPublishVehicleImage ? (
                      <img 
                        src={publishVehicleImage} 
                        alt="Publicar nuevo vehículo en la plataforma" 
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : action.isExchangeImage ? (
                       <img 
                         src="/lovable-uploads/exchange-new.png" 
                         alt="Intercambio de vehículos entre usuarios" 
                         className="w-28 h-28 rounded-full object-cover"
                       />
                     ) : action.isTransportQuotesImage ? (
                      <img 
                        src={transportQuotesImage} 
                        alt="Transport Quotes" 
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : action.isTransportImage ? (
                      <img 
                        src={transportImage} 
                        alt="Transport" 
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : action.isBulletinImage ? (
                      <img 
                        src="/images/bulletin-board.png" 
                        alt="Bulletin" 
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : action.isAnnouncementImage ? (
                      <img 
                        src={announcementImage} 
                        alt="Announcement" 
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : action.isRequestReportImage ? (
                      <img 
                        src={requestReportImage} 
                        alt="Request Report" 
                        className="w-28 h-28 rounded-full object-cover"
                      />
                     ) : action.isReportDeliveryImage ? (
                      <img 
                        src={reportDeliveryImage} 
                        alt="Report Delivery" 
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : action.isAuctionRoomImage ? (
                      <img 
                        src={auctionRoomImage} 
                        alt="Auction Room" 
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : action.isPublishAuctionImage ? (
                      <img 
                        src={auctionRoomImage} 
                        alt="Publicar Subasta" 
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : (
                      <action.icon className={`w-12 h-12 ${action.iconColor} group-hover:text-foreground`} strokeWidth={0.8} />
                    )}
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
                         {tool.isImportCalculatorImage ? (
                          <img 
                            src={importCalculatorImage} 
                            alt="Import Calculator" 
                            className="w-28 h-28 rounded-full object-cover"
                          />
                        ) : tool.isCommissionCalculatorImage ? (
                          <img 
                            src={commissionCalculatorImage} 
                            alt="Commission Calculator" 
                            className="w-28 h-28 rounded-full object-cover"
                          />
                        ) : tool.isBlogImage ? (
                          <img 
                            src={blogImage} 
                            alt="Blog" 
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