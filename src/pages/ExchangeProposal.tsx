
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useExchangeVehicles } from '@/hooks/useExchangeVehicles';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ExchangeProposal: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // CORREGIDO: Usar targetVehicleId como está en la URL
  const targetVehicleId = searchParams.get('targetVehicleId');
  const sellerId = searchParams.get('sellerId');
  
  const { userVehicles, isLoading } = useExchangeVehicles();
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [compensation, setCompensation] = useState<number>(0);
  const [conditions, setConditions] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSelectedVehicleId('');
    setCompensation(0);
    setConditions('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== DEBUGGING EXCHANGE PROPOSAL ===');
    console.log('Target Vehicle ID:', targetVehicleId);
    console.log('Seller ID:', sellerId);
    console.log('User ID:', user?.id);
    console.log('Selected Vehicle ID:', selectedVehicleId);
    console.log('Compensation:', compensation);
    console.log('Conditions:', conditions);
    
    if (!selectedVehicleId) {
      toast.error(t('exchanges.selectVehicleToOffer', { fallback: 'Selecciona un vehículo a ofrecer' }));
      return;
    }

    if (!targetVehicleId || !sellerId || !user?.id) {
      toast.error(t('exchanges.missingInformation', { fallback: 'Información faltante' }));
      return;
    }

    // Prevent self-exchange: check if user is trying to exchange with their own vehicle
    if (sellerId === user.id) {
      toast.error(t('exchanges.cannotExchangeWithSelf', { fallback: 'No puedes proponer un intercambio con tu propio vehículo' }));
      return;
    }

    // Additional safety check: verify the selected vehicle belongs to the user
    const selectedVehicle = userVehicles.find(v => v.id === selectedVehicleId);
    if (!selectedVehicle || selectedVehicle.userId !== user.id) {
      toast.error(t('exchanges.vehicleNotBelongsToUser', { fallback: 'El vehículo seleccionado no te pertenece' }));
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('=== STARTING PROPOSAL SUBMISSION ===');
      
      // 1. Verificar que los vehículos existen y obtener datos completos
      const { data: targetVehicle, error: targetVehicleError } = await supabase
        .from('vehicles')
        .select('id, brand, model, year, price, thumbnailurl, mileage, location, condition')
        .eq('id', targetVehicleId)
        .single();

      if (targetVehicleError || !targetVehicle) {
        console.error('Target vehicle not found:', targetVehicleError);
        toast.error('El vehículo objetivo no existe');
        return;
      }

      const { data: offeredVehicle, error: offeredVehicleError } = await supabase
        .from('vehicles')
        .select('id, brand, model, year, price, thumbnailurl, mileage, location, condition')
        .eq('id', selectedVehicleId)
        .single();

      if (offeredVehicleError || !offeredVehicle) {
        console.error('Offered vehicle not found:', offeredVehicleError);
        toast.error('El vehículo ofrecido no existe');
        return;
      }

      console.log('Vehicles verified:', { targetVehicle, offeredVehicle });
      
      // 2. Crear o encontrar una conversación existente
      let conversationId: string;
      
      const { data: existingConversation, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('seller_id', sellerId)
        .eq('buyer_id', user.id)
        .eq('vehicle_id', targetVehicleId)
        .maybeSingle();

      if (searchError) {
        console.error('Error searching for existing conversation:', searchError);
        throw searchError;
      }

      if (existingConversation) {
        conversationId = existingConversation.id;
        console.log('Found existing conversation:', conversationId);
      } else {
        console.log('Creating new conversation...');
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            seller_id: sellerId,
            buyer_id: user.id,
            vehicle_id: targetVehicleId,
            source_type: 'exchange_proposal',
            status: 'active'
          })
          .select('id')
          .single();

        if (conversationError) {
          console.error('Error creating conversation:', conversationError);
          throw conversationError;
        }
        conversationId = newConversation.id;
        console.log('Created new conversation:', conversationId);
      }

      // 3. Crear el registro en la tabla exchanges (para el panel de admin)
      console.log('Creating exchange record...');
      const { data: exchangeData, error: exchangeError } = await supabase
        .from('exchanges')
        .insert({
          initiator_id: user.id,
          offered_vehicle_id: selectedVehicleId,
          requested_vehicle_id: targetVehicleId,
          target_vehicle_id: targetVehicleId,
          compensation: compensation,
          conditions: conditions ? [conditions] : [],
          conversation_id: conversationId,
          status: 'pending'
        })
        .select('id')
        .single();

      if (exchangeError) {
        console.error('Error creating exchange record:', exchangeError);
        throw exchangeError;
      }

      console.log('Exchange record created:', exchangeData.id);

      // 4. Crear el mensaje con la propuesta de intercambio (MEJORADO con más datos)
      const proposalData = {
        type: 'exchange_proposal',
        offeredVehicleId: selectedVehicleId,
        requestedVehicleId: targetVehicleId,
        offeredVehicleDetails: {
          brand: offeredVehicle.brand,
          model: offeredVehicle.model,
          year: offeredVehicle.year,
          price: offeredVehicle.price,
          thumbnailUrl: offeredVehicle.thumbnailurl,
          mileage: offeredVehicle.mileage,
          location: offeredVehicle.location,
          condition: offeredVehicle.condition
        },
        compensation: compensation,
        conditions: conditions,
        status: 'pending',
        exchangeId: exchangeData.id,
        created_at: new Date().toISOString()
      };

      console.log('Inserting message with proposal data:', proposalData);

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: JSON.stringify(proposalData)
        });

      if (messageError) {
        console.error('Error inserting message:', messageError);
        throw messageError;
      }

      console.log('=== PROPOSAL SENT SUCCESSFULLY ===');

      // 5. Mostrar mensaje de éxito
      toast.success(t('exchanges.proposalSent', { fallback: 'Propuesta Enviada' }), {
        description: t('exchanges.proposalSentDescription', { fallback: 'Tu propuesta de intercambio ha sido enviada correctamente' })
      });

      // 6. Limpiar el formulario
      resetForm();

      // 7. Navegar a mensajes después de un breve delay
      setTimeout(() => {
        navigate('/messages');
      }, 1500);

    } catch (error) {
      console.error('=== ERROR SENDING EXCHANGE PROPOSAL ===');
      console.error('Error details:', error);
      toast.error(t('exchanges.errorSendingProposal', { fallback: 'Error enviando propuesta' }), {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('common.loading', { fallback: 'Cargando...' })}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.goBack', { fallback: 'Volver' })}
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('exchanges.proposeExchange', { fallback: 'Proponer Intercambio' })}</CardTitle>
          <CardDescription>
            {t('exchanges.selectVehicleToOffer', { fallback: 'Selecciona el vehículo que quieres ofrecer' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="vehicle-select">
                {t('exchanges.selectVehicle', { fallback: 'Seleccionar vehículo' })} *
              </Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('exchanges.selectVehicleToOffer', { fallback: 'Selecciona un vehículo' })} />
                </SelectTrigger>
                <SelectContent>
                  {userVehicles.length > 0 ? (
                    userVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} {vehicle.year} - {vehicle.mileage?.toLocaleString()} km
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-vehicles" disabled>
                      {t('exchanges.noVehiclesAvailable', { fallback: 'No hay vehículos disponibles' })}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="compensation">
                {t('exchanges.compensation', { fallback: 'Compensación adicional' })} (€)
              </Label>
              <Input
                id="compensation"
                type="number"
                min="0"
                step="100"
                value={compensation}
                onChange={(e) => setCompensation(Number(e.target.value))}
                placeholder="0"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {t('exchanges.compensationDescription', { fallback: 'Compensación económica adicional si es necesaria' })}
              </p>
            </div>

            <div>
              <Label htmlFor="conditions">
                {t('exchanges.additionalConditions', { fallback: 'Condiciones adicionales' })}
              </Label>
              <Textarea
                id="conditions"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder={t('exchanges.conditionsPlaceholder', { fallback: 'Ej: El vehículo debe ser inspeccionado antes del intercambio' })}
                className="mt-1"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-1">
                {t('exchanges.conditionsDescription', { fallback: 'Especifica cualquier condición especial para el intercambio' })}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
                disabled={isSubmitting}
              >
                {t('common.cancel', { fallback: 'Cancelar' })}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedVehicleId || userVehicles.length === 0}
                className="flex-1"
              >
                {isSubmitting 
                  ? t('common.loading', { fallback: 'Enviando...' }) 
                  : t('exchanges.sendProposal', { fallback: 'Enviar Propuesta' })
                }
              </Button>
            </div>

            {userVehicles.length === 0 && (
              <div className="text-center p-4 bg-yellow-50 rounded-md">
                <p className="text-yellow-800">
                  {t('exchanges.noVehiclesToOffer', { fallback: 'No tienes vehículos para ofrecer' })}
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  {t('exchanges.addVehicleFirst', { fallback: 'Debes agregar un vehículo primero' })}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeProposal;
