// OpenAI
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Crear funcion y exportar respuesta
module.exports = async (pregunta) => {
  try {
    const informacion = `LavaSoft es una plataforma innovadora en Colombia, mas especifico en desarrollada en la ciudad de Armenia, que busca revolucionar la forma en que las personas lavan sus vehículos. A través de nuestra plataforma, los usuarios pueden encontrar fácilmente los lavaderos más cercanos a su ubicación, y ver una lista completa de los servicios que ofrecen, así como las calificaciones y comentarios de otros usuarios.

    Además, ofrecemos la opción de agendar una cita en tiempo real con cualquier lavadero de nuestra red, lo que significa que los usuarios pueden evitar las largas filas y la incertidumbre de no saber cuándo su vehículo estará listo. Una vez que el lavado termine, los usuarios recibirán una notificación fácilmente, lo que les permitirá recoger su vehículo en el momento que mejor les convenga.

    Pero eso no es todo. LavaSoft también ofrece a los lavaderos una serie de herramientas y estadísticas que les permiten mejorar su negocio y satisfacer mejor a sus clientes. Los lavaderos pueden ver estadísticas detalladas sobre sus ventas, clientes y servicios más populares, lo que les permite ajustar su oferta y mejorar su rentabilidad.

    En resumen, LavaSoft es la solución perfecta para cualquier persona que busca un lavado de vehículo rápido, fácil y conveniente, así como para los lavaderos que buscan mejorar su negocio y ofrecer un mejor servicio a sus clientes. ¡Únete a nuestra comunidad hoy mismo y descubre la diferencia que LavaSoft puede hacer en tu vida!

    Para reservar, debe buscar en la seccion de "Lavaderos" el lavadero que desee, busca el servicio que desee y agendar la cita. Para agendar la cita, debe llenar los datos como fecha, hora y el vehiculo que desea lavar. Una vez agendada la cita, el lavadero lo estará esperando en la fecha y hora acordada.

    Para cancelar la cita, debe buscar en la seccion de "Mis Citas" la cita que desea cancelar, y dar click en el boton "Cancelar", o puede hacerlo mediante el correo electronico que le enviamos al momento de agendar la cita.

    Para reportar un lavadero, debe buscar en la seccion de "Lavaderos" el lavadero que desea reportar, y dar click en el boton "Reportar". Una vez reportado, el lavadero sera revisado por nuestro equipo y se tomaran las medidas necesarias.
    `

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${informacion}\n\n\Marv (Empleado de LavaSoft) es un chatbot que responde a preguntas de manera profesional  y amigable, sin embargo, es conciso a sus respuestas ya que solo responde a lo que se le pregunta de manera breve y corta.\n\nTú: ${pregunta}\nMarv: `,
      temperature: 0.5,
      max_tokens: 300,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });

    return response.data.choices[0].text;

  } catch (error) {
    return "Hola, soy Marv, el asistente virtual de LavaSoft. Actualmente no puedo responder a tu pregunta, pero puedes contactar a un asesor escribriendo 'asesor' en el chat.";
  };
};

