const Lavadero = require("../models/Lavadero.js");
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

module.exports = {
  getLavaderos,
}
