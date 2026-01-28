
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserWithMeta } from '@/types/auth';
import { User, MapPin, Building2, Calendar, Star, RefreshCw, Settings } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useRatings } from '@/hooks/useRatings';
import StarRating from '@/components/ratings/StarRating';
import { getCountryCodeByName, getCountryFlagUrl } from '@/utils/countryUtils';

interface DashboardProfileProps {
  user: UserWithMeta;
}

// FASE 4: Memoizar componente para evitar re-renders innecesarios
const DashboardProfile: React.FC<DashboardProfileProps> = React.memo(({ user }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { currentRole, isReloading, handleRoleReload } = useUserRole();
  const { ratingSummary, ratingsLoading } = useRatings(user?.id);

  const getUserDisplayName = () => {
    return user?.profile?.full_name || user?.name || user?.email?.split('@')[0] || t('profile.user', { fallback: 'Usuario' });
  };

  const getCompanyName = () => {
    return user?.profile?.company_name || t('profile.companyNotSpecified', { fallback: 'Empresa no especificada' });
  };

  const getBusinessTypeLabel = (businessType: string) => {
    if (!businessType) return t('businessType.other', { fallback: 'Otro' });
    return t(`businessType.${businessType}`, { fallback: businessType });
  };

  const getTraderTypeLabel = (traderType: string) => {
    if (!traderType) return '';
    return t(`traderType.${traderType}`, { fallback: traderType });
  };

  const getRoleDisplayName = () => {
    const roleMap: Record<string, string> = {
      'user': t('profile.user', { fallback: 'Usuario' }),
      'admin': 'Administrador',
      'moderator': 'Moderador',
      'support': 'Soporte',
      'content_manager': 'Gestor de Contenido',
      'analyst': 'Analista'
    };
    return roleMap[user?.role] || t('profile.user', { fallback: 'Usuario' });
  };

  const getCountryWithFlag = (countryName: string) => {
    if (!countryName) return t('profile.countryNotSpecified', { fallback: 'País no especificado' });
    
    const countryCode = getCountryCodeByName(countryName);
    const flagUrl = getCountryFlagUrl(countryCode);
    
    return (
      <div className="flex items-center gap-2">
        <img 
          src={flagUrl} 
          alt={`${countryName} flag`}
          className="w-4 h-4 rounded-sm"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span>{countryName}</span>
      </div>
    );
  };

  const formatMemberSince = (date: string) => {
    if (!date) return t('profile.dateNotAvailable', { fallback: 'Fecha no disponible' });
    
    try {
      return new Date(date).toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return t('profile.dateNotAvailable', { fallback: 'Fecha no disponible' });
    }
  };

  // FASE 4: Memoizar sección de rating para evitar recalcular en cada render
  const renderRatingSection = useMemo(() => {
    if (ratingsLoading) {
      return (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin"></div>
          <span className="text-muted-foreground">{t('profile.loadingRatings', { fallback: 'Cargando valoraciones...' })}</span>
        </div>
      );
    }

    const averageRating = ratingSummary?.average_rating || 0;
    const totalRatings = ratingSummary?.total_ratings || 0;

    return (
      <div className="flex items-center gap-3">
        <StarRating 
          rating={averageRating} 
          size={18} 
          showValue={false}
          className="flex-shrink-0"
        />
        <div className="flex items-center gap-2 text-base font-medium text-foreground">
          <span>{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground text-sm font-normal">
            ({totalRatings} {t('profile.verifiedRatings', { fallback: 'valoraciones' })})
          </span>
        </div>
      </div>
    );
  }, [ratingsLoading, ratingSummary, t]);

  return (
    <Card className="border-border shadow-sm bg-card mb-6 overflow-hidden h-full">
      <CardContent className="p-5 sm:p-6">
        {/* Layout móvil optimizado */}
        <div className="flex flex-col space-y-4 md:hidden">
          {/* Avatar, Nombre y Valoraciones */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative flex-shrink-0">
              {user?.profile?.company_logo ? (
                <img
                  src={user.profile.company_logo}
                  alt={`Logo de la empresa ${getCompanyName()}`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#22C55E] rounded-full border-2 border-card flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Nombre de la empresa */}
            <div className="text-center">
              <h2 className="text-lg font-light text-foreground leading-tight break-words">{getCompanyName()}</h2>
              <Badge variant="outline" className="text-xs w-fit px-2 py-1 mt-2">
                {getRoleDisplayName()}
              </Badge>
            </div>

            {/* Valoraciones - Justo debajo del logo */}
            <div className="py-3 px-4 bg-primary/10 rounded-lg border border-primary/30">
              {renderRatingSection}
            </div>
          </div>

          {/* Información detallada */}
          <div className="grid grid-cols-1 gap-3.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="break-words leading-relaxed">{getBusinessTypeLabel(user?.profile?.business_type)}</span>
            </div>
            
            {user?.profile?.trader_type && (
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="break-words leading-relaxed">{getTraderTypeLabel(user.profile.trader_type)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <div className="break-words leading-relaxed">{getCountryWithFlag(user?.profile?.country)}</div>
            </div>
            
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs leading-relaxed">
                {t('profile.memberSince', { fallback: 'Miembro desde' })} {' '}
                {formatMemberSince(user?.profile?.registration_date || user?.profile?.created_at || '')}
              </span>
            </div>
          </div>

          {/* Botones - disposición vertical en móvil con mejor spacing */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <Button 
              variant="ghost" 
              size="default"
              onClick={() => navigate('/profile')}
              className="w-full text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 justify-center py-3 px-4"
            >
              {t('profile.viewProfile', { fallback: t('profile.viewFullProfile', { fallback: 'Ver Perfil' }) })}
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                size="default" 
                onClick={handleRoleReload} 
                disabled={isReloading}
                className="flex-1 text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 py-3 px-3"
              >
                <RefreshCw className={`w-4 h-4 mr-1 flex-shrink-0 ${isReloading ? 'animate-spin' : ''}`} />
                <span className="text-xs break-words">{t('profile.updateRole', { fallback: 'Actualizar' })}</span>
              </Button>
              
              {currentRole === 'admin' && (
                <Button 
                  variant="ghost" 
                  size="default"
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex-1 flex items-center justify-center text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 py-3 px-3"
                >
                  <Settings className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="text-xs break-words">{t('profile.adminPanel', { fallback: 'Admin' })}</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Layout desktop */}
        <div className="hidden md:flex items-start space-x-6">
          {/* Columna izquierda: Avatar y Valoraciones */}
          <div className="flex flex-col items-center gap-3">
            {/* Avatar/Logo */}
            <div className="relative">
              {user?.profile?.company_logo ? (
                <img
                  src={user.profile.company_logo}
                  alt={`Logo de la empresa ${getCompanyName()}`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#22C55E] rounded-full border-2 border-card flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Valoraciones - Justo debajo del logo */}
            <div className="py-2 px-4 bg-primary/10 rounded-lg border border-primary/30">
              {renderRatingSection}
            </div>
          </div>

          {/* Columna derecha: Info del usuario y botones */}
          <div className="flex-1 flex flex-col justify-between">
            {/* User Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-light text-foreground">{getCompanyName()}</h2>
                <Badge variant="outline" className="text-xs">
                  {getRoleDisplayName()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{getBusinessTypeLabel(user?.profile?.business_type)}</span>
                </div>
                
                {user?.profile?.trader_type && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{getTraderTypeLabel(user.profile.trader_type)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {getCountryWithFlag(user?.profile?.country)}
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t('profile.memberSince', { fallback: 'Miembro desde' })} {' '}
                    {formatMemberSince(user?.profile?.registration_date || user?.profile?.created_at || '')}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center gap-3 mt-4">
              <Button 
                variant="ghost" 
                size="default"
                onClick={() => navigate('/profile')}
                className="text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 px-4 py-2 whitespace-nowrap"
              >
                {t('profile.viewFullProfile', { fallback: 'Ver Perfil Completo' })}
              </Button>
              
              <Button 
                variant="ghost" 
                size="default" 
                onClick={handleRoleReload} 
                disabled={isReloading}
                className="text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 px-4 py-2 whitespace-nowrap"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isReloading ? 'animate-spin' : ''}`} />
                {t('profile.updateRole', { fallback: 'Actualizar Rol' })}
              </Button>
              
              {currentRole === 'admin' && (
                <Button 
                  variant="ghost" 
                  size="default"
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex items-center text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 px-4 py-2 whitespace-nowrap"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t('profile.goToAdmin', { fallback: 'Ir al Panel Admin' })}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Display name para React DevTools
DashboardProfile.displayName = 'DashboardProfile';

export default DashboardProfile;
