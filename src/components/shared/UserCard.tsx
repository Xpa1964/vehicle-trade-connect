
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, User, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserRatingBadge from './UserRatingBadge';
import { useRatings } from '@/hooks/useRatings';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserCardProps {
  userId: string;
  userName?: string;
  companyName?: string;
  businessType?: string;
  country?: string;
  companyLogo?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  userId,
  userName,
  companyName,
  businessType,
  country,
  companyLogo
}) => {
  const { ratingSummary } = useRatings(userId);
  const { t } = useLanguage();
  
  // CORREGIDO: Lógica mejorada para mostrar el nombre correcto
  const displayName = companyName || userName || 'Usuario';
  
  console.log('🔗 UserCard Debug:', {
    userId,
    companyName,
    userName,
    displayName,
    linkTo: `/user/${userId}`
  });
  
  const businessTypeLabels: Record<string, string> = {
    'dealer': 'Concesionario',
    'multibrand_used': 'Multimarca VO',
    'buy_sell': 'Compraventa',
    'rent_a_car': 'Rent a Car',
    'renting': 'Renting',
    'workshop': 'Taller',
    'importer': 'Importador',
    'exporter': 'Exportador',
    'trader': 'Comerciante',
    'other': 'Otro'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 min-h-[320px] flex flex-col">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-3">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={`${displayName} logo`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {displayName[0].toUpperCase()}
            </div>
          )}
        </div>
        <CardTitle className="text-lg mb-2">{displayName}</CardTitle>
        {businessType && (
          <Badge variant="outline" className="text-xs w-fit mx-auto mb-3 max-w-[180px] truncate">
            {businessTypeLabels[businessType] || businessType}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-3 pt-0">
        {/* Información del usuario */}
        <div className="space-y-2 flex-1">
          {/* Contact Person */}
          {userName && companyName && (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-1" />
              <span>{userName}</span>
            </div>
          )}
          
          {/* Location */}
          {country && (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{country}</span>
            </div>
          )}

          {/* Rating */}
          {ratingSummary && ratingSummary.total_ratings > 0 && (
            <div className="flex justify-center">
               <UserRatingBadge
                 averageRating={Number(ratingSummary.average_rating)}
                 totalRatings={Number(ratingSummary.total_ratings)}
                 verifiedRatings={Number(ratingSummary.verified_ratings)}
                 compact={true}
               />
            </div>
          )}
        </div>

        {/* Action Buttons - siempre al final */}
        <div className="space-y-2 mt-auto">
          <Link to={`/user/${userId}`} className="block">
            <Button className="w-full" size="sm">
              <Building2 className="w-4 h-4 mr-2" />
              {t('common.viewFullProfile', { fallback: 'Ver Perfil Completo' })}
            </Button>
          </Link>
          
          <Link to={`/user/${userId}`} className="block">
            <Button variant="outline" className="w-full" size="sm">
              <Star className="w-4 h-4 mr-2" />
              {t('rating.rateUser')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
