
interface EmailRequest {
  type: 'confirmation' | 'notification' | 'approval' | 'rejection';
  data: {
    email: string;
    companyName?: string;
    credentials?: {
      email: string;
      password: string;
    };
    isExistingUser?: boolean;
  };
}

export const emailTemplates = {
  confirmation: (data: EmailRequest['data']) => ({
    subject: 'Solicitud de registro recibida - KONTACT VO',
    html: `
      <h1>Hemos recibido su solicitud de registro</h1>
      <p>Estimado/a representante de ${data.companyName},</p>
      <p>Su solicitud de registro en KONTACT VO ha sido recibida y está siendo revisada por nuestro equipo.</p>
      <p>Le notificaremos por email cuando su solicitud haya sido procesada.</p>
      <p>Saludos cordiales,<br>El equipo de KONTACT VO</p>
    `
  }),
  notification: (data: EmailRequest['data']) => ({
    subject: 'Nueva solicitud de registro - KONTACT VO',
    html: `
      <h1>Nueva solicitud de registro</h1>
      <p>Se ha recibido una nueva solicitud de registro de la empresa: ${data.companyName}</p>
      <p>Por favor, revise la solicitud en el panel de administración.</p>
    `
  }),
  approval: (data: EmailRequest['data']) => ({
    subject: `${data.isExistingUser ? 'Credenciales actualizadas' : 'Solicitud aprobada'} - KONTACT VO`,
    html: `
      <h1>${data.isExistingUser ? 'Sus credenciales han sido actualizadas' : 'Su solicitud ha sido aprobada'}</h1>
      <p>Estimado/a representante de ${data.companyName},</p>
      <p>${data.isExistingUser 
        ? 'Se han generado nuevas credenciales para su cuenta existente.' 
        : 'Nos complace informarle que su solicitud de registro ha sido aprobada.'
      }</p>
      <p>Puede acceder a KONTACT VO con las siguientes credenciales:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Email:</strong> ${data.credentials?.email}</p>
        <p><strong>Contraseña:</strong> ${data.credentials?.password}</p>
      </div>
      <p><strong>IMPORTANTE:</strong> Por favor, cambie su contraseña después del primer inicio de sesión por motivos de seguridad.</p>
      <p>Saludos cordiales,<br>El equipo de KONTACT VO</p>
    `
  }),
  rejection: (data: EmailRequest['data']) => ({
    subject: 'Solicitud no aprobada - KONTACT VO',
    html: `
      <h1>Actualización sobre su solicitud</h1>
      <p>Estimado/a representante de ${data.companyName},</p>
      <p>Lamentamos informarle que su solicitud de registro no ha sido aprobada en este momento.</p>
      <p>Si tiene alguna pregunta, por favor contáctenos.</p>
      <p>Saludos cordiales,<br>El equipo de KONTACT VO</p>
    `
  })
};

export type { EmailRequest };
