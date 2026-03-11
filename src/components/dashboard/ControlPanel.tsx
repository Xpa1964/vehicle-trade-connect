import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReportRequestForm } from '@/components/vehicle-reports/ReportRequestForm';
import DashboardServiceCard from './DashboardServiceCard';
import APIKeyCard from './APIKeyCard';

// Lazy wrapper - only renders children when scrolled into view
const LazyCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[200px]">
      {isVisible ? children : (
        <div className="animate-pulse rounded-xl bg-muted h-full min-h-[200px]" />
      )}
    </div>
  );
};

const ControlPanel: React.FC = () => {
  const { t } = useLanguage();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // First 6 cards load eagerly (above the fold), rest are lazy
  const EAGER_COUNT = 6;

  const serviceCards = [
    // Row 1
    {
      imageId: 'services.showroom',
      title: t('services.vehicleGallery', { fallback: 'Vehículos' }),
      primaryAction: { label: t('common.view', { fallback: 'Ver' }), href: '/vehicles' },
      secondaryAction: { label: t('common.publish', { fallback: 'Publicar' }), href: '/vehicle-management' }
    },
    {
      imageId: 'services.auctions',
      title: t('nav.auctionRoom', { fallback: 'Subastas' }),
      primaryAction: { label: t('common.view', { fallback: 'Ver' }), href: '/auctions' },
      secondaryAction: { label: t('common.publish', { fallback: 'Publicar' }), href: '/publish-auction' }
    },
    {
      imageId: 'services.exchanges',
      title: t('nav.exchanges', { fallback: 'Intercambios' }),
      primaryAction: { label: t('common.view', { fallback: 'Ver' }), href: '/exchanges' },
      secondaryAction: { label: t('common.publish', { fallback: 'Publicar' }), href: '/exchange-form' }
    },
    // Row 2
    {
      imageId: 'services.bulletin',
      title: t('nav.bulletinBoard', { fallback: 'Tablón de Anuncios' }),
      primaryAction: { label: t('common.view', { fallback: 'Ver' }), href: '/bulletin' },
      secondaryAction: { label: t('common.publish', { fallback: 'Publicar' }), href: '/publish-announcement' }
    },
    {
      imageId: 'services.transport',
      title: t('services.transport', { fallback: 'Transporte Exprés' }),
      primaryAction: { label: t('common.view', { fallback: 'Ver' }), href: '/transport-quotes' },
      secondaryAction: { label: t('common.request', { fallback: 'Solicitar' }), href: 'https://mover-pro-flow.lovable.app' }
    },
    {
      imageId: 'services.inspection',
      title: t('nav.vehicleReports', { fallback: 'Informes de Vehículos' }),
      primaryAction: { label: t('common.view', { fallback: 'Ver' }), href: '/vehicle-reports' },
      secondaryAction: { label: t('common.request', { fallback: 'Solicitar' }), href: '/request-report' },
      isReportRequest: true
    },
    // Row 3 - lazy loaded
    {
      imageId: 'services.calculator',
      title: t('nav.importCalculator', { fallback: 'Calculadora Importación' }),
      primaryAction: { label: t('common.open', { fallback: 'Abrir' }), href: '/import-calculator' }
    },
    {
      imageId: 'services.calculator',
      title: t('nav.commissionCalculator', { fallback: 'Calculadora Comisiones' }),
      primaryAction: { label: t('common.open', { fallback: 'Abrir' }), href: '/commission-calculator' }
    },
    {
      imageId: 'services.api',
      title: t('nav.apiKeys', { fallback: 'API Keys' }),
      primaryAction: { label: t('common.view', { fallback: 'Ver' }), href: '/dashboard' },
      isApiCard: true
    },
    {
      imageId: 'services.blog',
      title: t('nav.blog', { fallback: 'Blog' }),
      primaryAction: { label: t('common.view', { fallback: 'Ver' }), href: '/blog' },
      secondaryAction: { label: t('common.new', { fallback: 'Nuevo' }), href: '/blog/new' }
    }
  ];

  const renderCard = (card: any, index: number) => {
    const content = card.isApiCard ? (
      <APIKeyCard />
    ) : (
      <DashboardServiceCard
        imageId={card.imageId}
        title={card.title}
        primaryAction={card.primaryAction}
        secondaryAction={card.secondaryAction}
        onClick={card.isReportRequest ? () => setIsReportDialogOpen(true) : undefined}
        imagePosition={card.imagePosition}
      />
    );

    // First EAGER_COUNT cards render immediately, rest are lazy
    if (index < EAGER_COUNT) {
      return <div key={index}>{content}</div>;
    }

    return (
      <LazyCard key={index}>
        {content}
      </LazyCard>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceCards.map((card, index) => renderCard(card, index))}
      </div>

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
