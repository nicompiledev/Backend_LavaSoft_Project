const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.set("strictQuery", false);

const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const {Servicio} = require("../models/Servicio.js");
    const Lavadero = require("../models/lavadero.js");

    for (let i = 0; i < 10; i++) {
    const lavadero1 = new Lavadero({
      nombre: 'Lavadero' + i,
      ciudad: 'Ciudad' + i,
      direccion: 'Dirección' + i,
      telefono: '123456789' + i,
      correo_electronico: 'lavadero' + i + '@gmail.com',
      contrasena: 'contraseña' + i,
      hora_apertura: '08:00',
      hora_cierre: '18:00',
      imagenes: ['https://plazaimperialcc.com.co/images/servicios/78/slides/medium_banner_2.jpg', 'https://elestimulo.com/wp-content/uploads/2015/07/carro1.jpg', 'https://d2yoo3qu6vrk5d.cloudfront.net/images/20211220091840/carro1.jpg'],
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
    await lavadero.save();
  }

    const Usuario = require("../models/Usuario.js");
    const usuario1 = new Usuario({
      nombre: 'Usuario 1',
      apellido: 'Apellido 1',
      genero: 'Masculino',
      fecha_nacimiento: '1990-01-01',
      correo_electronico: 'slash2130kevin@gmail.com',
      contrasena: 'contrasena123',
      telefono: '1234567890',
      confirmado: true
    });
    await usuario1.save();

    console.log("Conexión a la base de datos MongoDB exitosa");
  } catch (error) {
    console.error(`Error al conectarse a la base de datos MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarMongoDB;
