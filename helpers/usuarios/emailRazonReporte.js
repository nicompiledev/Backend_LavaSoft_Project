const nodemailer = require("nodemailer");

const emailRazonReporte = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre } = datos;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  //Enviar el email

  const info = await transporter.sendMail({
    from: "LavaSoft - Administrador de Clientes de LavaSoft",
    to: email,
    subject: "Su reporte se ha enviado correctamente",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: #fafafa; font-family: 'Helvetica Neue', sans-serif; line-height: 1.5;">
        <h2 style="color: #2d4059; font-size: 24px; text-align: center;">¡Hola ${capitalizeFirstLetter(nombre)}!</h2>

        <p style="font-size: 18px;">Gracias por tu reporte en LavaSoft. Hemos recibido tu preocupación y queremos que sepas que estamos tomando medidas al respecto.</p>

        <p style="font-size: 18px;">Valoramos tu compromiso con la calidad y la excelencia de los lavaderos de vehículos. Nuestro equipo de revisión y atención al cliente se encuentra investigando la situación reportada y se tomarán las acciones necesarias para garantizar que nuestros lavaderos cumplan con los estándares más altos.</p>

        <p style="font-size: 18px;">Tu aporte es fundamental para mantener la calidad de nuestros servicios y mejorar continuamente. Agradecemos tu participación activa y te invitamos a seguir colaborando con nosotros para asegurar una experiencia excepcional para todos nuestros usuarios.</p>

        <p style="font-size: 18px;">Si tienes alguna pregunta adicional o necesitas más información, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>

        <p style="font-size: 18px;">¡Gracias nuevamente por tu contribución y por ayudarnos a construir una comunidad de lavaderos de vehículos confiables y confiables!</p>

        <p style="font-size: 18px;">Saludos cordiales,</p>
        <p style="font-size: 18px;">El equipo de LavaSoft</p>
      </div>
    `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

module.exports = emailRazonReporte;
