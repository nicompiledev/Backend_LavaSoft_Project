const mongoose = require("mongoose");

  const servicioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String, enum: ["lavado", "encerado", "polichado", "aspirado", "desinfeccion", "otros"], required: true },
    tipoVehiculo: { type: String, required: true },
    detalle: { type: String, required: true },
    costo: { type: Number, required: true },
    duracion: { type: Number, required: true }
  });


const Servicio = mongoose.model("Servicio", servicioSchema);

module.exports = { Servicio };