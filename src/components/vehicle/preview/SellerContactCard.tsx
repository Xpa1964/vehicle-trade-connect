
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/vehicle';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { User, Phone, MapPin, Star, Building2 } from 'lucide-react';
import UserRatingBadge from '@/components/shared/UserRatingBadge';
import { useRatings } from '@/hooks/useRatings';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface SellerContactCardProps {
  vehicle: Vehicle;
}

const SellerContactCard: React.FC<SellerContactCardProps> = ({ vehicle }) => {
  const { user } = useAuth();
  const { ratingSummary } = useRatings(vehicle.user_id);
  const { t } = useLanguage();

  // Query para obtener información del vendedor - SIEMPRE se ejecuta
  const { data: sellerProfile, isLoading } = useQuery({
    queryKey: ['seller-profile', vehicle.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', vehicle.user_id)
        .single();
      
      if (error) {
        console.error('Error fetching seller profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!vehicle.user_id
  });

  // Verificar si es el propietario
  const isOwner = user?.id === vehicle.user_id;

  // Obtener el nombre a mostrar
  const sellerDisplayName = sellerProfile?.company_name || 
                           sellerProfile?.full_name || 
                           t('common.user');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('common.loading')}...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {isOwner ? t('profile.myProfile') : t('vehicles.seller')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
        {/* Información básica del vendedor - SIEMPRE presente */}
        <div className="space-y-3">
          {/* Logo de la empresa */}
          {sellerProfile?.company_logo && (
            <div className="flex justify-center">
              <img 
                src={sellerProfile.company_logo} 
                alt={`Logo de ${sellerDisplayName}`}
                className="h-16 w-16 object-contain rounded-lg border"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{sellerDisplayName}</h3>
            {isOwner && (
              <Badge variant="outline" className="text-xs">
                {t('common.owner')}
              </Badge>
            )}
          </div>

          {/* Información de contacto - SIEMPRE presente si está disponible */}
          {sellerProfile?.contact_phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{sellerProfile.contact_phone}</span>
            </div>
          )}

          {/* Ubicación - SIEMPRE presente */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{vehicle.location || vehicle.country || t('vehicles.locationNotSpecified')}</span>
          </div>

          {/* Rating - SIEMPRE presente si hay valoraciones */}
          {ratingSummary && ratingSummary.total_ratings > 0 && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
               <UserRatingBadge
                 averageRating={Number(ratingSummary.average_rating)}
                 totalRatings={Number(ratingSummary.total_ratings)}
                 verifiedRatings={Number(ratingSummary.verified_ratings)}
                 compact={true}
               />
            </div>
          )}
        </div>

        {/* Botones de acción - SIEMPRE presentes */}
        <div className="space-y-2 pt-2 border-t">
          {!isOwner ? (
            <>
              {/* Botón ver perfil */}
              <Link to={`/user/${vehicle.user_id}`} className="block">
                <Button variant="outline" className="w-full">
                  <Building2 className="h-4 w-4 mr-2" />
                  {t('profile.viewFullProfile')}
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Botones para el propietario */}
              <Link to="/profile" className="block">
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  {t('profile.editProfile')}
                </Button>
              </Link>
              
              <div className="text-center text-sm text-gray-500 mt-2">
                {t('vehicles.thisIsYourVehicle')}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerContactCard;
