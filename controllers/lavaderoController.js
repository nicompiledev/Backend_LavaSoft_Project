const generarJWT = require("../helpers/generarJWT.js");
const generarId = require("../helpers/generarId.js");
const emailRegistro = require("../helpers/lavaderos/emailRegistro.js");
const emailCancelado = require("../helpers/lavaderos/emailCancelado.js")
const emailServicioTerminada = require("../helpers/lavaderos/emailServicioTerminada.js")
const emailOlvidePassword = require("../helpers/usuarios/emailOlvidePassword.js");
const { AILavaderoREAL } = require("./openai/openai.js");
const Usuario = require("../models/type_users/Usuario.js");
const Lavadero = require("../models/type_users/lavadero.js");
const {Servicio} = require("../models/Servicio.js");
const { Reserva } = require("../models/Reserva.js");

const registrarLavadero = async (req, res) => {
  let error = "";
  try {
    const { nombreLavadero, NIT, descripcion, ciudad, direccion, telefono, correo_electronico, hora_apertura, hora_cierre, espacios_de_trabajo, longitud, latitud, siNoLoRecogen, tipoVehiculos } = req.body;

    // Si open ai está bien configurado, se puede ejecutar el codigo de abajo
    const respuestaOpenAI = await AILavaderoREAL(nombreLavadero, direccion, correo_electronico, telefono);

    switch (respuestaOpenAI) {
      case "falso":
        error = new Error("La información ingresada es falsa");
        return res.status(400).json({ msg: error.message });
      case "verdadero":
        //continuar el codigo
        break;
      default:
        //return res.status(401).json({ msg: respuestaOpenAI });
        break;
    }

    const existeLavadero = await Lavadero.findOne({ correo_electronico });
    if (existeLavadero) {
      error = new Error("El correo electrónico ya está registrado para otro lavadero");
      return res.status(400).json({ msg: error.message });
    }

    const lavadero = new Lavadero({
      nombreLavadero,
      NIT,
      descripcion,
      ciudad,
      direccion,
      telefono,
      correo_electronico,
      siNoLoRecogen,
      hora_apertura,
      hora_cierre,
      tipoVehiculos: tipoVehiculos, // Inicializa el campo TopoVehiculos
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
        error = new Error("No se subieron imágenes");
        return res.status(500).json({ msg: error.message });
      }

      const imageUrls = await req.files.map((file) => file.path);

      lavaderoGuardado.imagenes = await imageUrls; // asigna las URLs de las imágenes al campo imagenes del lavadero
      await lavaderoGuardado.save(); // guarda las URLs de las imágenes en el lavadero

      // Send email
/*       await emailRegistro({
        email: correo_electronico,
        nombre
      });
 */
      res.status(200).json({ msg: "Lavadero registrado correctamente" });

    } catch (e) {
      // Si se produce un error al insertar las imágenes, cancela el registro del usuario
      await lavaderoGuardado.remove(); // elimina el lavadero recién creado

      // Envía la respuesta de error
      error = new Error("Hubo un error al subir las imágenes");
      res.status(500).json({ msg: error.message });
    }

  } catch (e) {
    error = new Error("Hubo un error al registrar el lavadero");
    res.status(400).json({ msg: error.message });
  }
};


const autenticarLavadero = async (req, res) => {
  let error = "";
  try {
    const { correo_electronico, contrasena } = req.body;

    // Find user by email
    const existeLavadero = await Lavadero.findOne({ correo_electronico });

    if (!existeLavadero) {
      error = new Error("El usuario no existe");
      return res.status(400).json({ msg: error.message });
    }

    if (!existeLavadero.estado) {
      error = new Error("La cuenta no ha sido aceptada por administrador, por favor sé paciente");
      return res.status(400).json({ msg: error.message });
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
      error = new Error("La contraseña es incorrecta");
      return res.status(401).json({ msg: error.message });
    }

  } catch (e) {
    error = new Error("Hubo un error al autenticar el lavadero");
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const getReservasNoAtendidas = async (req, res) => {
  let error = "";
  try {
    const { _id } = req.lavadero;

    const reservas = await Reserva.find({ id_lavadero: _id, estado: "pendiente" });

    res.status(200).json({ reservas });

  } catch (e) {
    error = new Error("Hubo un error al obtener las reservas");
    res.status(500).json({ msg: error.message });
  }
}

const putCancelarReserva = async (req, res) => {

  let error = "";

  try {
    const { id_reserve, id_usuario, id_servicio, motivo } = req.body
    const { nombreLavadero } = req.lavadero

    try{
      const [reserva, usuario, servicio] = await Promise.all([
        Reserva.findById(id_reserve),
        Usuario.findById(id_usuario),
        Servicio.findById(id_servicio)
      ]);
/*    TEMPORALMENTE COMENTADO
      await emailCancelado({
        email: usuario.correo_electronico,
        lavadero: nombreLavadero,
        nombre: usuario.nombre,
        reserva: reserva.fecha,
        servicio: servicio.nombre,
        motivo: motivo
      }); */

      reserva.estado = "cancelado";
      reserva.motivoCancelacion = motivo;

      await reserva.save();
    }catch (e){
      error = new Error("Hubo un error al cancelar la reserva");
      return res.status(404).json({ msg: error.message });
    }

    res.status(200).json({ msg: 'Se cancelo con exito' })

  }
  catch (e) {
    error = new Error("Hubo un error al cancelar la reserva");
    res.status(500).json({ msg: error.message });
  }
}

const servicioTerminado = async (req, res) => {

  let error = "";
  try {
    const { id_reserve, id_usuario } = req.body
    const { nombreLavadero } = req.lavadero

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
        lavadero: nombreLavadero,
      }); */
    } catch (e) {
      error = new Error("Hubo un error al terminar el servicio");
      return res.status(404).json({ msg: error.message });
    }

    res.status(200).json({ msg: 'Se cambio el estado con exito' })

  }
  catch (e) {
    error = new Error("Hubo un error al terminar el servicio");
    res.status(500).json({ msg: error.message });
  }
}

module.exports = {
  registrarLavadero,
  autenticarLavadero,
  getReservasNoAtendidas,
  putCancelarReserva,
  servicioTerminado
};