const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
  id_lavadero: { type: String, required: true },
  id_usuario: { type: String, required: true },
  id_servicio: { type: String, required: true },
  fecha: { type: String, required: true },
  hora_inicio: { type: String, required: true },
  hora_fin: { type: String, required: true },
  espacio_de_trabajo: { type: Number, required: true },
});

const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = { Reserva };