const nodemailer = require("nodemailer");

const emailOlvidePassword = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  const info = await transporter.sendMail({
    from: "LavaSoft - Administrador de Clientes de LavaSoft",
    to: email,
    subject: "Confirmación de correo electrónico en LavaSoft",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: #fafafa; font-family: 'Helvetica Neue', sans-serif; line-height: 1.5;">
        <h2 style="color: #2d4059; font-size: 24px; text-align: center;">Hola ${nombre},</h2>
  
        <p style="font-size: 18px;">Gracias por registrarte en LavaSoft. Para confirmar tu correo electrónico, sigue los siguientes pasos:</p>
  
        <ol style="font-size: 18px;">
          <li style="font-size: 16px;">Haz clic en el siguiente enlace para confirmar tu correo electrónico:</li>
          <li style="margin-top: 10px;"><a href="${process.env.FRONTEND_URL}/confirmar-correo/${token}/${email}" style="display: block; margin: 0 auto; padding: 8px 16px; background-color: #2d4059; color: #ffffff; text-decoration: none; font-size: 18px; border-radius: 5px;">Confirmar Correo</a></li>
        </ol>
  
        <p style="font-size: 18px;">Recuerda que es importante confirmar tu correo electrónico para acceder a todas las funcionalidades de LavaSoft.</p>
  
        <p style="font-size: 14px;">Si no solicitaste la confirmación de correo electrónico, por favor ignora este mensaje.</p>
  
        <p style="font-size: 18px;">¡Que tengas un buen día!</p>
  
        <p style="font-size: 18px;">El equipo de LavaSoft</p>
      </div>
    `,
  });
  

  console.log("Mensaje enviado: %s", info.messageId);

};

module.exports = emailOlvidePassword;
