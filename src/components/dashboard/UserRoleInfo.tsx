
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw, LogIn, LogOut, User } from 'lucide-react';
import { UserWithMeta, AppRole } from '@/types/auth';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';
import { useLanguage } from '@/contexts/LanguageContext';
import EmergencyModePanel from './EmergencyModePanel';

interface UserRoleInfoProps {
  user: UserWithMeta;
}

const UserRoleInfo: React.FC<UserRoleInfoProps> = ({ user }) => {
  const { currentRole, isReloading, emergencyMode, handleRoleReload, toggleEmergencyMode } = useUserRole();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role) {
      // This effect runs when the user prop changes
      console.log('User role in UserRoleInfo:', user.role);
    }
  }, [user?.role]);

  return (
    <Card className="bg-card border-primary/50 border-l-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-foreground">
          <Shield className="w-5 h-5 mr-2 text-primary" />
          {t('profile.userInfo', { fallback: 'Información de usuario y permisos' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-foreground">
          <p><strong>ID de usuario:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p>
            <strong>Rol actual:</strong> {isReloading ? 'Recargando...' : currentRole || 'No asignado'} 
            {currentRole === 'admin' && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-[#22C55E]">
                <Shield className="w-3 h-3 mr-1" /> Administrador
              </span>
            )}
          </p>
          
           <div className="flex flex-wrap gap-2 mt-2">
             <Button 
               variant="outline" 
               size="sm"
               onClick={() => navigate(`/profile/${user.id}`)}
               className="flex items-center text-primary border-primary hover:bg-primary/10"
             >
               <User className="w-4 h-4 mr-2" />
               Ver perfil completo
             </Button>
             
             <Button
               variant="outline"
               size="sm"
               onClick={toggleEmergencyMode}
               className="text-sky-400 border-sky-400/50 hover:bg-sky-400/10"
             >
               {emergencyMode ? <LogOut className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
               {emergencyMode ? t('profile.hideAdvanced', { fallback: 'Opciones avanzadas' }) : t('profile.showAdvanced', { fallback: 'Opciones avanzadas' })}
             </Button>
             
             {emergencyMode && (
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={handleRoleReload} 
                 disabled={isReloading}
                 className="text-primary border-primary/50 hover:bg-primary/10"
               >
                 <RefreshCw className={`w-4 h-4 mr-2 ${isReloading ? 'animate-spin' : ''}`} />
                 {t('profile.reloadRole', { fallback: 'Recargar rol' })}
               </Button>
             )}
            
            {currentRole === 'admin' ? (
              <Button 
                variant="default"
                onClick={() => navigate('/admin/dashboard')}
              >
                {t('profile.goToAdmin', { fallback: 'Ir al panel de administración' })}
              </Button>
            ) : (
              <p className="text-amber-400 mt-2">
                No tienes permisos de administración. Contacta al administrador del sistema si crees que deberías tenerlos.
              </p>
            )}
          </div>
          
          {emergencyMode && <EmergencyModePanel />}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRoleInfo;
