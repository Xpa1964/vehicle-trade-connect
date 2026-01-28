
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    translationKey?: string;
  };
}

const breadcrumbConfig: BreadcrumbConfig = {
  dashboard: { label: 'Panel de Control', translationKey: 'navigation.backToDashboard' },
  vehicles: { label: 'Vehículos', translationKey: 'navigation.vehicles' },
  messages: { label: 'Mensajes', translationKey: 'navigation.messages' },
  auctions: { label: 'Subastas', translationKey: 'navigation.auctions' },
  exchanges: { label: 'Intercambios', translationKey: 'navigation.exchanges' },
  bulletin: { label: 'Tablón de Anuncios', translationKey: 'navigation.bulletinBoard' },
  'import-calculator': { label: 'Calculadora de Importación', translationKey: 'navigation.importCalculator' },
  profile: { label: 'Perfil', translationKey: 'navigation.profile' },
  transport: { label: 'Transporte' },
  blog: { label: 'Blog' },
  'commission-calculator': { label: 'Calculadora de Comisión' },
  settings: { label: 'Configuración', translationKey: 'navigation.settings' },
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // No mostrar breadcrumbs en home, login, register
  if (pathnames.length === 0 || ['login', 'register'].includes(pathnames[0])) {
    return null;
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
              <Home className="h-3 w-3" />
              <span>Inicio</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const config = breadcrumbConfig[pathname];
          const label = config?.translationKey 
            ? t(config.translationKey, { fallback: config.label }) 
            : config?.label || pathname.charAt(0).toUpperCase() + pathname.slice(1);

          return (
            <React.Fragment key={`breadcrumb-${index}`}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3 w-3" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-sm font-medium text-blue-600">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link 
                      to={routeTo} 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
