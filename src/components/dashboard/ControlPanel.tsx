import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReportRequestForm } from '@/components/vehicle-reports/ReportRequestForm';
import DashboardServiceCard from './DashboardServiceCard';

const ControlPanel: React.FC = () => {
  const { t } = useLanguage();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // Grid 3x3 de Service Cards según el plan aprobado
  const serviceCards = [
    // Fila 1: Vehículos, Subastas, Intercambios
    {
      imageId: 'services.showroom',
      title: t('services.vehicleGallery', { fallback: 'Vehículos' }),
      primaryAction: { 
        label: t('common.view', { fallback: 'Ver' }), 
        href: '/vehicles' 
      },
      secondaryAction: { 
        label: t('common.publish', { fallback: 'Publicar' }), 
        href: '/vehicle-management' 
      }
    },
    {
      imageId: 'services.auctions',
      title: t('nav.auctionRoom', { fallback: 'Subastas' }),
      primaryAction: { 
        label: t('common.view', { fallback: 'Ver' }), 
        href: '/auctions' 
      },
      secondaryAction: { 
        label: t('common.publish', { fallback: 'Publicar' }), 
        href: '/publish-auction' 
      }
    },
    {
      imageId: 'services.exchanges',
      title: t('nav.exchanges', { fallback: 'Intercambios' }),
      primaryAction: { 
        label: t('common.view', { fallback: 'Ver' }), 
        href: '/exchanges' 
      },
      secondaryAction: { 
        label: t('common.publish', { fallback: 'Publicar' }), 
        href: '/exchange-form' 
      }
    },
    // Fila 2: Tablón, Transporte, Informes
    {
      imageId: 'services.bulletin',
      title: t('nav.bulletinBoard', { fallback: 'Tablón de Anuncios' }),
      primaryAction: { 
        label: t('common.view', { fallback: 'Ver' }), 
        href: '/bulletin' 
      },
      secondaryAction: { 
        label: t('common.publish', { fallback: 'Publicar' }), 
        href: '/publish-announcement' 
      }
    },
    {
      imageId: 'services.transport',
      title: t('services.transport', { fallback: 'Transporte Exprés' }),
      primaryAction: { 
        label: t('common.view', { fallback: 'Ver' }), 
        href: '/transport-quotes' 
      },
      secondaryAction: { 
        label: t('common.request', { fallback: 'Solicitar' }), 
        href: '/transport' 
      }
    },
    {
      imageId: 'services.inspection',
      title: t('nav.vehicleReports', { fallback: 'Informes de Vehículos' }),
      primaryAction: { 
        label: t('common.view', { fallback: 'Ver' }), 
        href: '/vehicle-reports' 
      },
      secondaryAction: { 
        label: t('common.request', { fallback: 'Solicitar' }), 
        href: '/request-report' 
      },
      isReportRequest: true
    },
    // Fila 3: Calculadora Import, Calculadora Comisiones, Blog
    {
      imageId: 'services.calculator',
      title: t('nav.importCalculator', { fallback: 'Calculadora Importación' }),
      primaryAction: { 
        label: t('common.open', { fallback: 'Abrir' }), 
        href: '/import-calculator' 
      }
    },
    {
      imageId: 'services.calculator',
      title: t('nav.commissionCalculator', { fallback: 'Calculadora Comisiones' }),
      primaryAction: { 
        label: t('common.open', { fallback: 'Abrir' }), 
        href: '/commission-calculator' 
      }
    },
    {
      imageId: 'services.blog',
      title: t('nav.blog', { fallback: 'Blog' }),
      primaryAction: { 
        label: t('common.view', { fallback: 'Ver' }), 
        href: '/blog' 
      },
      secondaryAction: { 
        label: t('common.new', { fallback: 'Nuevo' }), 
        href: '/blog/new' 
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Grid 3 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceCards.map((card, index) => (
          <DashboardServiceCard
            key={index}
            imageId={card.imageId}
            title={card.title}
            primaryAction={card.primaryAction}
            secondaryAction={card.secondaryAction}
            onClick={card.isReportRequest ? () => setIsReportDialogOpen(true) : undefined}
          />
        ))}
      </div>

      {/* Dialog para Solicitar Informe */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('reports.form.title', { fallback: 'Solicitar Informe' })}</DialogTitle>
          </DialogHeader>
          <ReportRequestForm onSuccess={() => setIsReportDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ControlPanel;
