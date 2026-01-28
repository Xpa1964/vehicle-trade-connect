
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MessageCircle,
  FileText,
  Truck,
  Car,
  Volume2,
  RefreshCw,
  Settings,
  Zap
} from 'lucide-react';

const QuickActionsCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const actions = [
    {
      icon: Car,
      title: t('quickActions.publishVehicle', { fallback: 'Publicar Vehículo' }),
      description: t('quickActions.publishVehicleDescription', { fallback: 'Subir nuevo vehículo' }),
      onClick: () => navigate('/vehicle-management'),
      variant: 'success'
    },
    {
      icon: MessageCircle,
      title: t('quickActions.messages', { fallback: 'Mensajes' }),
      description: t('quickActions.messagesDescription', { fallback: 'Ver conversaciones' }),
      onClick: () => navigate('/messages'),
      variant: 'warning'
    },
    {
      icon: RefreshCw,
      title: t('quickActions.publishExchange', { fallback: 'Intercambios' }),
      description: t('quickActions.publishExchangeDescription', { fallback: 'Proponer intercambio' }),
      onClick: () => navigate('/exchange-form'),
      variant: 'accent'
    },
    {
      icon: Volume2,
      title: t('quickActions.publishAnnouncement', { fallback: 'Anuncio' }),
      description: t('quickActions.publishAnnouncementDescription', { fallback: 'Publicar anuncio' }),
      onClick: () => navigate('/publish-announcement'),
      variant: 'warning'
    },
    {
      icon: FileText,
      title: t('quickActions.requestReport', { fallback: 'Informes' }),
      description: t('quickActions.requestReportDescription', { fallback: 'Solicitar informe' }),
      onClick: () => navigate('/vehicle-reports'),
      variant: 'primary'
    },
    {
      icon: Truck,
      title: t('quickActions.quoteTransport', { fallback: 'Transporte' }),
      description: t('quickActions.quoteTransportDescription', { fallback: 'Cotizar transporte' }),
      onClick: () => navigate('/transport'),
      variant: 'info'
    }
  ];

  // Función para obtener colores por variante
  const getVariantColors = (variant: string) => {
    const variants = {
      primary: {
        icon: 'text-blue-600',
        bg: 'bg-blue-50 hover:bg-blue-100/50',
        border: 'border-blue-200 hover:border-blue-300',
        shadow: 'hover:shadow-blue-500/20'
      },
      success: {
        icon: 'text-green-600',
        bg: 'bg-green-50 hover:bg-green-100/50', 
        border: 'border-green-200 hover:border-green-300',
        shadow: 'hover:shadow-green-500/20'
      },
      warning: {
        icon: 'text-orange-600',
        bg: 'bg-orange-50 hover:bg-orange-100/50',
        border: 'border-orange-200 hover:border-orange-300', 
        shadow: 'hover:shadow-orange-500/20'
      },
      accent: {
        icon: 'text-purple-600',
        bg: 'bg-purple-50 hover:bg-purple-100/50',
        border: 'border-purple-200 hover:border-purple-300',
        shadow: 'hover:shadow-purple-500/20'
      },
      info: {
        icon: 'text-teal-600',
        bg: 'bg-teal-50 hover:bg-teal-100/50',
        border: 'border-teal-200 hover:border-teal-300',
        shadow: 'hover:shadow-teal-500/20'
      }
    };
    return variants[variant] || variants.primary;
  };

  return (
    <Card className="card-professional h-full">
      <CardHeader className="pb-4 px-4 md:px-6 border-b border-neutral-200">
        <CardTitle className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
            <Zap className="h-5 w-5 text-primary" strokeWidth={1.2} />
          </div>
          {t('quickActions.title', { fallback: 'Acciones Rápidas' })}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6 py-4">
        {/* Vista Desktop Profesional */}
        <div className="hidden lg:block space-y-3">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            const colors = getVariantColors(action.variant);
            return (
              <Button
                key={index}
                variant="outline"
                className={`w-full min-h-[60px] p-4 flex items-center justify-start space-x-4 
                  ${colors.bg} ${colors.border} ${colors.shadow}
                  hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 touch-manipulation relative overflow-hidden group`}
                onClick={action.onClick}
              >
                <div className="flex-shrink-0 p-2 rounded-xl bg-surface/80 group-hover:bg-surface transition-colors duration-200">
                  <IconComponent className={`h-6 w-6 ${colors.icon}`} strokeWidth={1.2} />
                </div>
                <div className="flex flex-col items-start text-left flex-1 min-w-0">
                  <span className="font-semibold text-sm text-foreground group-hover:text-foreground/90 truncate w-full">
                    {action.title}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1 truncate w-full group-hover:text-muted-foreground/80">
                    {action.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Vista Mobile Profesional */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {actions.map((action, index) => {
              const IconComponent = action.icon;
              const colors = getVariantColors(action.variant);
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`min-h-[72px] sm:min-h-[80px] flex flex-col items-center justify-center gap-2 p-3 sm:p-4 
                    ${colors.bg} ${colors.border} ${colors.shadow}
                    hover:scale-[1.02] active:scale-95 transition-all duration-200 touch-manipulation text-center group`}
                  onClick={action.onClick}
                >
                  <div className="p-2 rounded-lg bg-surface/80 group-hover:bg-surface transition-colors duration-200">
                    <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.icon}`} strokeWidth={1.2} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-foreground text-center leading-tight line-clamp-2 max-w-full">
                    {action.title}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCarousel;
