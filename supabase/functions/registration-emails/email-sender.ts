// @ts-ignore - Deno npm import
import { Resend } from "https://esm.sh/resend@2.0.0";
import { EmailRequest } from "./email-templates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

export async function sendEmail(template: { subject: string; html: string }, recipient: string) {
  console.log(`=== RESEND: Attempting to send email ===`);
  console.log(`Recipient: ${recipient}`);
  console.log(`Subject: ${template.subject}`);
  
  try {
    const emailResponse = await resend.emails.send({
      from: 'KONTACT VO <onboarding@resend.dev>',
      to: [recipient],
      subject: template.subject,
      html: template.html,
    });

    console.log(`=== RESEND: Email sent successfully ===`);
    console.log('Response:', JSON.stringify(emailResponse, null, 2));
    return emailResponse;
  } catch (error) {
    console.error(`=== RESEND: Email send failed ===`);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    throw error;
  }
}

export async function sendEmailWithFallback(
  template: { subject: string; html: string }, 
  recipient: string,
  data: EmailRequest['data']
) {
  try {
    console.log(`=== EMAIL SENDER: Starting send process ===`);
    const response = await sendEmail(template, recipient);
    console.log(`=== EMAIL SENDER: Primary send successful ===`);
    return {
      success: true,
      response,
      message: `Email sent successfully to ${recipient}`,
      sentToAdmin: false
    };
  } catch (originalError) {
    console.error('=== EMAIL SENDER: Primary send failed ===');
    console.error('Original error:', originalError);
    
    // For approval emails, try sending to admin as fallback
    if (template.subject.includes('aprobada') || template.subject.includes('actualizadas')) {
      console.log('=== EMAIL SENDER: Attempting admin fallback ===');
      return await sendAdminFallback(data, recipient);
    } else {
      console.error('=== EMAIL SENDER: No fallback available, throwing error ===');
      throw originalError;
    }
  }
}

async function sendAdminFallback(data: EmailRequest['data'], originalRecipient: string) {
  const adminEmail = 'xperez1964@gmail.com';
  console.log(`=== ADMIN FALLBACK: Attempting to send copy to admin: ${adminEmail} ===`);
  
  const adminTemplate = {
    subject: `[ADMIN COPY] Credenciales para ${data.companyName} - ${originalRecipient}`,
    html: `
      <h1>Copia de credenciales para administrador</h1>
      <p><strong>NOTA:</strong> Este email es una copia para el administrador porque no se pudo enviar al destinatario original.</p>
      <hr>
      <p><strong>Destinatario original:</strong> ${originalRecipient}</p>
      <p><strong>Empresa:</strong> ${data.companyName}</p>
      <p><strong>Tipo:</strong> ${data.isExistingUser ? 'Usuario existente - Credenciales actualizadas' : 'Nuevo usuario creado'}</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Email:</strong> ${data.credentials?.email}</p>
        <p><strong>Contraseña:</strong> ${data.credentials?.password}</p>
      </div>
      <p><strong>ACCIÓN REQUERIDA:</strong> Debe comunicar estas credenciales al usuario por otros medios (teléfono, email personal, etc.)</p>
    `
  };
  
  try {
    const adminEmailResponse = await sendEmail(adminTemplate, adminEmail);
    console.log(`=== ADMIN FALLBACK: Admin copy sent successfully ===`);
    console.log('Admin response:', adminEmailResponse);

    return {
      success: true,
      response: adminEmailResponse,
      message: `Email could not be sent to ${originalRecipient}. Admin copy sent to ${adminEmail}`,
      sentToAdmin: true,
      originalRecipient
    };
  } catch (adminError) {
    console.error('=== ADMIN FALLBACK: Failed to send admin copy ===');
    console.error('Admin error:', adminError);
    throw adminError;
  }
}
