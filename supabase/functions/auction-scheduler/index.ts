/**
 * AUCTION SCHEDULER - KONTACT VO
 * Documento Capa 1: Estados y Transiciones
 * 
 * Transiciones automáticas implementadas:
 * - SCHEDULED → ACTIVE (cuando start_date <= NOW)
 * - ACTIVE → ENDED_PENDING_ACCEPTANCE (cuando end_date <= NOW)
 * - ACCEPTED → CONTACT_SHARED (automático tras aceptación)
 * - CONTACT_SHARED → CLOSED (automático tras compartir contacto)
 * 
 * PROHIBIDO: Saltar estados, revertir estados, modificar estados pasados
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Tipos según Documento Capa 1
type AuctionStatus = 
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'ended_pending_acceptance'
  | 'accepted'
  | 'rejected'
  | 'contact_shared'
  | 'closed';

interface SchedulerResponse {
  activated: number;
  ended: number;
  contact_shared: number;
  closed: number;
  timestamp: string;
  errors: string[];
}

/**
 * Registra una transición de estado en la tabla de auditoría inmutable
 */
async function logStateTransition(
  auctionId: string,
  fromStatus: AuctionStatus | null,
  toStatus: AuctionStatus,
  triggeredBy: string | null,
  triggerType: 'automatic' | 'manual' | 'admin',
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const { error } = await supabase
    .from('auction_state_transitions')
    .insert({
      auction_id: auctionId,
      from_status: fromStatus,
      to_status: toStatus,
      triggered_by: triggeredBy,
      trigger_type: triggerType,
      metadata: {
        ...metadata,
        processed_at: new Date().toISOString(),
        scheduler_version: '1.0.0'
      }
    });

  if (error) {
    console.error(`Error logging transition for auction ${auctionId}:`, error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // ============================================
  // AUTENTICACIÓN: Solo service_role_key puede invocar
  // ============================================
  const authHeader = req.headers.get('Authorization');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  
  if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized', message: 'Invalid or missing service role key' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  const response: SchedulerResponse = {
    activated: 0,
    ended: 0,
    contact_shared: 0,
    closed: 0,
    timestamp: new Date().toISOString(),
    errors: []
  };

  try {
    // Scheduler run starts
    const now = new Date().toISOString();

    // ============================================
    // TRANSICIÓN 1: SCHEDULED → ACTIVE
    // Condición: start_date <= NOW()
    // ============================================
    const { data: scheduledAuctions, error: scheduledError } = await supabase
      .from('auctions')
      .select('id, vehicle_id, seller_id, start_date')
      .eq('status', 'scheduled')
      .lte('start_date', now)
      .order('start_date', { ascending: true });

    if (scheduledError) {
      console.error('Error fetching scheduled auctions:', scheduledError);
      response.errors.push(`scheduled_fetch: ${scheduledError.message}`);
    } else if (scheduledAuctions && scheduledAuctions.length > 0) {
      
      for (const auction of scheduledAuctions) {
        const { error: updateError } = await supabase
          .from('auctions')
          .update({ 
            status: 'active',
            updated_at: now
          })
          .eq('id', auction.id)
          .eq('status', 'scheduled'); // Doble verificación para evitar race conditions

        if (updateError) {
          console.error(`Error activating auction ${auction.id}:`, updateError);
          response.errors.push(`activate_${auction.id}: ${updateError.message}`);
          continue;
        }

        // Actualizar estado del vehículo
        if (auction.vehicle_id) {
          await supabase
            .from('vehicles')
            .update({ status: 'in_auction' })
            .eq('id', auction.vehicle_id);
        }

        // Registrar transición inmutable
        await logStateTransition(
          auction.id,
          'scheduled',
          'active',
          null,
          'automatic',
          { start_date: auction.start_date }
        );

        response.activated++;
        response.activated++;
      }
    }

    // ============================================
    // TRANSICIÓN 2: ACTIVE → ENDED_PENDING_ACCEPTANCE
    // Condición: end_date <= NOW()
    // ============================================
    const { data: expiredAuctions, error: expiredError } = await supabase
      .from('auctions')
      .select('id, vehicle_id, seller_id, current_price, reserve_price, end_date, vehicle:vehicles(brand, model, year)')
      .eq('status', 'active')
      .lte('end_date', now)
      .order('end_date', { ascending: true });

    if (expiredError) {
      console.error('Error fetching expired auctions:', expiredError);
      response.errors.push(`expired_fetch: ${expiredError.message}`);
    } else if (expiredAuctions && expiredAuctions.length > 0) {
      
      for (const auction of expiredAuctions) {
        // Obtener la puja más alta
        const { data: highestBid } = await supabase
          .from('bids')
          .select('bidder_id, amount')
          .eq('auction_id', auction.id)
          .order('amount', { ascending: false })
          .limit(1)
          .single();

        const hasMetReserve = auction.reserve_price === null || 
          (highestBid && highestBid.amount >= auction.reserve_price);

        const { error: updateError } = await supabase
          .from('auctions')
          .update({
            status: 'ended_pending_acceptance',
            updated_at: now,
            winner_id: hasMetReserve ? highestBid?.bidder_id : null
          })
          .eq('id', auction.id)
          .eq('status', 'active');

        if (updateError) {
          console.error(`Error ending auction ${auction.id}:`, updateError);
          response.errors.push(`end_${auction.id}: ${updateError.message}`);
          continue;
        }

        // Registrar transición inmutable
        await logStateTransition(
          auction.id,
          'active',
          'ended_pending_acceptance',
          null,
          'automatic',
          {
            end_date: auction.end_date,
            final_price: highestBid?.amount || auction.current_price,
            has_met_reserve: hasMetReserve,
            winner_id: hasMetReserve ? highestBid?.bidder_id : null
          }
        );

        // Notificar al vendedor
        const vehicle = (auction as any).vehicle;
        const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.year})` : 'Vehículo';
        const notifContent = highestBid
          ? `Tu subasta de ${vehicleName} ha finalizado. Puja más alta: €${highestBid.amount}. Revisa el resultado y toma una decisión.`
          : `Tu subasta de ${vehicleName} ha finalizado sin pujas.`;

        await supabase.rpc('create_system_notification', {
          p_user_id: auction.seller_id,
          p_title: 'Tu subasta ha finalizado',
          p_message: notifContent,
          p_type: 'auction',
          p_link: `/auctions/${auction.id}`,
          p_subject: 'Tu subasta ha finalizado',
          p_content: notifContent
        });

        response.ended++;
      }
    }

    // ============================================
    // TRANSICIÓN 3: ACCEPTED → CONTACT_SHARED
    // Esta transición ocurre automáticamente después de la aceptación
    // El sistema comparte los datos de contacto entre las partes
    // ============================================
    const { data: acceptedAuctions, error: acceptedError } = await supabase
      .from('auctions')
      .select('id, seller_id, winner_id, seller_decision_at')
      .eq('status', 'accepted')
      .is('contact_shared_at', null)
      .not('winner_id', 'is', null);

    if (acceptedError) {
      console.error('Error fetching accepted auctions:', acceptedError);
      response.errors.push(`accepted_fetch: ${acceptedError.message}`);
    } else if (acceptedAuctions && acceptedAuctions.length > 0) {
      
      for (const auction of acceptedAuctions) {
        // Marcar que el contacto ha sido compartido
        const { error: updateError } = await supabase
          .from('auctions')
          .update({
            status: 'contact_shared',
            contact_shared_at: now,
            updated_at: now
          })
          .eq('id', auction.id)
          .eq('status', 'accepted');

        if (updateError) {
          console.error(`Error sharing contact for auction ${auction.id}:`, updateError);
          response.errors.push(`contact_${auction.id}: ${updateError.message}`);
          continue;
        }

        // Registrar transición inmutable
        await logStateTransition(
          auction.id,
          'accepted',
          'contact_shared',
          null,
          'automatic',
          {
            seller_id: auction.seller_id,
            winner_id: auction.winner_id,
            contact_shared_at: now
          }
        );

        // ============================================
        // ENVIAR EMAILS DE CONTACTO (Capa 3)
        // ============================================
        try {
          const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
          const emailResponse = await fetch(
            `${supabaseUrl}/functions/v1/send-auction-contact-details`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
              },
              body: JSON.stringify({ auctionId: auction.id })
            }
          );
          
          if (!emailResponse.ok) {
            const errorData = await emailResponse.json();
            console.error(`❌ Error sending contact emails for auction ${auction.id}:`, errorData);
          } else {
            console.log(`📧 Contact emails sent for auction ${auction.id}`);
          }
        } catch (emailError) {
          console.error(`❌ Failed to call contact email function for auction ${auction.id}:`, emailError);
          // No bloqueamos la transición por error de email
        }

        response.contact_shared++;
        console.log(`✅ Contact shared for auction ${auction.id}`);
      }
    }

    // ============================================
    // TRANSICIÓN 4: CONTACT_SHARED → CLOSED
    // Cierre automático después de compartir contacto
    // Fin del proceso para Kontact
    // ============================================
    const { data: sharedAuctions, error: sharedError } = await supabase
      .from('auctions')
      .select('id, contact_shared_at')
      .eq('status', 'contact_shared')
      .is('closed_at', null);

    if (sharedError) {
      console.error('❌ Error fetching contact_shared auctions:', sharedError);
      response.errors.push(`shared_fetch: ${sharedError.message}`);
    } else if (sharedAuctions && sharedAuctions.length > 0) {
      console.log(`🔒 Found ${sharedAuctions.length} auctions to close`);
      
      for (const auction of sharedAuctions) {
        const { error: updateError } = await supabase
          .from('auctions')
          .update({
            status: 'closed',
            closed_at: now,
            updated_at: now
          })
          .eq('id', auction.id)
          .eq('status', 'contact_shared');

        if (updateError) {
          console.error(`❌ Error closing auction ${auction.id}:`, updateError);
          response.errors.push(`close_${auction.id}: ${updateError.message}`);
          continue;
        }

        // Registrar transición inmutable
        await logStateTransition(
          auction.id,
          'contact_shared',
          'closed',
          null,
          'automatic',
          {
            closed_at: now,
            final_status: 'completed_with_contact'
          }
        );

        response.closed++;
        console.log(`✅ Closed auction ${auction.id}`);
      }
    }

    // ============================================
    // TRANSICIÓN: REJECTED → CLOSED
    // Subastas rechazadas también se cierran
    // ============================================
    const { data: rejectedAuctions, error: rejectedError } = await supabase
      .from('auctions')
      .select('id, vehicle_id')
      .eq('status', 'rejected')
      .is('closed_at', null);

    if (!rejectedError && rejectedAuctions && rejectedAuctions.length > 0) {
      console.log(`❌ Found ${rejectedAuctions.length} rejected auctions to close`);
      
      for (const auction of rejectedAuctions) {
        const { error: updateError } = await supabase
          .from('auctions')
          .update({
            status: 'closed',
            closed_at: now,
            updated_at: now
          })
          .eq('id', auction.id)
          .eq('status', 'rejected');

        if (updateError) {
          response.errors.push(`close_rejected_${auction.id}: ${updateError.message}`);
          continue;
        }

        // Liberar vehículo
        if (auction.vehicle_id) {
          await supabase
            .from('vehicles')
            .update({ status: 'available' })
            .eq('id', auction.vehicle_id);
        }

        await logStateTransition(
          auction.id,
          'rejected',
          'closed',
          null,
          'automatic',
          { closed_at: now, final_status: 'rejected_closed' }
        );

        response.closed++;
        console.log(`✅ Closed rejected auction ${auction.id}`);
      }
    }

    console.log(`🎯 Scheduler completed: ${response.activated} activated, ${response.ended} ended, ${response.contact_shared} contact shared, ${response.closed} closed`);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error in auction scheduler:', errorMessage);
    
    return new Response(
      JSON.stringify({ 
        ...response,
        errors: [...response.errors, `fatal: ${errorMessage}`]
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
