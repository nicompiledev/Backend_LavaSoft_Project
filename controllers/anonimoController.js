const Lavadero = require("../models/type_users/lavadero.js");
const { publisher, subscriber, getAsync, setAsync } = require("../config/index.js");
subscriber.subscribe('canal-de-datos');

subscriber.on('message', (channel, message) => {
  // Actualiza la información almacenada en Redis en consecuencia:

});

const getLavaderos = async (req, res) => {
   let error = "";
  try {
    const PAGE_SIZE = 10;
    const page = req.query.page || 1;
    const ciudad = req.query.ciudad || "";
    const tipoVehiculo = req.query.tipoVehiculo || "";
    const orderByPopularity = req.query.orderByPopularity || false;
    const nombre = req.query.nombre || "";
    const cacheKey = `lavaderos_${page}_${ciudad}_${tipoVehiculo}_${orderByPopularity}_${nombre}`;

    const cachedData = await getAsync(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const startIndex = (page - 1) * PAGE_SIZE;

    const filter = {
      estado: true,
    };

    if (ciudad) {
      filter.ciudad = ciudad;
    }

    if (tipoVehiculo) {
      filter.tipoVehiculos = { $in: tipoVehiculo };
    }

    if (nombre) {
      // Agregar búsqueda por nombre no exacto utilizando expresiones regulares
      filter.nombreLavadero = { $regex: new RegExp(nombre, "i") };
    }

    let lavaderosQuery = Lavadero.find(filter, { contrasena: 0, estado: 0, visualizado: 0 });

    if (orderByPopularity) {
      lavaderosQuery = lavaderosQuery.aggregate([
        {
          $lookup: {
            from: "reservas",
            localField: "_id",
            foreignField: "id_lavadero",
            as: "reservas",
          },
        },
        {
          $addFields: {
            reservasCount: { $size: "$reservas" },
          },
        },
        {
          $sort: {
            reservasCount: -1,
          },
        },
      ]);
    }

    const lavaderos = await lavaderosQuery.skip(startIndex).limit(PAGE_SIZE);

    const totalPages = Math.ceil(await Lavadero.countDocuments(filter) / PAGE_SIZE);

    res.status(200).json({ lavaderos, totalPages });
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
      const lavadero = await Lavadero.findById(id, { contrasena: 0, estado: 0, visualizado: 0 }).populate('servicios');

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
