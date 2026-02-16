
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Fuel, Gauge, Users, Settings, User, Star } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { formatPrice } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import UserRatingBadge from '@/components/shared/UserRatingBadge';
import { useRatings } from '@/hooks/useRatings';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  showUserRating?: boolean;
  linkTo?: string;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  showUserRating = true,
  linkTo 
}) => {
  const { ratingSummary } = useRatings(vehicle.user_id);
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // CORREGIDO: Solo verificar una condición para determinar si es el propietario
  const isOwner = user?.id === vehicle.user_id;
  
  console.log('🔍 VehicleCard Debug:', {
    currentUserId: user?.id,
    vehicleUserId: vehicle.user_id,
    isOwner,
    vehicleId: vehicle.id
  });
  
  const cardContent = (
    <Card className="bg-card border-border hover:border-primary/30 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div className="relative">
        <img
          src={vehicle.thumbnailUrl || vehicle.thumbnailurl || '/placeholder.svg'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        {vehicle.status === 'reserved' && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            {t('vehicles.statusReserved')}
          </Badge>
        )}
        {vehicle.status === 'in_auction' && (
          <Badge className="absolute top-2 right-2 bg-sky-500 text-white">
            {t('vehicles.statusInAuction')}
          </Badge>
        )}
        {isOwner && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-primary-foreground">
            {t('vehicles.yourVehicle')}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold truncate text-foreground">
          {vehicle.brand} {vehicle.model}
        </CardTitle>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(vehicle.price)}
          </span>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
            {vehicle.year}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Vehicle Details */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center gap-1.5 bg-muted/50 border border-border rounded-md px-2 py-1.5" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <Gauge className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
            <span className="text-xs font-semibold text-foreground">{vehicle.mileage?.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/50 border border-border rounded-md px-2 py-1.5" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <Fuel className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
            <span className="text-xs font-semibold text-foreground capitalize">{vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/50 border border-border rounded-md px-2 py-1.5" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <Settings className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
            <span className="text-xs font-semibold text-foreground capitalize">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/50 border border-border rounded-md px-2 py-1.5" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <Users className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
            <span className="text-xs font-semibold text-foreground">{vehicle.doors} {t('vehicles.doors').toLowerCase()}</span>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{vehicle.location}, {vehicle.country}</span>
        </div>
        
        {/* MEJORADO: Seller Section - Solo si NO es el propietario */}
        {!isOwner && vehicle.user_id && (
          <>
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">{t('vehicles.seller')}:</span>
                {showUserRating && ratingSummary && ratingSummary.total_ratings > 0 && (
                  <UserRatingBadge
                    averageRating={Number(ratingSummary.average_rating)}
                    totalRatings={Number(ratingSummary.total_ratings)}
                    verifiedRatings={Number(ratingSummary.verified_ratings)}
                    compact
                    showVerified={false}
                  />
                )}
              </div>
              
              <Link to={`/user/${vehicle.user_id}`} onClick={(e) => e.stopPropagation()}>
                <Button variant="outline" size="sm" className="w-full text-xs bg-secondary hover:bg-secondary/80 border-border text-foreground">
                  <User className="w-3 h-3 mr-1" />
                  {t('vehicles.viewSellerProfile')}
                </Button>
              </Link>
              
              <div className="text-center">
                <p className="text-xs text-primary font-medium">
                  💫 {t('vehicles.ratingInfo')}
                </p>
              </div>
            </div>
          </>
        )}

        {/* NUEVO: Mensaje para propios vehículos */}
        {isOwner && (
          <div className="pt-2 border-t border-border">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
              <p className="text-xs text-green-400 font-medium">
                📝 {t('vehicles.thisIsYourVehicle')}
              </p>
            </div>
          </div>
        )}
        
        {/* Creation Date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{t('vehicles.published')} {new Date(vehicle.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default VehicleCard;
