
import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SafeImage from '@/components/shared/SafeImage';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExchangeVehicles } from '@/hooks/useExchangeVehicles';
import ExchangeWithVehicleButton from '@/components/exchanges/ExchangeWithVehicleButton';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExchangeRequest {
  id: string;
  initiator_id: string;
  status: string;
  message: string | null;
  offered_vehicle_id: string | null;
  created_at: string;
  vehicle?: {
    brand: string;
    model: string;
    year: number;
  } | null;
}

const Exchanges: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  
  const { allExchangeVehicles, isLoading } = useExchangeVehicles();

  // Fetch exchange requests
  useEffect(() => {
    const fetchExchangeRequests = async () => {
      setLoadingRequests(true);
      try {
        const { data, error } = await supabase
          .from('exchanges')
          .select(`
            id, initiator_id, status, message, offered_vehicle_id, created_at,
            vehicle:vehicles!exchanges_offered_vehicle_id_fkey(brand, model, year)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setExchangeRequests(data || []);
      } catch (err) {
        console.error('Error fetching exchange requests:', err);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchExchangeRequests();
  }, []);

  // Filter vehicles based on search query and exclude user's own vehicles
  const filteredVehicles = allExchangeVehicles.filter(vehicle => {
    if (user?.id && vehicle.userId === user.id) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      vehicle.brand?.toLowerCase().includes(query) ||
      vehicle.model?.toLowerCase().includes(query) ||
      vehicle.location?.toLowerCase().includes(query) ||
      vehicle.country?.toLowerCase().includes(query)
    );
  });

  const handleBack = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Header con imagen de fondo */}
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-6 mx-4 mt-8">
        <div className="absolute inset-0">
          <SafeImage
            imageId="hero.exchanges"
            alt="Exchanges Background"
            className="w-full h-full object-cover object-[center_30%]"
            style={{ minHeight: '320px' }}
            loading="lazy"
            decoding="async"
          />
        </div>
        
        <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
          <div className="flex flex-col justify-between h-full">
            {/* Back button */}
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBack}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {user 
                  ? t('common.backToDashboard', { fallback: 'Volver al Panel de Control' })
                  : t('common.backToHome', { fallback: 'Volver a Inicio' })
                }
              </Button>
            </div>
            
            <div className="flex flex-col justify-end flex-1">
              {/* Title with independent mask */}
              <div className="mb-4 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {t('exchanges.title', { fallback: 'Intercambios de Vehículos' })}
                </h1>
              </div>
              
              {/* Description with independent mask */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit">
                <p className="text-lg text-white font-bold">
                  {t('exchanges.subtitle', { fallback: 'Encuentra oportunidades de intercambio' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Search section */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('exchanges.search', { fallback: 'Buscar vehículos' })}</CardTitle>
              <CardDescription>
                {t('exchanges.searchDescription', { fallback: 'Busca vehículos que otros usuarios quieren intercambiar' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="search">{t('exchanges.search', { fallback: 'Buscar vehículos' })}</Label>
                  <Input
                    id="search"
                    type="text"
                    placeholder={t('exchanges.searchPlaceholder', { fallback: 'Buscar por marca, modelo...' })}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={() => navigate('/exchange-form')} 
                  className="whitespace-nowrap"
                >
                  {t('exchanges.createRequest', { fallback: 'Crear Solicitud de Intercambio' })}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Exchange Requests + Available Vehicles */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="requests">
              {t('exchanges.myExchanges', { fallback: 'Solicitudes de Intercambio' })}
              {exchangeRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">{exchangeRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="vehicles">
              {t('exchanges.availableVehicles', { fallback: 'Vehículos Disponibles' })}
              {filteredVehicles.length > 0 && (
                <Badge variant="secondary" className="ml-2">{filteredVehicles.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Exchange Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>{t('exchanges.myExchanges', { fallback: 'Solicitudes de Intercambio' })}</CardTitle>
                <CardDescription>
                  {t('exchanges.exchangeRequestsDescription', { fallback: 'Solicitudes de intercambio publicadas por los usuarios' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRequests ? (
                  <div className="text-center py-8">
                    <p>{t('common.loading', { fallback: 'Cargando...' })}</p>
                  </div>
                ) : exchangeRequests.length > 0 ? (
                  <div className="space-y-4">
                    {exchangeRequests.map((request) => {
                      let messageData: any = {};
                      try {
                        messageData = request.message ? JSON.parse(request.message) : {};
                      } catch { /* ignore */ }
                      
                      const vehicleInfo = request.vehicle 
                        ? `${request.vehicle.brand} ${request.vehicle.model} (${request.vehicle.year})`
                        : messageData.initiator_vehicle 
                          ? `${messageData.initiator_vehicle.brand} ${messageData.initiator_vehicle.model} (${messageData.initiator_vehicle.year})`
                          : t('exchanges.unknownVehicle', { fallback: 'Vehículo no especificado' });

                      const preferences = messageData.target_preferences;
                      const isOwn = user?.id === request.initiator_id;

                      return (
                        <Card key={request.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <ArrowLeftRight className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold">{vehicleInfo}</h3>
                                {isOwn && (
                                  <Badge variant="outline" className="text-xs">
                                    {t('exchanges.yours', { fallback: 'Tu solicitud' })}
                                  </Badge>
                                )}
                              </div>
                              {preferences && (
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p><strong>{t('exchanges.brandsInterest')}:</strong> {preferences.brands}</p>
                                  <p><strong>{t('exchanges.countriesOrigin')}:</strong> {preferences.countries}</p>
                                </div>
                              )}
                              {messageData.initiator_vehicle?.kilometers && (
                                <p className="text-sm text-muted-foreground">
                                  {messageData.initiator_vehicle.kilometers} km
                                </p>
                              )}
                            </div>
                            <div className="text-right space-y-2">
                              <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                                {t(`exchanges.status.${request.status}`, { fallback: request.status })}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>{t('exchanges.noExchanges', { fallback: 'No hay solicitudes de intercambio disponibles' })}</p>
                    <Button 
                      onClick={() => navigate('/exchange-form')} 
                      variant="outline"
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('exchanges.createFirst', { fallback: 'Crea tu primera solicitud' })}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Available Vehicles Tab */}
          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle>{t('exchanges.availableVehicles', { fallback: 'Vehículos Disponibles para Intercambio' })}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>{t('common.loading', { fallback: 'Cargando...' })}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => (
                        <Card key={vehicle.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                <img 
                                  src={vehicle.thumbnailUrl || vehicle.thumbnailurl || '/placeholder.svg'} 
                                  alt={`${vehicle.brand} ${vehicle.model}`}
                                  className="w-24 h-20 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{vehicle.brand} {vehicle.model}</h3>
                                <p className="text-muted-foreground">{vehicle.year} - {vehicle.mileage?.toLocaleString()} km</p>
                                <p className="text-sm text-muted-foreground">{vehicle.location}</p>
                                <div className="flex items-center mt-1">
                                  <ArrowLeftRight className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground font-medium">
                                    {t('exchanges.acceptsExchange', { fallback: 'Acepta intercambio' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-3">
                              <p className="font-bold text-xl">{formatCurrency(vehicle.price || 0, vehicle.currency || 'EUR')}</p>
                              <ExchangeWithVehicleButton 
                                vehicleId={vehicle.id} 
                                sellerId={vehicle.userId}
                              />
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <p className="mb-2">
                          {searchQuery.trim() 
                            ? t('exchanges.noVehiclesFound', { fallback: 'No se encontraron vehículos que coincidan con tu búsqueda' })
                            : t('exchanges.noVehicles', { fallback: 'No hay vehículos disponibles para intercambio en este momento' })
                          }
                        </p>
                        {!searchQuery.trim() && user && (
                          <p className="text-sm text-muted-foreground">
                            {t('exchanges.ownVehiclesExcluded', { fallback: 'Nota: Tus propios vehículos no se muestran en esta lista' })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Exchanges;
