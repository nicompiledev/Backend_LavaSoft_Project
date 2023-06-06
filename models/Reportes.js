const mongoose = require("mongoose");
const reportesSchema = new mongoose.Schema({
  id_usuario: { type: String, required: true },
  nombre_usuario: { type: String, required: true },
  id_lavadero: { type: String, required: true },
  nombre_lavadero: { type: String, required: true },
  razon: { type: String, required: true },
  tipo: { type: String, enum: ["Informacion falsa", "Cambio de ubicacion", "Cierre temporal o permanente", "Mal servicio al cliente", "Incumplimiento de normas de seguridad"], required: true },
  descripcion: { type: String, required: true },
  fecha: { type: String, default: Date.now() },
});

const Reportes = mongoose.model("Reportes", reportesSchema);

module.exports = { Reportes };
