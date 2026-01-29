import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreateAuctionData } from '@/types/auction';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export const useCreateAuction = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (auctionData: CreateAuctionData) => {
      if (!user) throw new Error('Usuario no autenticado');

      // Validar fechas
      const now = new Date();
      const startDate = new Date(auctionData.start_date);
      const endDate = new Date(auctionData.end_date);

      if (startDate < now) {
        throw new Error(t('auctions.errors.pastStartDate', { 
          fallback: 'La fecha de inicio no puede ser en el pasado' 
        }));
      }

      if (endDate <= startDate) {
        throw new Error(t('auctions.errors.invalidEndDate', { 
          fallback: 'La fecha de fin debe ser posterior a la fecha de inicio' 
        }));
      }

      const minDuration = 24 * 60 * 60 * 1000; // 1 día en ms
      if (endDate.getTime() - startDate.getTime() < minDuration) {
        throw new Error(t('auctions.errors.minimumDuration', { 
          fallback: 'La subasta debe durar al menos 1 día' 
        }));
      }

      // Crear la subasta
      const { data, error } = await supabase
        .from('auctions')
        .insert({
          vehicle_id: auctionData.vehicle_id,
          seller_id: user.id,
          created_by: user.id,
          starting_price: auctionData.starting_price,
          reserve_price: auctionData.reserve_price || null,
          current_price: auctionData.starting_price,
          increment_minimum: auctionData.increment_minimum || 50,
          start_date: auctionData.start_date,
          start_time: auctionData.start_date,
          end_date: auctionData.end_date,
          end_time: auctionData.end_date,
          description: auctionData.description || null,
          terms_accepted: auctionData.terms_accepted,
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
      
      toast.success(
        t('auctions.createSuccess', { 
          fallback: '¡Subasta creada con éxito!' 
        })
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('auctions.createError', { fallback: 'Error al crear la subasta' }));
    },
  });
};
