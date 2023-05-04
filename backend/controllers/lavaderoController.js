const Lavadero = require("../models/lavadero.js");
const generarJWT = require("../helpers/generarJWT.js");
const generarId = require("../helpers/generarId.js");
const emailRegistro = require("../helpers/lavaderos/emailRegistro.js");
const emailOlvidePassword = require("../helpers/usuarios/emailOlvidePassword.js");
const openai = require("./openai/openai.js");
const Usuario = require("../models/Usuario.js");
const {Reserva} = require("../models/Reserva.js");

const registrarLavadero = async (req, res) => {
  try {

    const { nombre, ciudad, direccion, telefono, correo_electronico, contrasena, hora_apertura, hora_cierre, espacios_de_trabajo, longitud, latitud } = req.body;

    // si algun campo esta vacio
    if (!nombre || !ciudad || !direccion || !telefono || !correo_electronico || !contrasena || !hora_apertura || !hora_cierre || !espacios_de_trabajo || !longitud || !latitud) {
      return res.status(400).json({ msg: "Por favor, rellene todos los campos" });
    }

    // Si open ai está bien configurado, se puede ejecutar el codigo de abajo
    const respuestaOpenAI = await openai(nombre, direccion, correo_electronico, telefono);

    switch (respuestaOpenAI) {
      case "falso":
        return res.status(400).json({ msg: "La información ingresada es falsa" });
      case "verdadero":
        //continuar el codigo
        break;
      default:
        return res.status(401).json({ msg: respuestaOpenAI });
    }

    const existeLavadero = await Lavadero.findOne({ correo_electronico });
    if (existeLavadero) {
      return res.status(400).json({ msg: "El lavadero ya existe" });
    }

    const lavadero = new Lavadero({
      nombre,
      ciudad,
      direccion,
      telefono,
      correo_electronico,
      contrasena,
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

      const imageUrls = req.files.map((file) => file.path);

      lavaderoGuardado.imagenes = imageUrls; // asigna las URLs de las imágenes al campo imagenes del lavadero
      await lavaderoGuardado.save(); // guarda las URLs de las imágenes en el lavadero

      // Send email
      await emailRegistro({
        correo_electronico,
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

    // Check if the password is correct
    const isMatch = await Usuario.comprobarPassword(contrasena);

    if (!isMatch) {
      return res.status(400).json({ msg: "La contraseña es incorrecta" });
    }

    // Generate JWT token
    const token = generarJWT(existeLavadero._id);

    res.status(200).json({
      _id: existeLavadero._id,
      nombre: existeLavadero.nombre,
      ciudad: existeLavadero.ciudad,
      direccion: existeLavadero.direccion,
      telefono: existeLavadero.telefono,
      correo_electronico: existeLavadero.correo_electronico,
      hora_apertura: existeLavadero.hora_apertura,
      hora_cierre: existeLavadero.hora_cierre,
      token,
      imagenes: existeLavadero.imagenes,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const getReservasNoAtendidas = async (req, res) => {
  try {
    const { id_lavadero } = req.params;

    if(!id_lavadero){
      return res.status(400).json({ msg: "No se ha enviado el id del lavadero" });
    }

    const reservas = await Reserva.find({ id_lavadero, estado: "pendiente" });

    if(!reservas){
      return res.status(400).json({ msg: "No hay reservas pendientes" });
    }

    res.status(200).json({ reservas });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
}



module.exports = {
  registrarLavadero,
  autenticarLavadero,
  getReservasNoAtendidas
};