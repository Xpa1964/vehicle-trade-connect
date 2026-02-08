/**
 * useSellerDecision - Hook para acciones del vendedor en Capa 3
 * 
 * Documento Oficial Capa 3:
 * - Aceptar resultado: ENDED_PENDING_ACCEPTANCE → ACCEPTED
 * - Rechazar resultado: ENDED_PENDING_ACCEPTANCE → REJECTED
 * 
 * Todas las acciones son:
 * - Explícitas (no implícitas)
 * - Irreversibles
 * - Solo ejecutables por seller_id
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface DecisionResult {
  success: boolean;
  error_code?: string;
  error_message?: string;
  auction_id?: string;
  new_status?: string;
  winner_id?: string;
  final_amount?: number;
  message?: string;
  reason?: string;
}

export const useAcceptAuctionResult = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (auctionId: string): Promise<DecisionResult> => {
      if (!user?.id) {
        return {
          success: false,
          error_code: 'NOT_AUTHENTICATED',
          error_message: 'Debes iniciar sesión para realizar esta acción'
        };
      }

      console.log(`[useAcceptAuctionResult] Calling accept_auction_result for auction ${auctionId}`);

      const { data, error } = await supabase.rpc('accept_auction_result', {
        p_auction_id: auctionId,
        p_seller_id: user.id
      });

      if (error) {
        console.error('[useAcceptAuctionResult] RPC error:', error);
        throw new Error(error.message);
      }

      const result = data as unknown as DecisionResult;
      
      if (!result.success) {
        console.error('[useAcceptAuctionResult] Backend rejection:', result);
        throw new Error(result.error_message || 'Error desconocido');
      }

      return result;
    },
    onSuccess: (result, auctionId) => {
      console.log('[useAcceptAuctionResult] Success:', result);
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      
      toast.success(
        t('auctions.result.acceptedSuccess', { 
          fallback: '¡Resultado aceptado! Los datos de contacto serán compartidos.' 
        })
      );
    },
    onError: (error: Error) => {
      console.error('[useAcceptAuctionResult] Error:', error);
      toast.error(error.message);
    }
  });
};

export const useRejectAuctionResult = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      auctionId, 
      reason 
    }: { 
      auctionId: string; 
      reason?: string;
    }): Promise<DecisionResult> => {
      if (!user?.id) {
        return {
          success: false,
          error_code: 'NOT_AUTHENTICATED',
          error_message: 'Debes iniciar sesión para realizar esta acción'
        };
      }

      console.log(`[useRejectAuctionResult] Calling reject_auction_result for auction ${auctionId}`);

      const { data, error } = await supabase.rpc('reject_auction_result', {
        p_auction_id: auctionId,
        p_seller_id: user.id,
        p_reason: reason || null
      });

      if (error) {
        console.error('[useRejectAuctionResult] RPC error:', error);
        throw new Error(error.message);
      }

      const result = data as unknown as DecisionResult;
      
      if (!result.success) {
        console.error('[useRejectAuctionResult] Backend rejection:', result);
        throw new Error(result.error_message || 'Error desconocido');
      }

      return result;
    },
    onSuccess: (result, { auctionId }) => {
      console.log('[useRejectAuctionResult] Success:', result);
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      
      toast.success(
        t('auctions.result.rejectedSuccess', { 
          fallback: 'Resultado rechazado. El vehículo está disponible nuevamente.' 
        })
      );
    },
    onError: (error: Error) => {
      console.error('[useRejectAuctionResult] Error:', error);
      toast.error(error.message);
    }
  });
};
