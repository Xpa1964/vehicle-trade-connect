
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
    <Card className="bg-white border-l-4 border-auto-blue overflow-hidden min-h-[600px]">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-6">
        <div className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow">
            <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-auto-blue text-white text-lg">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </CardTitle>
            <p className="text-sm text-gray-500">{user.email}</p>
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
        <div className="flex flex-col items-center space-y-2 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <StarRating rating={userRating?.averageRating || 0} size={24} showValue />
          </div>
          
          <p className="text-center text-xs text-gray-600">
            {t('profile.basedOn', { fallback: 'Basado en' })} {userRating?.totalRatings || 0} {t('profile.ratings', { fallback: 'valoraciones' })}
          </p>
          
          {userRating?.verifiedRatings ? (
            <p className="text-green-600 text-xs font-medium flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              {userRating.verifiedRatings} {t('profile.verifiedRatings', { fallback: 'valoraciones verificadas' })}
            </p>
          ) : null}
        </div>
      </CardHeader>
      
      {/* Botones principales justo debajo de la imagen */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRoleReload} 
              disabled={isReloading}
              className="text-auto-blue border-auto-blue hover:bg-blue-50 h-10 px-4"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isReloading ? 'animate-spin' : ''}`} />
              {t('profile.updateRole', { fallback: 'Actualizar Rol' })}
            </Button>
            
            {currentRole === 'admin' && (
              <Button 
                size="sm"
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center bg-auto-blue hover:bg-blue-700 h-10 px-4"
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
              className="text-orange-600 border-orange-300 hover:bg-orange-50 h-10 px-4"
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
            <p className="text-sm font-medium">ID de usuario:</p>
            <p className="text-sm text-gray-600">{user.id.substring(0, 8)}...</p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Rol actual:</p>
            <p className="text-sm text-gray-600">
              {isReloading ? 'Recargando...' : currentRole || 'No asignado'}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Estado:</p>
            <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
              {t('profile.active', { fallback: 'Activo' })}
            </Badge>
          </div>

          <div className="pt-4 border-t border-gray-200">
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
