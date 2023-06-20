const mongoose = require("mongoose");
const reservaSchema = new mongoose.Schema({
  id_lavadero: { type: mongoose.Schema.Types.ObjectId, ref: "Lavadero", required: true },
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  nombre_servicio: { type: String, required: true },
  nombre_usuario: { type: String, required: true },
  id_vehiculo: { type: mongoose.Schema.Types.ObjectId, ref: "VehiculoUsuario", required: true },
  placa_vehiculo: { type: String, required: true },
  tipo_vehiculo: { type: String, required: true },
  fecha: { type: String, required: true },
  hora_inicio: { type: String, required: true },
  hora_fin: { type: String, required: true },
  espacio_de_trabajo: { type: Number, required: true },
  costoTotal: { type: Number, required: true },
  estado: { type: String, enum: ["pendiente", "proceso", "terminado", "cancelado"], default: "pendiente"},
  motivoCancelacion: {type: String, default: "No fue cancelado"},
  nombre_emplado: { type: String, required: false },
});


const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = { Reserva };