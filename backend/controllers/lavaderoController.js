const generarJWT = require("../helpers/generarJWT.js");
const generarId = require("../helpers/generarId.js");
const emailRegistro = require("../helpers/lavaderos/emailRegistro.js");
const emailCancelado = require("../helpers/lavaderos/emailCancelado.js")
const emailServicioTerminada = require("../helpers/lavaderos/emailServicioTerminada.js")
const emailOlvidePassword = require("../helpers/usuarios/emailOlvidePassword.js");
const openai = require("./openai/openai.js");
const Usuario = require("../models/Usuario.js");
const Lavadero = require("../models/lavadero.js");
const {Servicio} = require("../models/Servicio.js");
const { Reserva } = require("../models/Reserva.js");

const registrarLavadero = async (req, res) => {
  try {

    const { nombreLavadero, NIT, decripcion, ciudad, direccion, telefono, correo_electronico, hora_apertura, hora_cierre, espacios_de_trabajo, longitud, latitud, siNoLoRecogen, tipoVehiculos } = req.body;

    // Si open ai está bien configurado, se puede ejecutar el codigo de abajo
    const respuestaOpenAI = await openai(nombreLavadero, direccion, correo_electronico, telefono);

    switch (respuestaOpenAI) {
      case "falso":
        return res.status(400).json({ msg: "La información ingresada es falsa" });
      case "verdadero":
        //continuar el codigo
        break;
      default:
        //return res.status(401).json({ msg: respuestaOpenAI });
        break;
    }

    const existeLavadero = await Lavadero.findOne({ correo_electronico });
    if (existeLavadero) {
      return res.status(400).json({ msg: "El lavadero ya existe" });
    }

    const lavadero = new Lavadero({
      nombreLavadero,
      NIT,
      decripcion,
      ciudad,
      direccion,
      telefono,
      correo_electronico,
      contrasena,
      siNoLoRecogen,
      tipoVehiculos,
      hora_apertura,
      hora_cierre,
      imagenes: [], // inicializa el campo imagenes
      espacios_de_trabajo,
      ubicacion: {
        type: "Point",
        coordinates: [longitud, latitud],
      },
    });

    // Save the user to the database
    const lavaderoGuardado = await lavadero.save();
    try {
      // Save images
      if (!req.files) {
        return res.status(500).send("Hubo un error al subir las imágenes");
      }

      const imageUrls = await req.files.map((file) => file.path);

      lavaderoGuardado.imagenes = await imageUrls; // asigna las URLs de las imágenes al campo imagenes del lavadero
      await lavaderoGuardado.save(); // guarda las URLs de las imágenes en el lavadero

      // Send email
      await emailRegistro({
        email: correo_electronico,
        nombre
      });

      res.status(200).json({ msg: "Lavadero registrado correctamente" });

    } catch (error) {
      // Si se produce un error al insertar las imágenes, cancela el registro del usuario
      await lavaderoGuardado.remove(); // elimina el lavadero recién creado

      // Envía la respuesta de error
      res.status(500).send("Hubo un error al subir las imágenes");
    }

  } catch (error) {
    res.status(500).send("Hubo un error al registrar el usuario");
  }
};


const autenticarLavadero = async (req, res) => {
  try {
    const { correo_electronico, contrasena } = req.body;

    // Find user by email
    const existeLavadero = await Lavadero.findOne({ correo_electronico });

    if (!existeLavadero) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    if (!existeLavadero.confirmado) {
      return res.status(400).json({ msg: "El usuario no ha confirmado su cuenta" });
    }

    if (await existeLavadero.comprobarPassword(contrasena)) {

      // Generate JWT token
      const token = generarJWT(existeLavadero._id, "lavadero");

      res.status(200).json({
        _id: existeLavadero._id,
        nombre: existeLavadero.nombreLavadero,
        NIT: existeLavadero.NIT,
        descripcion: existeLavadero.descripcion,
        ciudad: existeLavadero.ciudad,
        direccion: existeLavadero.direccion,
        telefono: existeLavadero.telefono,
        correo_electronico: existeLavadero.correo_electronico,
        tipoVehiculos: existeLavadero.tipoVehiculos,
        siNoLoRecogen: existeLavadero.siNoLoRecogen,
        hora_apertura: existeLavadero.hora_apertura,
        hora_cierre: existeLavadero.hora_cierre,
        tipoVehiculos: existeLavadero.tipoVehiculos,
        token,
        rol: "lavadero",
        imagenes: existeLavadero.imagenes,
      });
    } else {
      return res.status(401).json({ msg: "La contraseña es incorrecta" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const getReservasNoAtendidas = async (req, res) => {
  try {
    const { _id } = req.lavadero;

    const reservas = await Reserva.find({ id_lavadero: _id, estado: "pendiente" });

    if (reservas.length === 0) {
      return res.status(204).json({ msg: "No hay reservas pendientes" });
    }

    res.status(200).json({ reservas });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
}

const putCancelarReserva = async (req, res) => {
  try {
    const { id_reserve, id_usuario, id_servicio, motivo } = req.body
    const { nombre } = req.lavadero


    try{
      const [reserva, usuario, servicio] = await Promise.all([
        Reserva.findById(id_reserve),
        Usuario.findById(id_usuario),
        Servicio.findById(id_servicio)
      ]);
/*    TEMPORALMENTE COMENTADO
      await emailCancelado({
        email: usuario.correo_electronico,
        lavadero: nombre,
        nombre: usuario.nombre,
        reserva: reserva.fecha,
        servicio: servicio.nombre,
        motivo: motivo
      }); */

      reserva.estado = "cancelado";
      reserva.motivoCancelacion = motivo;

      await reserva.save();
    }catch(error){
      return res.status(404).json({ msg: 'La reserva o el usuario no existe' })
    }

    res.status(200).json({ msg: 'Se cancelo con exito' })

  }
  catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
}

const servicioTerminado = async (req, res) => {
  try {
    const { id_reserve, id_usuario } = req.body
    const { nombre } = req.lavadero

    try {
      const [reserva, usuario ] = await Promise.all([
        Reserva.findById(id_reserve),
        Usuario.findById(id_usuario),
      ]);

      reserva.estado = 'terminado'

      await reserva.save()

/*  TEMPORALMENTE DESACTIVADO
      await emailServicioTerminada({
        email: usuario.correo_electronico,
        nombre: usuario.nombre,
        lavadero: nombre,
      }); */
    } catch (error) {
      return res.status(404).json({ msg: 'La reserva o el usuario no existe' })
    }

    res.status(200).json({ msg: 'Se cambio el estado con exito' })

  }
  catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
}

module.exports = {
  registrarLavadero,
  autenticarLavadero,
  getReservasNoAtendidas,
  putCancelarReserva,
  servicioTerminado
};