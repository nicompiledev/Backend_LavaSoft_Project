const nodemailer = require("nodemailer");

const emailReportado = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, motivo, strikes } = datos;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const strikeMessage = strikes === 5 ? "Tu cuenta ha sido cancelada." : `Tu cuenta tiene ${strikes}/5. Si llegas a 5/5, tu cuenta será cancelada.`;

  //Enviar el email

  const info = await transporter.sendMail({
    from: "LavaSoft - Administrador de Lavaderos de LavaSoft <admin@lavasoft.com>",
    to: email,
    subject: "Tu lavadero ha sido reportado",
    html: `
      <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial;">
        <div style="text-align: center;">
          <h2 style="color: #007bff;">¡Bienvenido a LavaSoft, ${capitalizeFirstLetter(nombre)}!</h2>
          <p style="font-size: 18px;">Estamos emocionados de tenerte como parte de nuestra comunidad de lavaderos de vehículos.</p>
        </div>
        <div style="background-color: white; padding: 20px; margin: 20px; max-width: 600px; margin: 20px auto;">
          <p>Para ser validado en nuestra plataforma, debes esperar que los desarrolladores validen tu información. Por favor, sé paciente y espera a que te llegue un correo de confirmación.</p>
          <p>Si no recibes un correo de confirmación en 48 horas, por favor, ponte en contacto con nosotros a través de:</p>
          <ul>
            <li>Correo electrónico: soporte@lavasoft.com</li>
            <li>Teléfono: +57 3026009175</li>
          </ul>
        </div>
        <div style="background-color: #ffc107; padding: 20px; margin: 20px; max-width: 600px; margin: 20px auto;">
          <p>Tu lavadero ha sido reportado por el siguiente motivo:</p>
          <p>${motivo}</p>
          <p>${strikeMessage}</p>
        </div>
        <div style="text-align: center;">
          <p style="font-size: 14px; color: grey;">Si no hiciste una petición para estar en nuestra plataforma, por favor ignora este mensaje.</p>
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
