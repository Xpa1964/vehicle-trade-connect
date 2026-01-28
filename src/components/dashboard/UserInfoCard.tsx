
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, RefreshCw, LogIn, LogOut, Star, User, Settings } from 'lucide-react';
import { UserWithMeta, AppRole } from '@/types/auth';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';
import { useLanguage } from '@/contexts/LanguageContext';
import { getUserRating } from '@/utils/ratingUtils';
import StarRating from '@/components/ratings/StarRating';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmergencyModePanel from './EmergencyModePanel';

interface UserInfoCardProps {
  user: UserWithMeta;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  const { currentRole, isReloading, emergencyMode, handleRoleReload, toggleEmergencyMode } = useUserRole();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const userRating = getUserRating(user.id);
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <Card className="bg-card border-l-4 border-primary overflow-hidden min-h-[600px]">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-card pb-6">
        <div className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-card shadow">
            <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg text-foreground">
              {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {currentRole && (
              <div className="mt-1">
                <Badge variant={currentRole === 'admin' ? "default" : "outline"} className="gap-1">
                  <Shield className="h-3 w-3" />
                  {currentRole}
                </Badge>
              </div>
            )}
          </div>
        </div>
        
        {/* Reputación debajo del avatar y bandera */}
        <div className="flex flex-col items-center space-y-2 mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-center">
            <StarRating rating={userRating?.averageRating || 0} size={24} showValue />
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            {t('profile.basedOn', { fallback: 'Basado en' })} {userRating?.totalRatings || 0} {t('profile.ratings', { fallback: 'valoraciones' })}
          </p>
          
          {userRating?.verifiedRatings ? (
            <p className="text-[#22C55E] text-xs font-medium flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              {userRating.verifiedRatings} {t('profile.verifiedRatings', { fallback: 'valoraciones verificadas' })}
            </p>
          ) : null}
        </div>
      </CardHeader>
      
      {/* Botones principales justo debajo de la imagen */}
      <div className="px-6 py-4 bg-secondary border-b border-border">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRoleReload} 
              disabled={isReloading}
              className="text-primary border-primary hover:bg-primary/10 h-10 px-4"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isReloading ? 'animate-spin' : ''}`} />
              {t('profile.updateRole', { fallback: 'Actualizar Rol' })}
            </Button>
            
            {currentRole === 'admin' && (
              <Button 
                size="sm"
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center bg-primary hover:bg-primary/90 h-10 px-4"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t('profile.adminPanel', { fallback: 'Ir al Panel Admin' })}
              </Button>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleEmergencyMode}
              className="text-amber-400 border-amber-400/30 hover:bg-amber-400/10 h-10 px-4"
            >
              {emergencyMode ? <LogOut className="w-4 h-4 mr-1" /> : <LogIn className="w-4 h-4 mr-1" />}
              {emergencyMode ? t('profile.normalMode', { fallback: 'Modo Normal' }) : t('profile.advancedMode', { fallback: 'Modo Avanzado' })}
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">ID de usuario:</p>
            <p className="text-sm text-muted-foreground">{user.id.substring(0, 8)}...</p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Rol actual:</p>
            <p className="text-sm text-muted-foreground">
              {isReloading ? 'Recargando...' : currentRole || 'No asignado'}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Estado:</p>
            <Badge variant="outline" className="text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10">
              {t('profile.active', { fallback: 'Activo' })}
            </Badge>
          </div>

          <div className="pt-4 border-t border-border">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/profile')}
              className="w-full"
            >
              {t('profile.viewFullProfile', { fallback: 'Ver perfil completo' })}
            </Button>
          </div>
          
          {emergencyMode && <EmergencyModePanel />}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
