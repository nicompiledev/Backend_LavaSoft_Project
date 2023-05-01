const mongoose = require("mongoose");

const servicioSchema = new mongoose.Schema({
  lavadero: { type: mongoose.Schema.Types.ObjectId, ref: "Lavadero" },
  nombre: { type: String, required: true },
  detalle: { type: String, required: true },
  costo: { type: Number, required: true },
  duracion: { type: Number, required: true }
});


const Servicio = mongoose.model("Servicio", servicioSchema);

module.exports = { Servicio };