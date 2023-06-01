// const conectarDB = require("../config/mysql.js"); PENDIENTE ELIMINAR
const generarJWT = require("../helpers/generarJWT.js");
const generarId = require("../helpers/generarId.js");
const emailConfirmado = require("../helpers/lavaderos/emailConfirmado.js");
const emailNoConfirmado = require("../helpers/lavaderos/emailNoConfirmado.js");
//const emailOlvidePassword = require("../helpers/emailOlvidePassword.js");

const lavadero = require("../models/lavadero.js");
const Admin = require("../models/Admin.js")

const loguearAdmin = async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  let error = "";
  try {

    const ExisteAdmin = await Admin.findOne({ correo_electronico });

    if (!ExisteAdmin) {
      error = new Error("El correo electrónico no existe");
      return res.status(400).json({ msg: error.message });
    }

    if (await ExisteAdmin.comprobarPassword(contrasena)) {

      // Generate JWT token
      const token = generarJWT(ExisteAdmin._id, "admin");

      res.status(200).json({ nombre: ExisteAdmin.nombreAdmin, token, rol: "admin" });

    } else {
      error = new Error("La contraseña es incorrecta");
      return res.status(401).json({ msg: error.message });
    }

  } catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const getLavederos = async (req, res) => {

  let error = "";
  try {
    const lavaderos = await lavadero.find({ estado: true });
    res.status(200).json(lavaderos);

  } catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const modificarLavadero = async (req, res) => {
  const { id_lavadero } = req.params;
  const { nombre, ciudad, direccion, telefono, correo_electronico, hora_apertura, hora_cierre } = req.body;

  let error = "";
  try {

    const lavadero = await lavadero.findOne({ estado: true, _id: id_lavadero });

    if (!lavadero) {
      error = new Error("El lavadero no existe");
      return res.status(400).json({ msg: error.message });
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

  } catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const eliminarLavadero = async (req, res) => {
  const { id_lavadero } = req.params;

  let error = "";
  try {

    const lavadero = await lavadero.findOne({ estado: true, _id: id_lavadero });

    if (!lavadero) {
      error = new Error("El lavadero no existe");
      return res.status(400).json({ msg: error.message });
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

  } catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const LavaderosNoConfirmados = async (req, res) => {
  let error = "";
  try {
    const lavaderos = await lavadero.find({ estado: false });
    res.status(200).json(lavaderos);
  } catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const activarLavadero = async (req, res) => {

  const { id_lavadero } = req.body;

  let error = "";
  try {

    const lavadero = await lavadero.findOne({ estado: false, _id: id_lavadero });

    if (!lavadero) {
      error = new Error("El lavadero no existe");
      return res.status(400).json({ msg: error.message });
    }

    await lavadero.updateOne(
      { _id: id_lavadero },
      {
        $set: {
          estado: true,
          contrasena: lavadero.nit,
        },
      }
    );

    // Enviar correo de confirmación
    await emailConfirmado({
      correo_electronico: lavadero.correo_electronico,
      nombre: lavadero.nombre,
      contrasena: lavadero.nit,
    });

    res.status(200).json({ msg: "Lavadero activado correctamente" });

  } catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const noActivarLavadero = async (req, res) => {
  const { id_lavadero, motivo } = req.body;

  let error = "";
  try {

    const lavadero = await lavadero.findOne({ estado: false, _id: id_lavadero });

    if (!lavadero) {
      error = new Error("El lavadero no existe");
      return res.status(400).json({ msg: error.message });
    }

    await emailNoConfirmado({
      correo_electronico: lavadero.correo_electronico,
      nombre: lavadero.nombre,
      motivo: motivo,
    });

    res.status(200).json({ msg: "Lavadero no aceptado correctamente" });

    // eliminar lavadero
    await lavadero.deleteOne({ _id: id_lavadero });
  }
  catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  loguearAdmin,
  getLavederos,
  modificarLavadero,
  eliminarLavadero,
  activarLavadero,
  noActivarLavadero,
  LavaderosNoConfirmados,
};



