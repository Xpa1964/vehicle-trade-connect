
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserWithMeta } from '@/types/auth';

interface DashboardHeaderProps {
  user: UserWithMeta;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const { t } = useLanguage();

  // Priorizar datos del perfil de la base de datos
  const displayName = user?.profile?.company_name || user?.profile?.full_name || user?.name || 'Usuario';

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg">
      {/* Background using the uploaded car interior image - SIN FILTROS NI DEGRADADOS */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/e8bcfe5d-970e-46e2-a7e3-97c470666f95.png"
          alt="Dashboard Background"
          className="w-full h-full object-cover object-[center_30%]"
          style={{ minHeight: '320px' }}
          onError={(e) => {
            console.log('Error loading primary background image, using gradient fallback');
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)';
            }
          }}
          onLoad={() => {
            console.log('Car interior background image loaded successfully');
          }}
        />
      </div>
      
      {/* Content - SIN OVERLAYS OSCUROS */}
      <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 h-full">
          <div className="flex flex-col justify-end flex-1 h-full">
            {/* Welcome text - TODO EN NEGRITA Y TRANSPARENTE */}
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="font-bold">
                  {t('dashboard.controlPanel', { fallback: 'Panel de Control' })}
                </span>
              </h1>
            </div>
            
            {/* Description text - SOLO LIGERO FONDO PARA ESTE TEXTO */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <p className="text-lg text-white font-bold">
                {t('dashboard.welcomeMessage', { fallback: 'Gestiona toda la aplicación desde un solo lugar y conecta con la mayor comunidad de profesionales de VO.' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              <Bell className="w-4 h-4" />
              <span>3</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
