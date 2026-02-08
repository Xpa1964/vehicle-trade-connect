/**
 * HOOK DE PUJAS - KONTACT VO
 * Documento Capa 2: Gestión de Pujas
 * 
 * Este hook consume la función backend place_bid que implementa:
 * - Validación completa en backend
 * - Control de concurrencia
 * - Anti-sniping con extensión automática
 * - Registro inmutable de eventos
 * 
 * El frontend NO valida reglas críticas - solo mejora UX
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface PlaceBidParams {
  auctionId: string;
  amount: number;
}

interface PlaceBidResponse {
  success: boolean;
  bid_id?: string;
  amount?: number;
  previous_price?: number;
  extended?: boolean;
  new_end_date?: string;
  message?: string;
  error_code?: string;
  error_message?: string;
  current_price?: number;
  increment_minimum?: number;
  minimum_bid?: number;
}

export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({ auctionId, amount }: PlaceBidParams): Promise<PlaceBidResponse> => {
      // Obtener usuario autenticado
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData.user) {
        throw new Error(t('auctions.errors.notAuthenticated', { 
          fallback: 'Debes iniciar sesión para pujar' 
        }));
      }
      
      // Llamar a la función backend - TODA la validación ocurre allí
      const { data, error } = await supabase.rpc('place_bid', {
        p_auction_id: auctionId,
        p_bidder_id: userData.user.id,
        p_amount: amount,
      });

      if (error) {
        throw new Error(error.message);
      }

      // La función devuelve JSONB con el resultado
      const response = data as unknown as PlaceBidResponse;
      
      if (!response.success) {
        // Mapear códigos de error a mensajes traducidos
        const errorMessages: Record<string, string> = {
          'AUCTION_NOT_FOUND': t('auctions.errors.notFound', { fallback: 'La subasta no existe' }),
          'AUCTION_NOT_ACTIVE': t('auctions.errors.notActive', { fallback: 'La subasta no está activa' }),
          'AUCTION_EXPIRED': t('auctions.errors.expired', { fallback: 'La subasta ha finalizado' }),
          'SELLER_CANNOT_BID': t('auctions.errors.sellerCannotBid', { fallback: 'No puedes pujar en tu propia subasta' }),
          'INVALID_AMOUNT': t('auctions.errors.invalidAmount', { fallback: 'El monto debe ser mayor a 0' }),
          'BELOW_MINIMUM_INCREMENT': t('auctions.errors.belowMinimum', { 
            fallback: `Puja mínima: ${response.minimum_bid}` 
          }),
          'INTERNAL_ERROR': t('auctions.errors.internal', { fallback: 'Error interno del servidor' }),
        };

        const message = errorMessages[response.error_code || ''] || response.error_message || 'Error desconocido';
        throw new Error(message);
      }

      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidar queries para actualizar datos en tiempo real
      queryClient.invalidateQueries({ queryKey: ['auction', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      
      // Mostrar mensaje de éxito
      if (data.extended) {
        toast.success(
          t('auctions.bidPlacedExtended', { 
            fallback: '¡Puja aceptada! Subasta extendida por anti-sniping.' 
          }),
          {
            description: t('auctions.newEndTime', { 
              fallback: `Nueva hora de cierre: ${new Date(data.new_end_date!).toLocaleTimeString()}` 
            })
          }
        );
      } else {
        toast.success(
          t('auctions.bidPlacedSuccess', { 
            fallback: '¡Puja realizada con éxito!' 
          })
        );
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
