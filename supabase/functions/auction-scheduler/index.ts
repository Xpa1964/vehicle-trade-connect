
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

interface SchedulerResponse {
  activated: number;
  closed: number;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🕐 Auction scheduler starting at:', new Date().toISOString());
    
    let activatedCount = 0;
    let closedCount = 0;

    // 1. Activate scheduled auctions whose start_date has passed
    const { data: scheduledAuctions, error: scheduledError } = await supabase
      .from('auctions')
      .select('id, vehicle_id, created_by, start_date')
      .eq('status', 'scheduled')
      .lte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });

    if (scheduledError) {
      console.error('❌ Error fetching scheduled auctions:', scheduledError);
    } else if (scheduledAuctions && scheduledAuctions.length > 0) {
      console.log(`📅 Found ${scheduledAuctions.length} auctions to activate`);
      
      for (const auction of scheduledAuctions) {
        console.log(`🚀 Processing auction ${auction.id} scheduled for ${auction.start_date}`);
        
        // Update auction status to active
        const { error: updateError } = await supabase
          .from('auctions')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', auction.id);

        if (updateError) {
          console.error(`❌ Error activating auction ${auction.id}:`, updateError);
          continue;
        }

        // Update vehicle status to in_auction
        const { error: vehicleError } = await supabase
          .from('vehicles')
          .update({ status: 'in_auction' })
          .eq('id', auction.vehicle_id);

        if (vehicleError) {
          console.error(`❌ Error updating vehicle ${auction.vehicle_id}:`, vehicleError);
        }

        // Create notification for auction owner
        const { error: notifError } = await supabase
          .from('auction_notifications')
          .insert({
            user_id: auction.created_by,
            auction_id: auction.id,
            type: 'auction_started',
            content: 'Tu subasta ha comenzado automáticamente y está ahora activa para recibir pujas.',
            is_read: false
          });

        if (notifError) {
          console.error(`❌ Error creating notification for auction ${auction.id}:`, notifError);
        }

        // Log the action
        const { error: logError } = await supabase
          .from('auction_audit_log')
          .insert({
            auction_id: auction.id,
            user_id: null,
            action: 'auto_start_auction',
            details: {
              previous_status: 'scheduled',
              start_date: auction.start_date,
              activated_at: new Date().toISOString(),
              triggered_by: 'scheduler'
            }
          });

        if (logError) {
          console.error(`❌ Error logging auction activation ${auction.id}:`, logError);
        }

        activatedCount++;
        console.log(`✅ Activated auction ${auction.id}`);
      }
    } else {
      console.log('📅 No scheduled auctions found to activate');
    }

    // 2. Close active auctions whose end_date has passed
    const { data: expiredAuctions, error: expiredError } = await supabase
      .from('auctions')
      .select('id, vehicle_id, created_by, current_price, reserve_price, end_date')
      .eq('status', 'active')
      .lte('end_date', new Date().toISOString())
      .order('end_date', { ascending: true });

    if (expiredError) {
      console.error('❌ Error fetching expired auctions:', expiredError);
    } else if (expiredAuctions && expiredAuctions.length > 0) {
      console.log(`⏰ Found ${expiredAuctions.length} auctions to close`);
      
      for (const auction of expiredAuctions) {
        console.log(`🔚 Processing expired auction ${auction.id} ended at ${auction.end_date}`);
        
        // Check if reserve price has been met
        const hasMetReserve = auction.reserve_price === null || auction.current_price >= auction.reserve_price;
        
        // Get highest bidder if exists
        const { data: highestBid } = await supabase
          .from('bids')
          .select('bidder_id, amount')
          .eq('auction_id', auction.id)
          .eq('amount', auction.current_price)
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        const winnerId = hasMetReserve ? highestBid?.bidder_id : null;

        // Update auction status
        const { error: updateError } = await supabase
          .from('auctions')
          .update({
            status: 'ended',
            updated_at: new Date().toISOString(),
            winner_id: winnerId
          })
          .eq('id', auction.id);

        if (updateError) {
          console.error(`❌ Error closing auction ${auction.id}:`, updateError);
          continue;
        }

        // Update vehicle status
        const vehicleStatus = hasMetReserve && winnerId ? 'reserved' : 'available';
        const { error: vehicleError } = await supabase
          .from('vehicles')
          .update({ status: vehicleStatus })
          .eq('id', auction.vehicle_id);

        if (vehicleError) {
          console.error(`❌ Error updating vehicle ${auction.vehicle_id}:`, vehicleError);
        }

        // Create notifications
        if (hasMetReserve && winnerId) {
          // Notify winner
          await supabase
            .from('auction_notifications')
            .insert({
              user_id: winnerId,
              auction_id: auction.id,
              type: 'auction_won',
              content: `¡Felicitaciones! Has ganado una subasta con una puja de €${auction.current_price.toLocaleString()}`,
              is_read: false
            });

          // Notify seller
          await supabase
            .from('auction_notifications')
            .insert({
              user_id: auction.created_by,
              auction_id: auction.id,
              type: 'auction_sold',
              content: `Tu subasta ha finalizado con una puja ganadora de €${auction.current_price.toLocaleString()}`,
              is_read: false
            });
        } else {
          // Notify seller that reserve was not met
          await supabase
            .from('auction_notifications')
            .insert({
              user_id: auction.created_by,
              auction_id: auction.id,
              type: 'reserve_not_met',
              content: `Tu subasta ha finalizado sin alcanzar el precio de reserva. Puja más alta: €${auction.current_price.toLocaleString()}`,
              is_read: false
            });
        }

        // Log the action
        await supabase
          .from('auction_audit_log')
          .insert({
            auction_id: auction.id,
            user_id: null,
            action: 'auto_close_auction',
            details: {
              has_met_reserve: hasMetReserve,
              winner_id: winnerId,
              final_price: auction.current_price,
              end_date: auction.end_date,
              closed_at: new Date().toISOString(),
              triggered_by: 'scheduler'
            }
          });

        closedCount++;
        console.log(`✅ Closed auction ${auction.id} - Winner: ${winnerId || 'None'}`);
      }
    } else {
      console.log('⏰ No expired auctions found to close');
    }

    const response: SchedulerResponse = {
      activated: activatedCount,
      closed: closedCount,
      timestamp: new Date().toISOString()
    };

    console.log(`🎯 Scheduler completed: ${activatedCount} activated, ${closedCount} closed`);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('❌ Error in auction scheduler:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        activated: 0,
        closed: 0,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
