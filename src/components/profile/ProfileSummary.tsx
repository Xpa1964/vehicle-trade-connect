
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar, MessageSquare, Settings, User, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { getCountryCodeByName, getCountryFlagUrl } from '@/utils/countryUtils';
import UserRatingBadge from '@/components/shared/UserRatingBadge';
import QuickRatingDialog from '@/components/ratings/QuickRatingDialog';

interface ProfileSummaryProps {
  profileData: any;
  userRating: any;
  isCurrentUser: boolean;
  onContact: () => void;
  onRate: () => void;
  user: any;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  profileData,
  userRating,
  isCurrentUser,
  onContact,
  onRate,
  user,
}) => {
  const { t } = useLanguage();

  const getBusinessTypeLabel = (businessType: string) => {
    if (!businessType) return t('businessType.other', { fallback: 'Otro' });
    return t(`businessType.${businessType}`, { fallback: businessType });
  };

  const getTraderTypeLabel = (traderType: string) => {
    if (!traderType) return '';
    return t(`traderType.${traderType}`, { fallback: traderType });
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

  const memberSinceDate = profileData?.registration_date || profileData?.created_at;

  return (
    <Card className="min-h-[500px] flex flex-col">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          {profileData?.company_logo ? (
            <img
              src={profileData.company_logo}
              alt="Company Logo"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {(profileData?.company_name || profileData?.full_name || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
        <CardTitle className="text-xl mb-3">
          {profileData?.company_name || t('profile.companyNotSpecified', { fallback: 'Empresa no especificada' })}
        </CardTitle>
        
        {/* Badges con mejor espaciado */}
        <div className="space-y-2">
          {/* Tipo de Actividad */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs max-w-[200px] truncate">
              {getBusinessTypeLabel(profileData?.business_type)}
            </Badge>
          </div>
          
          {/* Tipo de Comerciante */}
          {profileData?.trader_type && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-xs max-w-[200px] truncate">
                {getTraderTypeLabel(profileData.trader_type)}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          {/* BOTÓN DE VALORACIÓN PROMINENTE - MOVIDO AL INICIO */}
          {!isCurrentUser && user && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-gray-800 mb-1">🌟 {t('rating.rateUser')}</h3>
                <p className="text-sm text-gray-600">{t('rating.shareExperience')}</p>
              </div>
              
              <QuickRatingDialog
                userId={profileData?.id}
                userName={profileData?.company_name || profileData?.full_name || 'Usuario'}
                trigger={
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" size="lg">
                    <Star className="h-5 w-5 mr-2 fill-current" />
                    {t('rating.giveStars')}
                  </Button>
                }
                onRatingSubmitted={() => {
                  window.location.reload();
                }}
              />
              
              <div className="text-center mt-3">
                <p className="text-xs text-yellow-700 font-medium">
                  👆 {t('rating.clickToRate')}
                </p>
              </div>
            </div>
          )}

          {/* Rating Section - Reputación actual */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('rating.currentReputation')}</h3>
              <UserRatingBadge
                averageRating={userRating.averageRating}
                totalRatings={userRating.totalRatings}
                verifiedRatings={userRating.verifiedRatings}
                starSize={22}
              />
            </div>
          </div>

          {/* Información del perfil */}
          <div className="space-y-3">
            {/* Persona de Contacto */}
            {profileData?.full_name && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <div>
                  <span className="font-medium">{t('profile.contactPerson', { fallback: 'Persona de Contacto' })}: </span>
                  <span>{profileData.full_name}</span>
                </div>
              </div>
            )}
            
            {/* País con bandera */}
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              {getCountryWithFlag(profileData?.country)}
            </div>
            
            {/* Miembro desde */}
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {t('profile.memberSince', { fallback: 'Miembro desde' })} {' '}
                {formatMemberSince(memberSinceDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons - siempre al final */}
        <div className="space-y-3 pt-4 border-t border-gray-100 mt-auto">
          {!isCurrentUser && (
            <Button onClick={onContact} className="w-full" size="lg">
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('profile.contact', { fallback: 'Contactar' })}
            </Button>
          )}
          
          {isCurrentUser && (
            <Button className="w-full" variant="outline" size="lg">
              <Settings className="h-4 w-4 mr-2" />
              {t('profile.accountSettings', { fallback: 'Configuración de Cuenta' })}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
