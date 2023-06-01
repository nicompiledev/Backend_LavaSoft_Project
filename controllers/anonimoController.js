const Lavadero = require("../models/lavadero.js");
const { publisher, subscriber, getAsync, setAsync } = require("../config/index.js");
subscriber.subscribe('canal-de-datos');

subscriber.on('message', (channel, message) => {
  // Actualiza la información almacenada en Redis en consecuencia:

});

const getLavaderos = async (req, res) => {
  let error = "";
  try {
    const PAGE_SIZE = 8; // Tamaño de la página
    const page = req.query.page; // Obtener el número de página de la solicitud
    const cacheKey = `lavaderos_${page}`; // Clave para almacenar y recuperar datos en el caché para esta página

    // Verificar si hay datos en el caché para esta página
    const cachedData = await getAsync(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Si no hay datos en el caché para esta página, hacer la consulta a la base de datos
    const startIndex = (page - 1) * PAGE_SIZE; // Calcular el índice de inicio para la página actual
    // Trae los primero 10 lavaderos de la página actual
    const lavaderos = await Lavadero.find({ estado: true }, { contrasena: 0, estado: 0, confirmado: 0 }).skip(startIndex).limit(PAGE_SIZE);

    // Enviar los datos al cliente
    const totalPages = Math.ceil(await Lavadero.countDocuments({ estado: true }) / PAGE_SIZE);

    res.status(200).json({ lavaderos, totalPages });
    // Guardar los datos en el caché para esta página
    await setAsync(cacheKey, JSON.stringify({ lavaderos, totalPages }));

        // SI HAY CAMBIOS:
    // await publisher.publish('canal-de-datos', JSON.stringify(lavaderos));

  } catch (e) {
    error = new Error("Hubo un error en el servidor en el servidor");
    res.status(500).json({ msg: error.message });
  }
}


const getLavaderoID = async (req, res) => {

  const { id } = req.params;

  let error = "";
  try {
    const cachedData = await getAsync(`lavadero-${id}`);
    if (cachedData) {
      console.log("Datos desde Redis");
      return res.status(200).json(JSON.parse(cachedData));
    }
    // Traer lavadero por id
    try{
      const lavadero = await Lavadero.findById(id, { contrasena: 0, estado: 0, confirmado: 0 }).populate('servicios');

      res.status(200).json(lavadero);

      // Guardar en Redis
      await setAsync(`lavadero-${id}`, JSON.stringify(lavadero));

    } catch (e) {
      error = new Error("No existe el lavadero");
      return res.status(404).json({ msg: error.message });
    }

  } catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
}

module.exports = {
  getLavaderos,
  getLavaderoID
}
