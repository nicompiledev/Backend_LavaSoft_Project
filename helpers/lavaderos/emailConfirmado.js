const nodemailer = require("nodemailer");

const emailConfirmado = async (datos) => {
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
  }

  //Enviar el email

  const info = await transporter.sendMail({
    from: "LavaSoft - Administrador de Lavaderos de LavaSoft <admin@lavasoft.com>",
    to: email,
    subject: "Bienvenido a LavaSoft",
    html: `
    <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial;">
    <div style="text-align: center;">
        <h2 style="color: #007bff;">¡Felicitaciones, ${capitalizeFirstLetter(nombre)}!</h2>
        <p style="font-size: 18px;">Te informamos que has sido aceptado exitosamente como lavadero de vehículos en LavaSoft.</p>
    </div>
    <div style="background-color: white; padding: 20px; margin: 20px; max-width: 600px; margin: 20px auto;">
        <p>Para comenzar a utilizar nuestra plataforma, por favor sigue estos pasos:</p>
        <ol>
            <li>Accede a tu cuenta en nuestra página web: <a href="https://lavasoft.com.co" style="color: #007bff;">lavasoft.com.co</a></li>
            <li>Completa tu perfil y agrega información sobre tus servicios y precios.</li>
            <li>Comienza a recibir solicitudes de lavado de vehículos.</li>
        </ol>
        <p>Si necesitas ayuda con alguno de estos pasos, por favor contáctanos a través de:</p>
        <ul>
            <li>Correo electrónico: soporte@lavasoft.com</li>
            <li>Teléfono: +57 3026009175</li>
        </ul>
    </div>
    <div style="text-align: center;">
        <p style="font-size: 14px; color: grey;">Si no hiciste una petición para estar en nuestra plataforma, por favor ignora este mensaje.</p>
        <p style="font-size: 14px; color: grey;">Este mensaje ha sido enviado automáticamente. Por favor, no respondas a este mensaje.</p>
    </div>
    <div style="text-align:center; margin-top:20px;">
        <blockquote style="padding-left: 10px; font-style: italic; max-width: 600px; margin: 0 auto;
        ">"Un vehículo limpio es un vehículo feliz."</blockquote>
    </div>
</div>
    `,
  });

  console.log("Mensaje enviado correctamente. ID del mensaje: %s", info.messageId);

};

module.exports = emailConfirmado;
