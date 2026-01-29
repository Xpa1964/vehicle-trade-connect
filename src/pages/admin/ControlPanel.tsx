import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ControlPanelSection from '@/components/admin/control-panel/ControlPanelSection';
import { apiKeysImage } from '@/constants/imageAssets';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Truck, 
  MessageSquare, 
  Bell, 
  MessagesSquare,
  FileText,
  ArrowLeftRight,
  Settings,
  BarChart3,
  Zap,
  Languages,
  Shield,
  UserPlus,
  ScrollText,
  CreditCard,
  FileCheck,
  Key,
  Image
} from 'lucide-react';

const ControlPanelPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentRole } = useUserRole();
  const { t } = useLanguage();
  
  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has admin role
  const isAdmin = currentRole === 'admin' || 
                 currentRole === 'content_manager' || 
                 currentRole === 'analyst';
                 
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permiso para acceder al panel de administración.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const primaryFunctions = [
    {
      icon: LayoutDashboard,
      title: t('control.dashboard'),
      description: t('control.dashboardDescription'),
      href: '/admin/dashboard'
    },
    {
      icon: Users,
      title: t('control.users'),
      description: t('control.usersDescription'),
      href: '/admin/users'
    },
    {
      icon: Car,
      title: t('control.vehicles'),
      description: t('control.vehiclesCardDescription'),
      href: '/admin/vehicles'
    },
    {
      icon: Truck,
      title: 'Transportes',
      description: t('control.transportDescription'),
      href: '/admin/transport-quotes'
    }
  ];

  const communication = [
    {
      icon: MessageSquare,
      title: 'Conversaciones',
      description: t('control.conversationsDescription'),
      href: '/admin/conversations'
    },
    {
      icon: Bell,
      title: 'Comunicaciones',
      description: t('control.communicationsDescription'),
      href: '/admin/communications-dashboard'
    },
    {
      icon: MessagesSquare,
      title: 'Directorio Chat',
      description: t('control.chatDirectoryDescription'),
      href: '/admin/directory-chat'
    }
  ];

  const contentManagement = [
    {
      icon: FileText,
      title: 'Blog',
      description: t('control.blogCardDescription'),
      href: '/admin/blog-management'
    },
    {
      icon: ArrowLeftRight,
      title: 'Intercambios',
      description: t('control.exchangesDescription'),
      href: '/admin/exchanges'
    },
    {
      icon: Bell,
      title: 'Notificaciones',
      description: t('control.notificationsDescription'),
      href: '/admin/notifications'
    },
    {
      icon: FileCheck,
      title: 'Entrega de Informes',
      description: 'Procesar y entregar informes de vehículos solicitados',
      href: '/admin/report-processing'
    },
    {
      icon: FileText,
      title: 'Solicitar Informe',
      description: 'Formulario para solicitar informes técnicos de vehículos',
      href: '/request-report'
    }
  ];

  const professionalTools = [
    {
      icon: BarChart3,
      title: t('control.analytics'),
      description: t('control.analyticsDescription'),
      href: '/admin/analytics'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: t('control.performanceDescription'),
      href: '/admin/performance-monitoring'
    },
    {
      icon: Languages,
      title: 'Traducciones',
      description: t('control.translationsDescription'),
      href: '/admin/translation-management'
    },
    {
      icon: Shield,
      title: 'Auditoría QA/UX/Seguridad',
      description: 'Reporte completo de auditoría con descarga PDF/Word',
      href: '/admin/audit-report'
    },
    {
      icon: Image,
      title: 'Image Control Center',
      description: 'Gestiona y regenera imágenes estáticas del producto con IA',
      href: '/admin/image-control'
    }
  ];

  const administration = [
    {
      icon: Shield,
      title: 'Roles',
      description: t('control.rolesDescription'),
      href: '/admin/roles'
    },
    {
      icon: UserPlus,
      title: 'Solicitudes de Registro',
      description: t('control.registrationRequestsDescription'),
      href: '/admin/registration-requests'
    },
    {
      icon: ScrollText,
      title: 'Registros de Actividad',
      description: t('control.activityLogsDescription'),
      href: '/admin/activity-logs'
    },
    {
      icon: CreditCard,
      title: 'Pagos de Informes',
      description: 'Gestiona y verifica los pagos de informes vehiculares',
      href: '/admin/report-payments'
    },
    {
      imageUrl: apiKeysImage,
      title: 'Gestión de APIs',
      description: 'Gestiona API keys de partners para sincronización automática de stock',
      href: '/admin/api-management'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('control.pageTitle')}
        </h1>
        <p className="text-muted-foreground">
          {t('control.pageSubtitle')}
        </p>
      </div>

      <div className="space-y-8">
        <ControlPanelSection
          title={t('control.primaryFunctions')}
          items={primaryFunctions}
          colorClass="border-blue-200 bg-blue-50/50"
        />
        
        <ControlPanelSection
          title={t('control.communication')}
          items={communication}
          colorClass="border-green-200 bg-green-50/50"
        />
        
        <ControlPanelSection
          title="Gestión de Contenido"
          items={contentManagement}
          colorClass="border-purple-200 bg-purple-50/50"
        />
        
        <ControlPanelSection
          title={t('control.professionalTools')}
          items={professionalTools}
          colorClass="border-orange-200 bg-orange-50/50"
        />
        
        <ControlPanelSection
          title="Administración"
          items={administration}
          colorClass="border-red-200 bg-red-50/50"
        />
      </div>
    </div>
  );
};

export default ControlPanelPage;