import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserWithMeta } from '@/types/auth';
import { User, Settings, Users, Key } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useRatings } from '@/hooks/useRatings';
import StarRating from '@/components/ratings/StarRating';
import { getCountryCodeByName, getCountryFlagUrl } from '@/utils/countryUtils';

interface DashboardProfileProps {
  user: UserWithMeta;
}

const DashboardProfile: React.FC<DashboardProfileProps> = React.memo(({ user }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { currentRole } = useUserRole();
  const { ratingSummary, ratingsLoading } = useRatings(user?.id);

  const getDisplayUsername = () => {
    const companyName = user?.profile?.company_name || '';
    const fullName = user?.profile?.full_name || user?.name || '';
    
    if (companyName && fullName) {
      const companyPart = companyName.trim().split(/\s+/)[0]?.substring(0, 6)?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
      const lastNamePart = fullName.trim().split(/\s+/).pop()?.substring(0, 6)?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
      if (companyPart && lastNamePart) {
        return `${companyPart}_${lastNamePart}`;
      }
    }
    
    return user?.profile?.company_name || t('profile.companyNotSpecified', { fallback: 'Empresa no especificada' });
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
    if (!countryName) return null;
    
    const countryCode = getCountryCodeByName(countryName);
    const flagUrl = getCountryFlagUrl(countryCode);
    
    return (
      <span className="flex items-center gap-1">
        <img 
          src={flagUrl} 
          alt={`${countryName} flag`}
          className="w-4 h-4 rounded-sm"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span>{countryName}</span>
      </span>
    );
  };

  const renderRatingSection = useMemo(() => {
    if (ratingsLoading) {
      return (
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-border border-t-primary rounded-full animate-spin"></div>
        </span>
      );
    }

    const averageRating = ratingSummary?.average_rating || 0;
    const totalRatings = ratingSummary?.total_ratings || 0;

    return (
      <span className="flex items-center gap-1">
        <StarRating 
          rating={averageRating} 
          size={14} 
          showValue={false}
          className="flex-shrink-0"
        />
        <span>{averageRating.toFixed(1)} ({totalRatings})</span>
      </span>
    );
  }, [ratingsLoading, ratingSummary]);

  return (
    <Card className="bg-card border-border/50 h-full">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Columna: Avatar */}
        <div className="relative flex-shrink-0">
          {user?.profile?.company_logo ? (
            <img
              src={user.profile.company_logo}
              alt={`Logo de la empresa ${getDisplayUsername()}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-card"></div>
        </div>
        
        {/* Columna: Info */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{getDisplayUsername()}</h3>
            <Badge variant="outline" className="text-xs">{getRoleDisplayName()}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {user?.profile?.country && getCountryWithFlag(user.profile.country)}
            {renderRatingSection}
          </div>
        </div>
        
        {/* Columna: Botones */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Users size={16} />
          </Button>
          {currentRole === 'admin' && (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => navigate('/api-management')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Key size={16} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

DashboardProfile.displayName = 'DashboardProfile';

export default DashboardProfile;
