import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - Deno esm import
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRecipient {
  email: string;
  name: string;
}

interface EmailRequest {
  subject: string;
  content: string;
  recipients: EmailRecipient[];
  historyId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[Mass Notification Emails] Processing request');
    
    const { subject, content, recipients, historyId }: EmailRequest = await req.json();
    
    console.log(`[Mass Notification Emails] Sending to ${recipients.length} recipients`);
    
    // Check if API key is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error('[Mass Notification Emails] RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          success: false 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (recipient) => {
        try {
          await resend.emails.send({
            from: 'KONTACT Sistema <onboarding@resend.dev>',
            to: [recipient.email],
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Hola ${recipient.name},</h2>
                <div style="margin: 20px 0; line-height: 1.6; color: #555;">
                  ${content.replace(/\n/g, '<br>')}
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                  Este es un mensaje del sistema KONTACT
                </p>
              </div>
            `,
          });
          sentCount++;
          console.log(`[Mass Notification Emails] Sent to ${recipient.email}`);
        } catch (error) {
          failedCount++;
          const errorMsg = `Failed to send to ${recipient.email}: ${error.message}`;
          errors.push(errorMsg);
          console.error(`[Mass Notification Emails] ${errorMsg}`);
        }
      });

      await Promise.allSettled(batchPromises);
      
      // Small delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`[Mass Notification Emails] Completed. Sent: ${sentCount}, Failed: ${failedCount}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        sentCount,
        failedCount,
        errors: errors.length > 0 ? errors : undefined
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error('[Mass Notification Emails] Error:', error.message);
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
