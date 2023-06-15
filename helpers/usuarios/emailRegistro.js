const nodemailer = require("nodemailer");

const emailRegistro = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Enviar el email

  const info = await transporter.sendMail({
    from: "LavaSoft - Administrador de Clientes de LavaSoft <admin@lavasoft.com>",
    to: email,
    subject: "Verifica tu cuenta en LavaSoft",
    html: `
        <div style="background-color: #f2f2f2; padding: 20px;">
            <img src="https://img.freepik.com/premium-vector/ls-logo_590037-67.jpg?w=2000" alt="Logo de LavaSoft" style="width: 150px;">
            <h2 style="color: #2e2e2e;">¡Bienvenido a LavaSoft, ${capitalizeFirstLetter(nombre)}!</h2>
            <p style="color: #2e2e2e;">Para comenzar a utilizar nuestros servicios, necesitamos que verifiques tu cuenta haciendo clic en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}" style="background-color: #0077c2; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Verificar Cuenta</a>
            <p style="color: #2e2e2e;">Si no creaste esta cuenta, por favor ignora este mensaje.</p>
            <hr style="border: none; border-bottom: 1px solid #ccc; margin: 20px 0;">
            <p style="color: #999;">Este mensaje ha sido enviado automáticamente. Por favor, no respondas a este mensaje.</p>
        </div>
    `,
});

console.log("Mensaje enviado correctamente. ID del mensaje: %s", info.messageId);

};

module.exports = emailRegistro;
