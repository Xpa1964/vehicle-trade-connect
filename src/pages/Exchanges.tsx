
import React, { useState } from 'react';
import { ArrowLeftRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExchangeVehicles } from '@/hooks/useExchangeVehicles';
import ExchangeWithVehicleButton from '@/components/exchanges/ExchangeWithVehicleButton';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';

const Exchanges: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  
  const { allExchangeVehicles, isLoading } = useExchangeVehicles();

  // Filter vehicles based on search query and exclude user's own vehicles
  const filteredVehicles = allExchangeVehicles.filter(vehicle => {
    // Exclude user's own vehicles (extra safety check in case backend filtering fails)
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
          <img 
            src="/images/exchanges-hero.png?v=2"
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

        {/* Vehicles grid */}
        <div className="grid grid-cols-1">
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
                            {/* Vehicle image */}
                            <div className="flex-shrink-0">
                              <img 
                                src={vehicle.thumbnailUrl || vehicle.thumbnailurl || '/placeholder.svg'} 
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="w-24 h-20 object-cover rounded"
                                onLoad={() => {
                                  console.log('Vehicle image loaded successfully:', { 
                                    vehicleId: vehicle.id, 
                                    thumbnailUrl: vehicle.thumbnailUrl, 
                                    thumbnailurl: vehicle.thumbnailurl,
                                    actualSrc: vehicle.thumbnailUrl || vehicle.thumbnailurl 
                                  });
                                }}
                                onError={(e) => {
                                  console.error('Vehicle image failed to load:', { 
                                    vehicleId: vehicle.id, 
                                    thumbnailUrl: vehicle.thumbnailUrl, 
                                    thumbnailurl: vehicle.thumbnailurl,
                                    actualSrc: vehicle.thumbnailUrl || vehicle.thumbnailurl 
                                  });
                                  e.currentTarget.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            
                            {/* Vehicle information */}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{vehicle.brand} {vehicle.model}</h3>
                              <p className="text-gray-600">{vehicle.year} - {vehicle.mileage?.toLocaleString()} km</p>
                              <p className="text-sm text-gray-500">{vehicle.location}</p>
                              <div className="flex items-center mt-1">
                                <ArrowLeftRight className="h-3 w-3 mr-1 text-gray-600" />
                                <span className="text-xs text-gray-600 font-medium">Acepta intercambio</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price and Exchange Button */}
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
                    <div className="text-center text-gray-500 py-8">
                      <p className="mb-2">
                        {searchQuery.trim() 
                          ? t('exchanges.noVehiclesFound', { fallback: 'No se encontraron vehículos que coincidan con tu búsqueda' })
                          : t('exchanges.noVehicles', { fallback: 'No hay vehículos disponibles para intercambio en este momento' })
                        }
                      </p>
                      {!searchQuery.trim() && user && (
                        <p className="text-sm text-gray-400">
                          {t('exchanges.ownVehiclesExcluded', { fallback: 'Nota: Tus propios vehículos no se muestran en esta lista' })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Exchanges;
