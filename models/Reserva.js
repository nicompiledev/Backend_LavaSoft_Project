const mongoose = require("mongoose");
const reservaSchema = new mongoose.Schema({
  id_lavadero: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lavadero", required: true }],
  id_usuario: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }],
  id_servicio: [{ type: mongoose.Schema.Types.ObjectId, ref: "Servicio", required: true }],
  fecha: { type: String, required: true },
  hora_inicio: { type: String, required: true },
  hora_fin: { type: String, required: true },
  espacio_de_trabajo: { type: Number, required: true },
  estado: { type: String, enum: ["pendiente", "terminado", "cancelado"], default: "pendiente"},
  motivoCancelacion: {type: String, default: "No fue cancelado"}
});


const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = { Reserva };