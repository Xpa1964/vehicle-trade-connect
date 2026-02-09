import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateAuction } from '@/hooks/auctions/useCreateAuction';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SafeImage from '@/components/shared/SafeImage';
import { Gavel, Calendar, DollarSign, TrendingUp, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const PublishAuctionPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createAuction = useCreateAuction();

  const [step, setStep] = useState(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [formData, setFormData] = useState({
    starting_price: '',
    reserve_price: '',
    increment_minimum: '50',
    start_date: '',
    end_date: '',
    description: '',
    terms_accepted: false,
  });

  // Cargar vehículos disponibles del usuario
  const { data: vehicles, isLoading: loadingVehicles } = useQuery({
    queryKey: ['my-available-vehicles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSubmit = async () => {
    if (!selectedVehicleId) {
      toast.error(t('auctions.selectVehicle', { fallback: 'Debes seleccionar un vehículo' }));
      return;
    }

    if (!formData.terms_accepted) {
      toast.error(t('auctions.acceptTerms', { fallback: 'Debes aceptar los términos y condiciones' }));
      return;
    }

    await createAuction.mutateAsync({
      vehicle_id: selectedVehicleId,
      starting_price: parseFloat(formData.starting_price),
      reserve_price: formData.reserve_price ? parseFloat(formData.reserve_price) : undefined,
      increment_minimum: parseFloat(formData.increment_minimum),
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
      description: formData.description || undefined,
      terms_accepted: formData.terms_accepted,
    });

    navigate('/auctions');
  };

  const selectedVehicle = vehicles?.find(v => v.id === selectedVehicleId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
        <div className="absolute inset-0">
          <SafeImage
            imageId="hero.auctions"
            alt={t('auctions.publishAuction')}
            className="w-full h-full object-cover object-center"
            style={{ minHeight: '320px' }}
          />
        </div>
        
        <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
          <div className="flex flex-col justify-between h-full">
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('navigation.backToControlPanel')}
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col justify-end">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {t('auctions.publishAuction', { fallback: 'Publicar Subasta' })}
                </h1>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit mt-3">
                <p className="text-lg text-white font-bold">
                  {t('auctions.publishDescription', { fallback: 'Crea una subasta para vender tu vehículo al mejor postor' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded ${step >= s ? 'bg-primary' : 'bg-muted'}`} />
              <p className={`text-center mt-2 text-sm ${step >= s ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                {s === 1 && t('auctions.step1', { fallback: 'Vehículo' })}
                {s === 2 && t('auctions.step2', { fallback: 'Configuración' })}
                {s === 3 && t('auctions.step3', { fallback: 'Confirmar' })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Vehicle */}
      {step === 1 && (
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>{t('auctions.selectVehicle', { fallback: 'Selecciona el Vehículo' })}</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingVehicles ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('auctions.loading', { fallback: 'Cargando vehículos...' })}</p>
              </div>
            ) : vehicles && vehicles.length > 0 ? (
              <div className="space-y-4">
                <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('auctions.chooseVehicle', { fallback: 'Elige un vehículo...' })} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} ({vehicle.year}) - {vehicle.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedVehicle && (
                  <div className="border rounded-lg p-4 flex gap-4">
                    <img
                      src={selectedVehicle.thumbnailurl || '/placeholder.svg'}
                      alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedVehicle.brand} {selectedVehicle.model}
                      </h3>
                      <p className="text-muted-foreground">{selectedVehicle.year}</p>
                      <p className="text-muted-foreground">{selectedVehicle.mileage?.toLocaleString()} km</p>
                      <p className="text-muted-foreground">{selectedVehicle.location}, {selectedVehicle.country}</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedVehicleId}
                  className="w-full"
                >
                  {t('auctions.continue', { fallback: 'Continuar' })}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {t('auctions.noAvailableVehicles', { fallback: 'No tienes vehículos disponibles para subasta' })}
                </p>
                <Button onClick={() => navigate('/vehicle-management')}>
                  {t('auctions.addVehicle', { fallback: 'Publicar Vehículo' })}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Configuration */}
      {step === 2 && (
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>{t('auctions.auctionConfiguration', { fallback: 'Configuración de Subasta' })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="starting_price">{t('auctions.startingPrice', { fallback: 'Precio Inicial' })} *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="starting_price"
                    type="number"
                    step="0.01"
                    value={formData.starting_price}
                    onChange={(e) => setFormData({ ...formData, starting_price: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reserve_price">{t('auctions.reservePrice', { fallback: 'Precio de Reserva' })} ({t('auctions.optional', { fallback: 'opcional' })})</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="reserve_price"
                    type="number"
                    step="0.01"
                    value={formData.reserve_price}
                    onChange={(e) => setFormData({ ...formData, reserve_price: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="increment_minimum">{t('auctions.incrementMinimum', { fallback: 'Incremento Mínimo' })}</Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="increment_minimum"
                    type="number"
                    step="0.01"
                    value={formData.increment_minimum}
                    onChange={(e) => setFormData({ ...formData, increment_minimum: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">{t('auctions.startDate', { fallback: 'Fecha de Inicio' })} *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="end_date">{t('auctions.endDate', { fallback: 'Fecha de Fin' })} *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">{t('auctions.description', { fallback: 'Descripción' })} ({t('auctions.optional', { fallback: 'opcional' })})</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder={t('auctions.descriptionPlaceholder', { fallback: 'Agrega información adicional sobre la subasta...' })}
              />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('auctions.back', { fallback: 'Atrás' })}
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!formData.starting_price || !formData.start_date || !formData.end_date}
                className="flex-1"
              >
                {t('auctions.continue', { fallback: 'Continuar' })}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>{t('auctions.confirmAuction', { fallback: 'Confirmar Subasta' })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">{t('auctions.summary', { fallback: 'Resumen' })}</h3>
              {selectedVehicle && (
                <>
                  <p><strong>{t('auctions.vehicle', { fallback: 'Vehículo' })}:</strong> {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})</p>
                  <p><strong>{t('auctions.startingPrice', { fallback: 'Precio Inicial' })}:</strong> €{formData.starting_price}</p>
                  {formData.reserve_price && (
                    <p><strong>{t('auctions.reservePrice', { fallback: 'Precio de Reserva' })}:</strong> €{formData.reserve_price}</p>
                  )}
                  <p><strong>{t('auctions.incrementMinimum', { fallback: 'Incremento Mínimo' })}:</strong> €{formData.increment_minimum}</p>
                  <p><strong>{t('auctions.duration', { fallback: 'Duración' })}:</strong> {new Date(formData.start_date).toLocaleString()} - {new Date(formData.end_date).toLocaleString()}</p>
                  {formData.description && (
                    <p><strong>{t('auctions.description', { fallback: 'Descripción' })}:</strong> {formData.description}</p>
                  )}
                </>
              )}
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.terms_accepted}
                onCheckedChange={(checked) => setFormData({ ...formData, terms_accepted: checked as boolean })}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                {t('auctions.termsText', { 
                  fallback: 'Acepto los términos y condiciones de las subastas. Entiendo que al publicar esta subasta, me comprometo a vender el vehículo al mejor postor si se cumple el precio de reserva.' 
                })}
              </Label>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('auctions.back', { fallback: 'Atrás' })}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.terms_accepted || createAuction.isPending}
                className="flex-1"
              >
                {createAuction.isPending 
                  ? t('auctions.publishing', { fallback: 'Publicando...' })
                  : t('auctions.publishAuction', { fallback: 'Publicar Subasta' })
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PublishAuctionPage;
