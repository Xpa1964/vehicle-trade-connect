import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Auction } from '@/types/auction';
import { formatPrice } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { AuctionTimer } from './AuctionTimer';
import { Gauge, Fuel, Settings, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuctionCardProps {
  auction: Auction;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const { t } = useLanguage();
  const vehicle = auction.vehicle;

  if (!vehicle) return null;

  const getStatusBadge = () => {
    // Estados oficiales según Documento Capa 1
    const badges: Record<string, { text: string; class: string }> = {
      draft: { text: t('auctions.statusDraft', { fallback: 'Borrador' }), class: 'bg-slate-400' },
      scheduled: { text: t('auctions.statusScheduled', { fallback: 'Próximamente' }), class: 'bg-blue-500' },
      active: { text: t('auctions.statusActive', { fallback: 'Activa' }), class: 'bg-green-500' },
      ended_pending_acceptance: { text: t('auctions.statusPendingAcceptance', { fallback: 'Pendiente Decisión' }), class: 'bg-amber-500' },
      accepted: { text: t('auctions.statusAccepted', { fallback: 'Aceptada' }), class: 'bg-emerald-600' },
      rejected: { text: t('auctions.statusRejected', { fallback: 'Rechazada' }), class: 'bg-red-500' },
      contact_shared: { text: t('auctions.statusContactShared', { fallback: 'Contacto Compartido' }), class: 'bg-purple-500' },
      closed: { text: t('auctions.statusClosed', { fallback: 'Cerrada' }), class: 'bg-gray-500' },
    };

    const badge = badges[auction.status] || badges.draft;

    return (
      <Badge className={`${badge.class} text-white`}>
        {badge.text}
      </Badge>
    );
  };

  return (
    <Link to={`/auctions/${auction.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
        <div className="relative">
          <img
            src={vehicle.thumbnailurl || '/placeholder.svg'}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-2 right-2">
            {getStatusBadge()}
          </div>
          {auction.reserve_price && auction.current_price < auction.reserve_price && (
            <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
              {t('auctions.hasReserve', { fallback: 'Con Reserva' })}
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold truncate">
            {vehicle.brand} {vehicle.model}
          </CardTitle>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">
                {t('auctions.currentBid', { fallback: 'Puja Actual' })}
              </p>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(auction.current_price)}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {vehicle.year}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Timer */}
          <AuctionTimer 
            startDate={auction.start_date}
            endDate={auction.end_date}
            status={auction.status}
          />

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Gauge className="w-4 h-4" />
              <span>{vehicle.mileage?.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span className="capitalize">{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="w-4 h-4" />
              <span className="capitalize">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{vehicle.location}</span>
            </div>
          </div>

          {/* Bids Info */}
          {auction.bids && auction.bids.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                {auction.bids.length} {t('auctions.bidsCount', { fallback: 'pujas' })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
