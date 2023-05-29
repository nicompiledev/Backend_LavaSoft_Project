// const conectarDB = require("../config/mysql.js"); PENDIENTE ELIMINAR
const generarJWT = require("../helpers/generarJWT.js");
const generarId = require("../helpers/generarId.js");
const emailConfirmado = require("../helpers/lavaderos/emailConfirmado.js");
//const emailOlvidePassword = require("../helpers/emailOlvidePassword.js");
const lavadero = require("../models/lavadero.js");
const Admin = require("../models/Admin.js")

const loguearAdmin = async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  try {

    const ExisteAdmin = await Admin.findOne({ correo_electronico });

    if (!ExisteAdmin) {
      return res.status(400).json({ msg: "El ADMINISTRADOR no existe" });
    }

    if (!ExisteAdmin.confirmado) {
      return res.status(400).json({ msg: "El usuario no ha confirmado su cuenta" });
    }

    if (await ExisteAdmin.comprobarPassword(contrasena)) {

      // Generate JWT token
      const token = generarJWT(ExisteAdmin._id, "admin");

      res.status(200).json({ nombre: ExisteAdmin.nombreAdmin, token, rol: "admin" });

    } else {
      return res.status(401).json({ msg: "La contraseña es incorrecta" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const getLavederos = async (req, res) => {
  try {
    const lavaderos = await lavadero.find({ estado: false });
    res.status(200).json(lavaderos);

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



