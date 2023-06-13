// const conectarDB = require("../config/mysql.js"); PENDIENTE ELIMINAR
const {generarJWT} = require("../helpers/generarJWT.js");
const generarId = require("../helpers/generarId.js");
const emailConfirmado = require("../helpers/lavaderos/emailConfirmado.js");
const emailNoConfirmado = require("../helpers/lavaderos/emailNoConfirmado.js");

const Lavadero = require("../models/type_users/Lavadero.js");
const Admin = require("../models/type_users/Admin.js")

const { Reportes } = require("../models/Reportes.js");

const loguearAdmin = async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  console.log(correo_electronico, contrasena);
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

  } catch (e) { console.log(e)
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const getLavederos = async (req, res) => {

  let error = "";
  try {
    const lavaderos = await Lavadero.find({ estado: true });
    res.status(200).json(lavaderos);

  } catch (e) { console.log(e)
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const modificarLavadero = async (req, res) => {
  const { id_lavadero } = req.params;
  const { nombre, ciudad, direccion, telefono, correo_electronico, hora_apertura, hora_cierre } = req.body;

  let error = "";
  try {

    const lavadero = await Lavadero.findOne({ estado: true, _id: id_lavadero });

    if (!lavadero) {
      error = new Error("El lavadero no existe");
      return res.status(400).json({ msg: error.message });
    }

    await Lavadero.updateOne(
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

  } catch (e) { console.log(e)
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const eliminarLavadero = async (req, res) => {
  const { id_lavadero } = req.params;

  let error = "";
  try {

    const lavadero = await Lavadero.findOne({ estado: true, _id: id_lavadero });

    if (!lavadero) {
      error = new Error("El lavadero no existe");
      return res.status(400).json({ msg: error.message });
    }

    await Lavadero.updateOne(
      { _id: id_lavadero },
      {
        $set: {
          estado: false,
        },
      }
    );

    res.status(200).json({ msg: "Lavadero eliminado correctamente" });

  } catch (e) { console.log(e)
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const LavaderosNoConfirmados = async (req, res) => {
  let error = "";
  try {
    const lavaderos = await Lavadero.find({ estado: false });
    res.status(200).json(lavaderos);
  } catch (e) { console.log(e)
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const activarLavadero = async (req, res) => {

  const { id_lavadero } = req.body;

  let error = "";
  try {

    const lavadero = await Lavadero.findOne({ estado: false, _id: id_lavadero });

    if (!lavadero) {
      error = new Error("El lavadero no existe");
      return res.status(400).json({ msg: error.message });
    }

    lavadero.estado = true;
    lavadero.contrasena = lavadero.NIT;

    await lavadero.save();

    // Enviar correo de confirmación
    await emailConfirmado({
      correo_electronico: lavadero.correo_electronico,
      nombre: lavadero.nombreLavadero,
      contrasena: lavadero.NIT,
    });

    res.status(200).json({ msg: "Lavadero activado correctamente" });

  } catch (e) { console.log(e)
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const noActivarLavadero = async (req, res) => {
  const { id_lavadero, motivo } = req.body;

  let error = "";
  try {

    const lavadero = await Lavadero.findOne({ estado: false, _id: id_lavadero });

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
    await Lavadero.deleteOne({ _id: id_lavadero });
  }
  catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};


const getReportes = async (req, res) => {
  let error = "";
  const PAGE_SIZE = 10;
  const page = req.query.page || 1;
  const tipoReporte = req.query.tipo || "";
  const startIndex = (page - 1) * PAGE_SIZE;

  const filter = {
    estado: "Pendiente",
  };

  if(tipoReporte){
    filter.tipo = tipoReporte;
  }

  console.log("filter", filter);

  try {
    const reportes = await Reportes.find(filter).limit(PAGE_SIZE).skip(startIndex).sort({ fecha: 1 });
    const total = await Reportes.countDocuments(filter);
    res.status(200).json({ reportes, totalPages: Math.ceil(total / PAGE_SIZE), currentPage: page });
  }
  catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const AceptarReporte = async (req, res) => {
  const { id_reporte } = req.body;
  let error = "";
  try {
    const reporte = await Reportes.findOne({ estado: "Pendiente", _id: id_reporte });
    if (!reporte) {
      error = new Error("El reporte no existe");
      return res.status(400).json({ msg: error.message });
    }

    // Borrar reporte y al lavadero ponerle un strike
    reporte.estado = "Aceptado";
    await reporte.save();

    const lavaderoStrikes = await Lavadero.updateOne({ _id: reporte.id_lavadero }, { $inc: { strikes: 1 } });
    // Si el lavadero tiene 3 strikes, se desactiva
    if (lavaderoStrikes.strikes == 5) {
      const lavaderoDesactivado = await Lavadero.updateOne({ _id: reporte.id_lavadero }, { $set: { estado: false } });
      if (!lavaderoDesactivado) {
        error = new Error("El lavadero no existe");
        return res.status(400).json({ msg: error.message });
      }
    }

    // Mandar correo al lavadero avisando que se le ha puesto un strike.

    res.status(200).json({ msg: "Reporte aceptado correctamente" });
  }
  catch (e) {
    error = new Error("Hubo un error en el servidor");
    res.status(500).json({ msg: error.message });
  }
};

const RechazarReporte = async (req, res) => {
  const { id_reporte } = req.body;
  let error = "";
  try {
    const reporte = await Reportes.findOne({ estado: "Pendiente", _id: id_reporte });
    if (!reporte) {
      error = new Error("El reporte no existe");
      return res.status(400).json({ msg: error.message });
    }

    // Borrar reporte
    reporte.estado = "Rechazado";
    await reporte.save();

    // Mandar correo al usuario avisando que ya hemos revisado su reporte, gracias por su colaboración.
    
    res.status(200).json({ msg: "Reporte rechazado correctamente" });
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
  getReportes,
  AceptarReporte,
  RechazarReporte
};



