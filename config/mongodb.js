const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.set("strictQuery", false);

const faker = require('faker');
require('faker/locale/es_MX.js');


const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

/*     const { Servicio } = require("../models/Servicio.js");
    const Lavadero = require("../models/type_users/lavadero.js");


    for (let i = 0; i < 50; i++) {

      const imagenes = [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ];

      const tipoVehiculos = [
        "Carro",
        "Moto",
        "Camioneta",
        "Camion",
        "Bus",
      ];

      const indicesAleatorios = [];
      const indicesAleatorios2 = [];


      while (indicesAleatorios.length < 3) {
        const indice = Math.floor(Math.random() * imagenes.length);
        const indice2 = Math.floor(Math.random() * tipoVehiculos.length);

        if (!indicesAleatorios.includes(indice)) {
          indicesAleatorios.push(indice);
        }

        if (!indicesAleatorios2.includes(indice2)) {
          indicesAleatorios2.push(indice2);
        }
      }

      const imagenesSeleccionadas = [];
      const tipo = [];

      indicesAleatorios.forEach(indice => {
        imagenesSeleccionadas.push(imagenes[indice]);
      });

      indicesAleatorios2.forEach(indice2 => {
        tipo.push(tipoVehiculos[indice2]);
      });

      const lavadero1 = new Lavadero({
        nombreLavadero: faker.company.companyName(),
        NIT: faker.datatype.number().toString(),
        descripcion: faker.lorem.sentence(),
        ciudad: faker.address.city(),
        direccion: faker.address.streetAddress(),
        telefono: faker.phone.phoneNumber(),
        correo_electronico: "lavadero" + i + "@gmail.com",
        contrasena: "contrasena123",
        hora_apertura: '8:00 AM',
        hora_cierre: '5:00 PM',
        tipoVehiculos: tipo,
        estado: true,
        siNoLoRecogen: 'asdasd',
        imagenes: imagenesSeleccionadas,
        espacios_de_trabajo: faker.datatype.number(),
        ubicacion: {
          type: 'Point',
          coordinates: [faker.address.longitude(), faker.address.latitude()],
        },
      });

      await lavadero1.save();

      const servicio1 = new Servicio({ nombre: 'Servicio 1', tipoVehiculo: "Carro", categoria: 'lavado', detalle: 'Detalle del servicio 1', costo: 100, duracion: 30 });
      await servicio1.save();

      const servicio2 = new Servicio({ nombre: 'Servicio 2', tipoVehiculo: "Moto", categoria: 'lavado', detalle: 'Detalle del servicio 2', costo: 200, duracion: 60 });
      await servicio2.save();

      const lavadero = await Lavadero.findById(lavadero1._id);
      lavadero.servicios.push(servicio1._id);
      lavadero.servicios.push(servicio2._id);
      await lavadero.save();
    }

    for (let i = 0; i < 10; i++) {
      const lavadero1 = new Lavadero({
        nombreLavadero: faker.company.companyName(),
        NIT: faker.datatype.number().toString(),
        descripcion: faker.lorem.sentence(),
        ciudad: faker.address.city(),
        direccion: faker.address.streetAddress(),
        telefono: faker.phone.phoneNumber(),
        correo_electronico: "lavaderoNoLISTO" + i + "@gmail.com",
        contrasena: "contrasena123",
        hora_apertura: '8:00 AM',
        hora_cierre: '5:00 PM',
        tipoVehiculos: ['Moto', 'Carro'], // Cambia los tipos de vehículos según tus necesidades
        estado: false,
        siNoLoRecogen: 'asdasd',
        imagenes: [
          faker.image.imageUrl(),
          faker.image.imageUrl(),
          faker.image.imageUrl(),
        ],
        espacios_de_trabajo: faker.datatype.number(),
        ubicacion: {
          type: 'Point',
          coordinates: [faker.address.longitude(), faker.address.latitude()],
        },
      });

      await lavadero1.save()
    }


    const Usuario = require("../models/type_users/Usuario.js");
    const usuario1 = new Usuario({
      nombre: 'Usuario 1',
      apellido: 'Apellido 1',
      genero: 'Masculino',
      fecha_nacimiento: '1990-01-01',
      correo_electronico: 'prueba@gmail.com',
      contrasena: 'contrasena123',
      telefono: '1234567890',
      confirmado: true
    });
    await usuario1.save();


    // crear administrador
    const Admin = require("../models/type_users/Admin.js");

    const admin1 = new Admin({
      nombreAdmin: 'Admin 1',
      correo_electronico: 'admin@gmail.com',
      contrasena: 'contrasena123',
    });
    await admin1.save(); */


    console.log("Conexión a la base de datos MongoDB exitosa");
  } catch (error) {
    console.error(`Error al conectarse a la base de datos MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarMongoDB;
