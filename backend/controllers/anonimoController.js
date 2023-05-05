const Lavadero = require("../models/lavadero.js");
const { conectarRedis } = require("../config/index.js");

const getLavaderos = async (req, res) => {
  let redisClient;
  try {
    redisClient = conectarRedis();

    const cachedData = await redisClient.getAsync("lavaderos");
    if (cachedData) {
      console.log("Datos desde Redis");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Traer todos los lavaderos menos contraseña, estado y confirmado

    const lavaderos = await Lavadero.find({}, { contrasena: 0, estado: 0, confirmado: 0 });

    if (!lavaderos) return res.status(404).json({ msg: "No hay lavaderos" });

    res.status(200).json(lavaderos);

    // Guardar en Redis
    await redisClient.setAsync("lavaderos", JSON.stringify(lavaderos));

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
}

const getLavaderoID = async (req, res) => {
  let redisClient;
  const { id } = req.params;
  try {
    redisClient = conectarRedis();

    const cachedData = await redisClient.getAsync(`lavadero-${id}`);
    if (cachedData) {
      console.log("Datos desde Redis");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Traer lavadero por id
    const lavadero = await Lavadero.findById(id, { contrasena: 0, estado: 0, confirmado: 0 }).populate('servicios');;

    if (!lavadero) return res.status(404).json({ msg: "No existe el lavadero" });

    console.log("LAVADERO"+lavadero)
    res.status(200).json(lavadero);

    // Guardar en Redis
    await redisClient.setAsync(`lavadero-${id}`, JSON.stringify(lavadero));

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
}

module.exports = {
  getLavaderos,
  getLavaderoID
}
