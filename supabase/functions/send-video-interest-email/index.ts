import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - Deno esm import
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const sanitizeText = (value: string, maxLength = 500) =>
  value.replace(/\s+/g, ' ').trim().slice(0, maxLength);

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resend) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const payload = await req.json();

    const language = sanitizeText(String(payload?.language ?? 'es'), 10);
    const title = sanitizeText(String(payload?.title ?? 'Video Presentación'), 150);
    const videoUrl = sanitizeText(String(payload?.videoUrl ?? ''), 500);
    const emailSubject = sanitizeText(String(payload?.emailSubject ?? 'Interés en KONTACT VO'), 160);
    const emailBody = String(payload?.emailBody ?? '').trim().slice(0, 3000);
    const companyName = sanitizeText(String(payload?.companyName ?? ''), 160);

    const selectedInterests = Array.isArray(payload?.selectedInterests)
      ? payload.selectedInterests
          .filter((interest: unknown) => typeof interest === 'string')
          .map((interest: string) => sanitizeText(interest, 120))
          .slice(0, 10)
      : [];

    const interestLines = selectedInterests.length
      ? selectedInterests.map((interest: string) => `- ${interest}`).join('\n')
      : 'Sin selección';

    const submittedAt = new Date().toISOString();

    const textMessage = [
      'Nueva solicitud desde el vídeo de presentación.',
      `Fecha: ${submittedAt}`,
      `Idioma: ${language}`,
      `Título del video: ${title}`,
      videoUrl ? `URL del video: ${videoUrl}` : null,
      '',
      `Asunto mostrado al usuario: ${emailSubject}`,
      `Mensaje base: ${emailBody}`,
      companyName ? `Empresa: ${companyName}` : 'Empresa: No informada',
      '',
      'Intereses:',
      interestLines,
    ]
      .filter(Boolean)
      .join('\n');

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827; max-width: 640px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-top: 0;">Nueva solicitud desde el vídeo de presentación</h2>
        <p><strong>Fecha:</strong> ${escapeHtml(submittedAt)}</p>
        <p><strong>Idioma:</strong> ${escapeHtml(language)}</p>
        <p><strong>Título del video:</strong> ${escapeHtml(title)}</p>
        ${videoUrl ? `<p><strong>URL del video:</strong> ${escapeHtml(videoUrl)}</p>` : ''}
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p><strong>Asunto mostrado al usuario:</strong> ${escapeHtml(emailSubject)}</p>
        <p><strong>Mensaje base:</strong><br/>${escapeHtml(emailBody).replaceAll('\n', '<br/>')}</p>
        <p><strong>Empresa:</strong> ${companyName ? escapeHtml(companyName) : 'No informada'}</p>
        <p><strong>Intereses:</strong></p>
        <ul>
          ${selectedInterests.length
            ? selectedInterests.map((interest: string) => `<li>${escapeHtml(interest)}</li>`).join('')
            : '<li>Sin selección</li>'}
        </ul>
      </div>
    `;

    const emailResult = await resend.emails.send({
      from: 'KONTACT VO <onboarding@resend.dev>',
      to: ['info@kontactvo.com'],
      subject: `[Video] ${emailSubject}`,
      text: textMessage,
      html: htmlMessage,
    });

    const sendError = (emailResult as { error?: { message?: string } })?.error;
    const emailId =
      (emailResult as { data?: { id?: string } })?.data?.id ??
      (emailResult as { id?: string })?.id ??
      null;

    if (sendError) {
      throw new Error(sendError.message || 'Email delivery failed');
    }

    return new Response(
      JSON.stringify({ success: true, emailId }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    console.error('[send-video-interest-email] Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
