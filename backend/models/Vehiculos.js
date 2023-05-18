const mongoose = require("mongoose");
const vehiculoUsuarioSchema = new mongoose.Schema({
  placa: { type: String, required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  color: { type: String, required: true },
  tipo_vehiculo: { type: String, required: true }
});

const VehiculoUsuario = mongoose.model("VehiculoUsuario", vehiculoUsuarioSchema);

module.exports = { VehiculoUsuario };