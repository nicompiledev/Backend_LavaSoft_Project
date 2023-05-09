const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.set("strictQuery", false);

const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

/*     const {Servicio} = require("../models/Servicio.js");
    const Lavadero = require("../models/lavadero.js");

    const lavadero1 = new Lavadero({
      nombre: 'Lavadero 1',
      ciudad: 'Ciudad 1',
      direccion: 'Dirección 1',
      telefono: '123456789',
      correo_electronico: 'lavadero1@example.com',
      contrasena: 'contraseña',
      hora_apertura: '08:00',
      hora_cierre: '18:00',
      imagenes: ['https://seguroserenus.com.co/wp-content/uploads/2022/09/imagen-seguro-carro1-serenus.jpg', 'https://elestimulo.com/wp-content/uploads/2015/07/carro1.jpg', 'https://d2yoo3qu6vrk5d.cloudfront.net/images/20211220091840/carro1.jpg'],
      espacios_de_trabajo: 5,
      ubicacion: {
        type: "Point",
        coordinates: [0, 0]
      }
    });

    await lavadero1.save();

    const servicio1 = new Servicio({ nombre: 'Servicio 1', detalle: 'Detalle del servicio 1', costo: 100, duracion: 30 });
    await servicio1.save();

    const servicio2 = new Servicio({ nombre: 'Servicio 2', detalle: 'Detalle del servicio 2', costo: 200, duracion: 60 });
    await servicio2.save();

    const lavadero = await Lavadero.findById(lavadero1._id);
    lavadero.servicios.push(servicio1._id);
    lavadero.servicios.push(servicio2._id);
    await lavadero.save(); */

/*     const Lavadero = require("../models/lavadero.js");

    const lavadero1 = new Lavadero({
      nombre: 'Lavadero 1',
    ciudad: 'Bogota',
    direccion: 'Calle 1 # 1 - 1',
    telefono: '1234567890',
    correo_electronico: 'slash2130kevin@gmail.com',
    contrasena: 'contrasena123',
    hora_apertura: '08:00',
    hora_cierre: '18:00',
    imagenes: ['https://res.cloudinary.com/djx5h4cjt/image/upload/v1629789853/IMAGENES_LAVADEROS/1_1_1.png'],
    espacios_de_trabajo: 5,
    ubicacion: {
      type: 'Point',
      coordinates: [-74.08175, 4.60971]
    },
    servicios: []
  });

  lavadero1.confirmado = true;

  await lavadero1.save();
 */
    console.log("Conexión a la base de datos MongoDB exitosa");
  } catch (error) {
    console.error(`Error al conectarse a la base de datos MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarMongoDB;
