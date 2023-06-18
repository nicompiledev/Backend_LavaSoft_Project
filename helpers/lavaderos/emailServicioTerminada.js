const nodemailer = require("nodemailer");

const accountSid = "AC23c30d3465c2e76dc181de7110fa2b8d";
const authToken = "e36cee631170a0f94f72b76cd6d7cccd";
const client = require("twilio")(accountSid, authToken);

const emailServicioTerminada = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, lavadero, direccion, fecha, SiNoLoRecoge } = datos;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Enviar el email

  const info = await transporter.sendMail({
    from: "LavaSoft - Administrador de Lavaderos de LavaSoft admin@lavasoft.com",
    to: email,
    subject: "Tu vehículo ha sido lavado",
    html: `
    
      <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial;">
      <div style="text-align: center;">
          <h2 style="color: #007bff;">¡Hola, ${capitalizeFirstLetter(nombre)}!</h2>
          <p style="font-size: 18px;">Te informamos que tu vehículo ha sido lavado y está listo para ser recogido en ${lavadero}.</p>
      </div>
      <div style="background-color: white; padding: 20px; margin: 20px; max-width: 600px; margin: 20px auto;">
          <p>Por favor, dirígete al lavadero en la siguiente dirección:</p>
          <p>${direccion}</p>
          <p>Fecha de lavado: ${fecha}</p>
          <p>Si no puedes recoger tu vehículo en un plazo máximo de 30 minutos, ${SiNoLoRecoge}.</p>
          <p>Si necesitas ayuda o tienes alguna pregunta, por favor contáctanos a través de:</p>
          <ul>
              <li>Correo electrónico: soporte@lavasoft.com</li>
              <li>Teléfono: +57 3026009175</li>
          </ul>
      </div>
      <div style="text-align: center;">
          <p style="font-size: 14px; color: grey;">Este mensaje ha sido enviado automáticamente. Por favor, no respondas a este mensaje.</p>
      </div>
      <div style="text-align:center; margin-top:20px;">
          <blockquote style="padding-left: 10px; font-style: italic; max-width: 600px; margin: 0 auto;">"Un vehículo limpio es un vehículo feliz."</blockquote>
      </div>
    </div>
      `,
  });

  console.log("Mensaje enviado correctamente. ID del mensaje: %s", info.messageId);
/* 
  client.messages
  .create({
    body: `¡Hola, ${capitalizeFirstLetter(nombre)}! Te informamos que tu vehículo ha sido lavado y está listo para ser recogido en ${lavadero}. Por favor, dirígete al lavadero. La información completa la puedes encontrar en tu correo electrónico.`,
    from: '+13159292440',
    to: '+573026009175'
  })
  .then((message) => console.log(message.sid)); */

};

module.exports = emailServicioTerminada;
