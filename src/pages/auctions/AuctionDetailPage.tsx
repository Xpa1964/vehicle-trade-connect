import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuctionDetail } from '@/hooks/auctions/useAuctionDetail';
import { useAuctionRealtime } from '@/hooks/auctions/useAuctionRealtime';
import { AuctionTimer } from '@/components/auctions/AuctionTimer';
import { BidForm } from '@/components/auctions/BidForm';
import { BidHistory } from '@/components/auctions/BidHistory';
import { SellerDecisionPanel } from '@/components/auctions/SellerDecisionPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/formatters';
import { ArrowLeft, Eye, Gauge, Fuel, Settings, MapPin, Calendar, User } from 'lucide-react';

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const { data: auction, isLoading, error } = useAuctionDetail(id);
  
  // Suscribirse a cambios en tiempo real
  useAuctionRealtime(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('auctions.loading', { fallback: 'Cargando subasta...' })}</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {t('auctions.notFound', { fallback: 'Subasta no encontrada' })}
          </p>
          <Link to="/auctions">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('auctions.backToAuctions', { fallback: 'Volver a Subastas' })}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const vehicle = auction.vehicle;
  if (!vehicle) return null;

  const mainImage = vehicle.thumbnailurl || '/placeholder.svg';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Buttons */}
      <div className="flex gap-3 mb-6">
        <Link to="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('navigation.backToDashboard', { fallback: 'Volver al Panel' })}
          </Button>
        </Link>
        <Link to="/auctions">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('auctions.backToAuctions', { fallback: 'Volver a Subastas' })}
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Vehicle Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <Card>
            <CardContent className="p-0">
              <img
                src={mainImage}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-96 object-cover rounded-t-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </CardContent>
          </Card>

          {/* Vehicle Specs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {vehicle.brand} {vehicle.model} ({vehicle.year})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">{t('vehicles.mileage', { fallback: 'Kilometraje' })}</p>
                    <p className="font-semibold">{vehicle.mileage?.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">{t('vehicles.fuel', { fallback: 'Combustible' })}</p>
                    <p className="font-semibold capitalize">{vehicle.fuel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">{t('vehicles.transmission', { fallback: 'Transmisión' })}</p>
                    <p className="font-semibold capitalize">{vehicle.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">{t('vehicles.location', { fallback: 'Ubicación' })}</p>
                    <p className="font-semibold">{vehicle.location}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {(vehicle.description || auction.description) && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">
                    {t('auctions.description', { fallback: 'Descripción' })}
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {auction.description || vehicle.description}
                  </p>
                </div>
              )}

              {/* View Full Vehicle */}
              <div className="border-t pt-4 mt-4">
                <Link 
                  to={`/vehicle-preview/${vehicle.id}`}
                  state={{ fromAuction: auction.id }}
                >
                  <Button className="w-full" size="lg">
                    <Eye className="w-5 h-5 mr-2" />
                    {t('auctions.viewFullVehicle', { fallback: 'Ver Ficha Completa del Vehículo' })}
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {t('auctions.viewFullVehicleHint', { 
                    fallback: 'Accede a todas las fotos y especificaciones técnicas' 
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bid History */}
          <BidHistory bids={auction.bids || []} currentUserId={user?.id} />
        </div>

        {/* Right Column - Auction Info & Bidding */}
        <div className="space-y-6">
          {/* Auction Status & Timer */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('auctions.auctionDetails', { fallback: 'Detalles de Subasta' })}</CardTitle>
                <Badge className={auction.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                  {t(`auctions.status${auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}`, { 
                    fallback: auction.status 
                  })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <AuctionTimer
                startDate={auction.start_date}
                endDate={auction.end_date}
                status={auction.status}
              />

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('auctions.startingPrice', { fallback: 'Precio Inicial' })}:</span>
                  <span className="font-semibold">{formatPrice(auction.starting_price)}</span>
                </div>
                {/* reserve_price solo visible para el vendedor */}
                {auction.reserve_price && user?.id === (auction as any).seller_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('auctions.reservePrice', { fallback: 'Precio de Reserva' })}:</span>
                    <span className="font-semibold">{formatPrice(auction.reserve_price)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('auctions.incrementMinimum', { fallback: 'Incremento Mínimo' })}:</span>
                  <span className="font-semibold">{formatPrice(auction.increment_minimum)}</span>
                </div>
              </div>

              {/* Seller Info */}
              {auction.creator && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {t('auctions.seller', { fallback: 'Vendedor' })}:
                    </span>
                  </div>
                  <p className="font-semibold">
                    {auction.creator.company_name || auction.creator.full_name}
                  </p>
                  <Link to={`/user/${auction.creator.id}`}>
                    <Button variant="link" className="p-0 h-auto text-blue-600">
                      {t('auctions.viewSellerProfile', { fallback: 'Ver perfil del vendedor' })}
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seller Decision Panel - Solo visible para vendedor en ENDED_PENDING_ACCEPTANCE */}
          <SellerDecisionPanel auction={auction} />

          {/* Bid Form - Solo visible cuando la subasta está activa */}
          <BidForm auction={auction} />
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailPage;
