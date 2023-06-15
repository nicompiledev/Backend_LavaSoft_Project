const nodemailer = require("nodemailer");

const emailReservaConfirmada = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, lavadero, nombre, servicio, fecha, nombreEmpleado } = datos;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Enviar el email

  const info = await transporter.sendMail({
    from: "LavaSoft - Administrador de Lavaderos de LavaSoft admin@lavasoft.com",
    to: email,
    subject: "Confirmación de Reserva en LavaSoft",
    html: `
    <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial;">
      <div style="text-align: center;">
        <h2 style="color: #007bff;">Hola, ${capitalizeFirstLetter(nombre)}.</h2>
        <p style="font-size: 18px;">Tu reserva en ${capitalizeFirstLetter(lavadero)} ha sido confirmada.</p>
      </div>
      <div style="background-color: white; padding: 20px; margin: 20px; max-width: 600px; margin: 20px auto;">
        <p>Detalles de la reserva:</p>
        <ul>
          <li>Lavadero: ${capitalizeFirstLetter(lavadero)}</li>
          <li>Servicio: ${capitalizeFirstLetter(servicio)}</li>
          <li>Fecha de la reserva: ${fecha}</li>
        </ul>
        <p>El lavado de tu vehículo comenzará pronto. Te notificaremos cuando esté listo.</p>
        <p>Empleado asignado: ${nombreEmpleado}</p>
      </div>
      <div style="text-align: center;">
        <p style="font-size: 14px; color: grey;">Si necesitas ayuda con alguna reserva o tienes alguna pregunta, por favor contáctanos a través de:</p>
        <ul>
          <li>Correo electrónico: soporte@lavasoft.com</li>
          <li>Teléfono: +57 3026009175</li>
        </ul>
        <p style="font-size: 14px; color: grey;">Este mensaje ha sido enviado automáticamente. Por favor, no respondas a este mensaje.</p>
      </div>
      <div style="text-align:center; margin-top:20px;">
        <blockquote style="padding-left: 10px; font-style: italic; max-width: 600px; margin: 0 auto;">"Un vehículo limpio es un vehículo feliz."</blockquote>
      </div>
    </div>
  `,
  });

  console.log("Mensaje enviado correctamente. ID del mensaje: %s", info.messageId);
};

module.exports = emailReservaConfirmada;
