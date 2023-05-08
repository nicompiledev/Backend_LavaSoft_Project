const Lavadero = require("../models/lavadero.js");
const { publisher, subscriber, getAsync, setAsync } = require("../config/index.js");
subscriber.subscribe('canal-de-datos');

subscriber.on('message', (channel, message) => {
  // Actualiza la información almacenada en Redis en consecuencia:

});

const getLavaderos = async (req, res) => {

  try {
    const cachedData = await getAsync("lavaderos");
    if (cachedData) {
      console.log("Datos desde Redis");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Traer todos los lavaderos menos contraseña, estado y confirmado

    const PAGE_SIZE = 10; // Tamaño de la página

    const page = req.query.page; // Obtener el número de página de la solicitud

    const startIndex = (page - 1) * PAGE_SIZE; // Calcular el índice de inicio para la página actual

    const lavaderos = await Lavadero.find({}, { contrasena: 0, estado: 0, confirmado: 0 })
      .skip(startIndex)
      .limit(PAGE_SIZE);

    if (!lavaderos) return res.status(404).json({ msg: "No hay lavaderos" });

    res.status(200).json(lavaderos);

    // Guardar en Redis
    await setAsync("lavaderos", JSON.stringify(lavaderos));
    // SI HAY CAMBIOS:
    // await publisher.publish('canal-de-datos', JSON.stringify(lavaderos));

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
}

const getLavaderoID = async (req, res) => {

  const { id } = req.params;
  try {
    const cachedData = await getAsync(`lavadero-${id}`);
    if (cachedData) {
      console.log("Datos desde Redis");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Traer lavadero por id
    const lavadero = await Lavadero.findById(id, { contrasena: 0, estado: 0, confirmado: 0 }).populate('servicios');;

    if (!lavadero) return res.status(404).json({ msg: "No existe el lavadero" });

    res.status(200).json(lavadero);

    // Guardar en Redis
    await setAsync(`lavadero-${id}`, JSON.stringify(lavadero));

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
}

module.exports = {
  getLavaderos,
  getLavaderoID
}
