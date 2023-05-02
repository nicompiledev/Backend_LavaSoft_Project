const conectarDB = require("../config/mysql.js");
const generarJWT = require("../helpers/generarJWT.js");
const generarId = require("../helpers/generarId.js");
const emailConfirmado = require("../helpers/lavaderos/emailConfirmado.js");
const emailOlvidePassword = require("../helpers/emailOlvidePassword.js");
const bcrypt = require("bcrypt");
const lavadero = require("../models/lavadero.js");

const loguearAdmin = async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  let conexion;
  try {

    conexion = await conectarDB();

    const [row] = await conexion.execute(
      `SELECT id_administrador, contrasena FROM administradores WHERE correo_electronico = ?`,
      [correo_electronico]
    );

    if (row.length === 0) {
      res.status(400).json({ msg: "El usuario no existe" });
      return;
    }

    const usuarioAdmin = row[0];

    const validPassword = await bcrypt.compare(contrasena, usuarioAdmin.contrasena);

    if (!validPassword) {
      res.status(400).json({ msg: "Contraseña incorrecta" });
      return;
    }

    // Generar el JWT y devolverlo:
    const token = generarJWT(usuarioAdmin.id_administrador);
    // Autenticar
    res.json({
      id_usuario: usuarioAdmin.id_administrador,
      correo_electronico: usuarioAdmin.correo_electronico,
      token: token,
    });

    res.status(200).json({ msg: "Usuario logueado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  } finally {
    if (conexion) {
      try {
        await conexion.close();
      } catch (error) {
        console.log('Error al cerrar la conexión:', error);
      }
    }
  }
};
/*
const LavaderoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ciudad: { type: String, required: true },
  direccion: { type: String, required: true },
  telefono: { type: String, required: true },
  correo_electronico: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  hora_apertura: { type: String, required: true },
  hora_cierre: { type: String, required: true },
  estado: { type: Boolean, default: true },
  confirmado: {type: Boolean, default: false,},
  token: { type: String, default: generarId() },
  imagenes: [{ type: String }], // nuevo campo de matriz de imágenes
  espacios_de_trabajo: { type: Number, required: true },
  ubicacion: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true },
  }
});
 */

const getLavederos = async (req, res) => {
  try {
    const lavaderos = await lavadero.find({ estado: true });
    res.status(200).json({
      nombre: lavaderos.nombre,
      ciudad: lavaderos.ciudad,
      direccion: lavaderos.direccion,
      telefono: lavaderos.telefono,
      correo_electronico: lavaderos.correo_electronico,
      hora_apertura: lavaderos.hora_apertura,
      hora_cierre: lavaderos.hora_cierre,
      espacio_de_trabajo: lavaderos.espacio_de_trabajo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const getLavadero = async (req, res) => {
  const { id_lavadero } = req.params;
  try {

    // Traer el lavadero, que estado sea true y que el id sea el que viene en los parámetros
    const lavadero = await lavadero.findOne({ estado: true, _id: id_lavadero });

    if (!lavadero) {
      return res.status(400).json({ msg: "El lavadero no existe" });
    }

    res.status(200).json(lavadero);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const modificarLavadero = async (req, res) => {
  const { id_lavadero } = req.params;
  const { nombre, ciudad, direccion, telefono, correo_electronico, hora_apertura, hora_cierre } = req.body;

  try {

    const lavadero = await lavadero.findOne({ estado: true, _id: id_lavadero });

    if (!lavadero) {
      return res.status(400).json({ msg: "El lavadero no existe" });
    }

    await lavadero.updateOne(
      { _id: id_lavadero },
      {
        $set: {
          nombre: nombre,
          ciudad: ciudad,
          direccion: direccion,
          telefono: telefono,
          correo_electronico: correo_electronico,
          hora_apertura: hora_apertura,
          hora_cierre: hora_cierre,
        },
      }
    );

    res.status(200).json({ msg: "Lavadero modificado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const eliminarLavadero = async (req, res) => {
  const { id_lavadero } = req.params;

  try {

    const lavadero = await lavadero.findOne({ estado: true, _id: id_lavadero });

    if (!lavadero) {
      return res.status(400).json({ msg: "El lavadero no existe" });
    }

    await lavadero.updateOne(
      { _id: id_lavadero },
      {
        $set: {
          estado: false,
        },
      }
    );

    res.status(200).json({ msg: "Lavadero eliminado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const getLavaderosNoConfirmados = async (req, res) => {
  try {
    const lavaderos = await lavadero.find({ estado: false });
    res.status(200).json({
      nombre: lavaderos.nombre,
      ciudad: lavaderos.ciudad,
      direccion: lavaderos.direccion,
      telefono: lavaderos.telefono,
      correo_electronico: lavaderos.correo_electronico,
      hora_apertura: lavaderos.hora_apertura,
      hora_cierre: lavaderos.hora_cierre,
      espacio_de_trabajo: lavaderos.espacio_de_trabajo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const activarLavadero = async (req, res) => {
  const { id_lavadero } = req.params;

  try {

    const lavadero = await lavadero.findOne({ estado: false, _id: id_lavadero });

    if (!lavadero) {
      return res.status(400).json({ msg: "El lavadero no existe" });
    }

    await lavadero.updateOne(
      { _id: id_lavadero },
      {
        $set: {
          estado: true,
        },
      }
    );

    // Enviar correo de confirmación
    await emailConfirmado({
      correo_electronico: lavadero.correo_electronico,
      nombre: lavadero.nombre,
    });

    res.status(200).json({ msg: "Lavadero activado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

module.exports = {
  loguearAdmin,
  getLavederos,
  getLavadero,
  modificarLavadero,
  eliminarLavadero,
  activarLavadero,
};



