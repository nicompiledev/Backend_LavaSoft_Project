
// OpenAI
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Crear funcion y exportar respuesta
const AILavaderoREAL = async (nombreLavadero, direccion, correo_electronico, telefono) => {
  try {
    const prompt = `Dado el siguiente formulario:
  Nombre: ${nombreLavadero}
  Dirección: ${direccion}
  Correo: ${correo_electronico}
  Teléfono: ${telefono}

  Por favor, indica si este formulario es verdadero o falso. Para considerarlo verdadero, se deben cumplir las siguientes condiciones:

  El nombre y el apellido deben ser nombres reales y comunes en el idioma del formulario.
  El correo debe tener un formato válido, es decir, debe contener una arroba y un dominio válido.
  El teléfono debe tener un formato válido para el país del formulario.
  Por favor, proporciona la respuesta en una sola palabra: "verdadero" o "falso".
  Respuesta:`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 10,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    });

    return response.data.choices[0].text;

  } catch (error) {
    return error.response.data.error.code;
  };
};

const AIPlavaVehiculoREAL = async (placa, marca, modelo, tipo_vehiculo) => {
  try {
    const prompt = `Dado el siguiente formulario:
  Placa: ${placa}
  Marca: ${marca}
  Modelo: ${modelo}
  Tipo de vehículo: ${tipo_vehiculo}
  Pais: Colombia

  Por favor, indica si este formulario es verdadero o falso. Para considerarlo verdadero, se deben cumplir las siguientes condiciones:

  La placa debe tener un formato válido para el país del formulario.
  La marca debe ser una marca real y común en el idioma del formulario.
  El modelo debe ser un modelo real y común en el idioma del formulario.
  El tipo de vehículo debe ser un tipo de vehículo real y común en el idioma del formulario.
  Por favor, proporciona la respuesta en una sola palabra: "verdadero" o "falso".
  Respuesta:`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 10,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    });

    return response.data.choices[0].text;

  } catch (error) {
    return error.response.data.error.code;
  };
};


module.exports = {
  AILavaderoREAL,
  AIPlavaVehiculoREAL
};

