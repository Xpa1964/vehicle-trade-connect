/**
 * SEND AUCTION CONTACT DETAILS - KONTACT VO
 * Documento Capa 3: Puesta en Contacto
 * 
 * Esta función envía los datos de contacto entre comprador y vendedor
 * SOLO cuando la subasta está en estado CONTACT_SHARED
 * 
 * Kontact NO interviene más allá de facilitar este contacto inicial
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
// @ts-ignore - Deno esm import
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactData {
  id: string;
  full_name: string;
  company_name?: string;
  email: string;
  contact_phone?: string;
}

interface AuctionData {
  id: string;
  seller_id: string;
  winner_id: string;
  current_price: number;
  status: string;
  vehicle: {
    brand: string;
    model: string;
    year: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { auctionId } = await req.json();

    if (!auctionId) {
      throw new Error('auction_id is required');
    }

    console.log(`[Auction Contact] Processing auction ${auctionId}`);

    // ============================================
    // OBTENER DATOS DE LA SUBASTA
    // ============================================
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select(`
        id,
        seller_id,
        winner_id,
        current_price,
        status,
        vehicle:vehicles(brand, model, year)
      `)
      .eq('id', auctionId)
      .single();

    if (auctionError || !auction) {
      throw new Error('Auction not found');
    }

    // ============================================
    // VALIDAR ESTADO: SOLO CONTACT_SHARED
    // ============================================
    if (auction.status !== 'contact_shared') {
      console.log(`[Auction Contact] Invalid status: ${auction.status}`);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Auction must be in CONTACT_SHARED status',
          current_status: auction.status
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!auction.winner_id) {
      throw new Error('No winner found for this auction');
    }

    // ============================================
    // OBTENER DATOS DE CONTACTO: VENDEDOR
    // ============================================
    const { data: seller, error: sellerError } = await supabase
      .from('profiles')
      .select('id, full_name, company_name, email, contact_phone')
      .eq('user_id', auction.seller_id)
      .single();

    if (sellerError || !seller) {
      console.error('[Auction Contact] Seller not found:', sellerError);
      throw new Error('Seller profile not found');
    }

    // ============================================
    // OBTENER DATOS DE CONTACTO: COMPRADOR
    // ============================================
    const { data: buyer, error: buyerError } = await supabase
      .from('profiles')
      .select('id, full_name, company_name, email, contact_phone')
      .eq('user_id', auction.winner_id)
      .single();

    if (buyerError || !buyer) {
      console.error('[Auction Contact] Buyer not found:', buyerError);
      throw new Error('Buyer profile not found');
    }

    const vehicle = auction.vehicle as { brand: string; model: string; year: number };
    const vehicleTitle = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
    const finalPrice = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(auction.current_price);

    // ============================================
    // EMAIL AL VENDEDOR (con datos del comprador)
    // ============================================
    const sellerEmailHtml = generateEmail({
      recipientName: seller.full_name || seller.company_name || 'Vendedor',
      recipientRole: 'vendedor',
      otherPartyName: buyer.full_name || buyer.company_name || 'Comprador',
      otherPartyEmail: buyer.email,
      otherPartyPhone: buyer.contact_phone,
      vehicleTitle,
      finalPrice,
      auctionId
    });

    // ============================================
    // EMAIL AL COMPRADOR (con datos del vendedor)
    // ============================================
    const buyerEmailHtml = generateEmail({
      recipientName: buyer.full_name || buyer.company_name || 'Comprador',
      recipientRole: 'comprador',
      otherPartyName: seller.full_name || seller.company_name || 'Vendedor',
      otherPartyEmail: seller.email,
      otherPartyPhone: seller.contact_phone,
      vehicleTitle,
      finalPrice,
      auctionId
    });

    // ============================================
    // ENVIAR EMAILS
    // ============================================
    const [sellerEmailResult, buyerEmailResult] = await Promise.all([
      resend.emails.send({
        from: 'KONTACT VO <onboarding@resend.dev>',
        to: [seller.email],
        subject: `Datos de Contacto - Subasta ${vehicleTitle}`,
        html: sellerEmailHtml,
      }),
      resend.emails.send({
        from: 'KONTACT VO <onboarding@resend.dev>',
        to: [buyer.email],
        subject: `¡Felicidades! Datos de Contacto - ${vehicleTitle}`,
        html: buyerEmailHtml,
      })
    ]);

    console.log(`[Auction Contact] Emails sent successfully`);
    console.log(`  - Seller (${seller.email}):`, sellerEmailResult);
    console.log(`  - Buyer (${buyer.email}):`, buyerEmailResult);

    // ============================================
    // CREAR NOTIFICACIONES EN SISTEMA
    // ============================================
    await Promise.all([
      supabase.from('user_notifications').insert({
        user_id: auction.seller_id,
        title: 'Datos de contacto compartidos',
        message: `Los datos de contacto del comprador de ${vehicleTitle} han sido enviados a tu email.`,
        type: 'auction',
        link: `/auctions/${auctionId}`
      }),
      supabase.from('user_notifications').insert({
        user_id: auction.winner_id,
        title: '¡Has ganado la subasta!',
        message: `Los datos de contacto del vendedor de ${vehicleTitle} han sido enviados a tu email.`,
        type: 'auction',
        link: `/auctions/${auctionId}`
      })
    ]);

    return new Response(
      JSON.stringify({ 
        success: true,
        emails_sent: {
          seller: seller.email,
          buyer: buyer.email
        },
        message: 'Contact details shared successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Auction Contact] Error:', errorMessage);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Genera el HTML del email de contacto
 */
function generateEmail(params: {
  recipientName: string;
  recipientRole: 'vendedor' | 'comprador';
  otherPartyName: string;
  otherPartyEmail: string;
  otherPartyPhone?: string;
  vehicleTitle: string;
  finalPrice: string;
  auctionId: string;
}): string {
  const isVendedor = params.recipientRole === 'vendedor';
  const otherRoleLabel = isVendedor ? 'comprador' : 'vendedor';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">KONTACT VO</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Sistema de Subastas B2B</p>
      </div>
      
      <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">
          ${isVendedor ? '¡Tu subasta ha sido aceptada!' : '¡Felicidades, has ganado la subasta!'}
        </h2>
        
        <p style="font-size: 16px;">Hola <strong>${params.recipientName}</strong>,</p>
        
        <div style="background-color: #f0f7ff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">🚗 ${params.vehicleTitle}</h3>
          <p style="margin: 0; font-size: 18px; color: #333;">
            Precio final: <strong style="color: #059669;">${params.finalPrice}</strong>
          </p>
        </div>
        
        <h3 style="color: #333; margin-top: 30px; margin-bottom: 15px;">
          📋 Datos de contacto del ${otherRoleLabel}:
        </h3>
        
        <div style="border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
          <p style="margin: 0 0 10px 0;">
            <strong>👤 Nombre:</strong> ${params.otherPartyName}
          </p>
          <p style="margin: 0 0 10px 0;">
            📧 <strong>Email:</strong> 
            <a href="mailto:${params.otherPartyEmail}" style="color: #2563eb;">${params.otherPartyEmail}</a>
          </p>
          ${params.otherPartyPhone ? `
            <p style="margin: 0;">
              📞 <strong>Teléfono:</strong> 
              <a href="tel:${params.otherPartyPhone}" style="color: #2563eb;">${params.otherPartyPhone}</a>
            </p>
          ` : ''}
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>⚠️ Importante:</strong> Kontact VO únicamente facilita el contacto entre las partes. 
            La operación de compraventa es responsabilidad exclusiva de vendedor y comprador. 
            Kontact no media, arbitra ni interviene en la transacción.
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #666; font-size: 14px;">
            Te recomendamos contactar lo antes posible para coordinar los siguientes pasos.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          Este es un mensaje automático del sistema KONTACT VO<br>
          Referencia de subasta: ${params.auctionId}<br>
          No respondas a este correo
        </p>
      </div>
    </body>
    </html>
  `;
}
