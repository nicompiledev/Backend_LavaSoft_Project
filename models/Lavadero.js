const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const generarId = require("../helpers/generarId.js");

const LavaderoSchema = new mongoose.Schema({
  nombreLavadero: { type: String, required: true },
  NIT: { type: String, required: true },
  descripcion: {type: String, required: true},
  ciudad: { type: String, required: true },
  direccion: { type: String, required: true },
  telefono: { type: String, required: true },
  correo_electronico: { type: String, required: true, unique: true },
  contrasena: { type: String },
  hora_apertura: { type: String, required: true },
  hora_cierre: { type: String, required: true },
  tipoVehiculos: [{ type: String, enum: ['Moto', 'Carro', 'Camioneta', 'Bus', 'Camion'], required: true}],
  // Estados
  estado: { type: Boolean, default: false },
  visualizado: {type: Boolean, default: false,},
  token: { type: String, default: generarId() },
  creado: { type: Date, default: Date.now() },
  siNoLoRecogen: {type: String, required: true },
  imagenes: [{ type: String }], // nuevo campo de matriz de imágenes
  espacios_de_trabajo: { type: Number, required: true },
  ubicacion: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  servicios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Servicio' }],
});

// indexar ubicación
LavaderoSchema.index({ ubicacion: "2dsphere" });

// pre-save hook
LavaderoSchema.pre("save", async function (next) {
  // Hash the password only if it has been modified or is new
  if (!this.isModified("contrasena")) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// method to compare password
LavaderoSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.contrasena);
};

const Lavadero = mongoose.model("Lavadero", LavaderoSchema);

module.exports = Lavadero;
