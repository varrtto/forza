import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
  toEmail: string,
  resetLink: string,
  userName: string
) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const response = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Recupera tu contraseña de Forza',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hola ${userName},</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Recibimos una solicitud para restablecer tu contraseña en Forza.
          </p>
          
          <p style="color: #555; line-height: 1.6;">
            Haz clic en el siguiente botón para crear una nueva contraseña:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #000; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            O copia y pega este enlace en tu navegador:
          </p>
          
          <p style="color: #007bff; word-break: break-all;">
            ${resetLink}
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            Este enlace expirará en 1 hora.
          </p>
          
          <p style="color: #999; font-size: 14px;">
            Si no solicitaste este cambio, puedes ignorar este email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            Saludos,<br>
            El equipo de Forza
          </p>
        </div>
      `,
    });

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
