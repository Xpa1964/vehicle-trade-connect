
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, MapPin, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from '@/components/ratings/StarRating';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRatings } from '@/hooks/useRatings';
import { useLanguage } from '@/contexts/LanguageContext';
import QuickRatingDialog from '@/components/ratings/QuickRatingDialog';
import { useAuth } from '@/contexts/AuthContext';

interface SellerInfoCardProps {
  sellerId: string;
  onContact?: () => void;
}

const SellerInfoCard: React.FC<SellerInfoCardProps> = ({ sellerId, onContact }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const isOwnProfile = user?.id === sellerId;

  console.log('🔍 SellerInfoCard Debug:', {
    sellerId,
    currentUserId: user?.id,
    isOwnProfile
  });

  // MEJORADO: Query con mejor manejo de errores y datos por defecto
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['seller-profile', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();
        
      if (error) {
        console.error('Error fetching seller profile:', error);
        // MEJORADO: Retornar datos por defecto en lugar de null
        return {
          id: sellerId,
          full_name: 'Usuario',
          company_name: 'Empresa',
          country: 'España',
          business_type: 'other',
          created_at: new Date().toISOString(),
          company_logo: null,
          registration_date: new Date().toISOString()
        };
      }
      return data;
    },
    enabled: !!sellerId
  });

  // CORREGIDO: Usar useRatings hook mejorado
  const { ratingSummary } = useRatings(sellerId);

  console.log('⭐ SellerInfoCard Debug - ratingSummary:', {
    sellerId,
    ratingSummary,
    averageRating: ratingSummary?.average_rating,
    totalRatings: ratingSummary?.total_ratings,
    verifiedRatings: ratingSummary?.verified_ratings
  });

  const getBusinessTypeLabel = (businessType: string) => {
    return t(`seller.businessTypes.${businessType}`, { fallback: businessType });
  };

  if (profileLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">{t('seller.loadingInfo')}</div>
        </CardContent>
      </Card>
    );
  }

  // CORREGIDO: No mostrar null, usar datos por defecto
  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Error al cargar información del vendedor</div>
        </CardContent>
      </Card>
    );
  }

  const displayName = profile.company_name || profile.full_name || 'Usuario';
  
  // CORREGIDO: Usar ratingSummary con valores por defecto más robustos y logging
  const averageRating = ratingSummary?.average_rating ? Number(ratingSummary.average_rating) : 0;
  const totalRatings = ratingSummary?.total_ratings ? Number(ratingSummary.total_ratings) : 0;
  const verifiedRatings = ratingSummary?.verified_ratings ? Number(ratingSummary.verified_ratings) : 0;

  console.log('⭐ SellerInfoCard Final Values:', {
    displayName,
    averageRating,
    totalRatings,
    verifiedRatings,
    ratingSummaryRaw: ratingSummary
  });

  // Si es el propio perfil, no mostrar esta tarjeta
  if (isOwnProfile) {
    return null;
  }

  return (
    <Card className="min-h-[480px] flex flex-col">
      <CardHeader className="text-center pb-4">
        <Avatar className="h-16 w-16 mx-auto mb-4">
          <AvatarImage src={profile.company_logo || undefined} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
            {displayName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg mb-2">{displayName}</CardTitle>
        {profile.business_type && (
          <Badge variant="outline" className="w-fit mx-auto mb-3">
            {getBusinessTypeLabel(profile.business_type)}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-3">
        {/* CORREGIDO: Rating Section con mejor espaciado */}
        <div className="text-center space-y-2">
          <div>
            <StarRating rating={averageRating} size={16} />
          </div>
          <p className="text-sm text-gray-500">
            {totalRatings > 0 ? (
              <>
                {averageRating.toFixed(1)} ({totalRatings} {t('seller.ratings')})
              </>
            ) : (
              'Sin valoraciones aún'
            )}
          </p>
          {verifiedRatings > 0 && (
            <p className="text-xs text-green-600">
              {verifiedRatings} {t('seller.verified')}
            </p>
          )}
          {/* DEBUG: Mostrar datos en desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-blue-500 mt-1 bg-blue-50 p-1 rounded">
              DEBUG: {averageRating}★ ({totalRatings} total, {verifiedRatings} verificadas)
              <br />
              Raw: {JSON.stringify(ratingSummary)}
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="space-y-2">
          {/* Location */}
          {profile.country && (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{profile.country}</span>
            </div>
          )}

          {/* Member since */}
          {profile.registration_date && (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{t('seller.memberSince')} {new Date(profile.registration_date).toLocaleDateString()}</span>
            </div>
          )}

          {/* Contact Person */}
          {profile.full_name && profile.company_name && (
            <div className="text-center text-sm text-gray-600">
              <span className="font-medium">{t('seller.contact')}: </span>
              <span>{profile.full_name}</span>
            </div>
          )}
        </div>

        {/* Sección de acciones - siempre al final */}
        <div className="space-y-3 mt-auto">
          {/* Botón de valoración con nuevo texto */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
            <div className="text-center mb-2">
              <h3 className="text-sm font-bold text-gray-800">🌟 {t('rating.rateSeller')}</h3>
            </div>
            
            <QuickRatingDialog
              userId={sellerId}
              userName={displayName}
              trigger={
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold" size="sm">
                  <Star className="h-4 w-4 mr-2 fill-current" />
                  {t('rating.rateUser')}
                </Button>
              }
              onRatingSubmitted={() => {
                window.location.reload();
              }}
            />
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Link to={`/user/${sellerId}`} className="w-full">
              <Button variant="outline" className="w-full" size="sm">
                <User className="h-4 w-4 mr-2" />
                {t('seller.viewProfile')}
              </Button>
            </Link>
            {onContact && (
              <Button onClick={onContact} className="w-full" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('seller.contactSeller')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerInfoCard;
