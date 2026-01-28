import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactDetails {
  user_id: string;
  full_name: string;
  email: string;
  contact_phone: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { vehicleId, status } = await req.json();

    console.log(`[Vehicle Contact Details] Processing for vehicle ${vehicleId}, status: ${status}`);

    // Verificar que el usuario es el propietario del vehículo
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('user_id, brand, model, year')
      .eq('id', vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.user_id !== user.id) {
      throw new Error('Not authorized to perform this action');
    }

    // Obtener datos del propietario
    const { data: owner, error: ownerError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    if (ownerError || !owner) {
      throw new Error('Owner profile not found');
    }

    // Obtener contactos de interesados usando la función SQL
    const { data: contacts, error: contactsError } = await supabase
      .rpc('get_vehicle_interested_contacts', { p_vehicle_id: vehicleId });

    if (contactsError) {
      console.error('[Vehicle Contact Details] Error fetching contacts:', contactsError);
      throw contactsError;
    }

    const contactsList = (contacts as ContactDetails[]) || [];
    console.log(`[Vehicle Contact Details] Found ${contactsList.length} interested contacts`);

    // Preparar el email
    const vehicleTitle = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
    const statusText = status === 'reserved' ? 'RESERVADO' : 'VENDIDO';

    const contactsHtml = contactsList.length > 0
      ? contactsList.map((contact, index) => `
          <div style="border: 1px solid #e0e0e0; padding: 15px; margin: 10px 0; border-radius: 8px; background-color: #f9f9f9;">
            <h4 style="margin: 0 0 10px 0; color: #333;">${index + 1}. ${contact.full_name}</h4>
            <p style="margin: 5px 0;">
              📧 <strong>Email:</strong> <a href="mailto:${contact.email}" style="color: #2563eb;">${contact.email}</a>
            </p>
            <p style="margin: 5px 0;">
              📞 <strong>Teléfono:</strong> <a href="tel:${contact.contact_phone}" style="color: #2563eb;">${contact.contact_phone}</a>
            </p>
          </div>
        `).join('')
      : '<p style="color: #666; font-style: italic;">No hay usuarios interesados registrados para este vehículo.</p>';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">KONTACT VO</h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Vehículo Marcado como ${statusText}</h2>
          
          <p style="font-size: 16px;">Hola <strong>${owner.full_name || 'Usuario'}</strong>,</p>
          
          <p style="background-color: #f0f7ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
            Has marcado tu vehículo <strong>${vehicleTitle}</strong> como <strong>${statusText}</strong>.
          </p>
          
          <h3 style="color: #333; margin-top: 30px; margin-bottom: 15px;">
            ${contactsList.length > 0 
              ? `Personas que mostraron interés (${contactsList.length}):`
              : 'Información de contactos:'}
          </h3>
          
          ${contactsHtml}
          
          ${contactsList.length > 0 ? `
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                💡 <strong>Sugerencia:</strong> Puedes contactar directamente a estas personas para finalizar la operación.
              </p>
            </div>
          ` : ''}
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            Este es un mensaje automático del sistema KONTACT VO<br>
            No respondas a este correo
          </p>
        </div>
      </body>
      </html>
    `;

    // Enviar email
    const emailResponse = await resend.emails.send({
      from: 'KONTACT VO <onboarding@resend.dev>',
      to: [owner.email],
      subject: `Contactos de Interesados - ${vehicleTitle}`,
      html: emailHtml,
    });

    console.log(`[Vehicle Contact Details] Email sent to ${owner.email}:`, emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        contactsCount: contactsList.length,
        emailSent: true
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[Vehicle Contact Details] Error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
