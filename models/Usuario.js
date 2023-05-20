const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const generarId = require("../helpers/generarId.js");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
  },
  genero: {
    type: String,
    enum: ["Masculino", "Femenino"],
    required: true,
    trim: true,
  },
  fecha_nacimiento: {
    type: Date,
    required: true,
  },
  correo_electronico: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  contrasena: {
    type: String,
    required: true,
    trim: true,
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    default: generarId(), // Se usa un helper para generar un ID aleatorio por defecto
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
  vehiculos: [{ type: mongoose.Schema.Types.ObjectId, ref: "VehiculoUsuario" }],
})

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("contrasena")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
});

usuarioSchema.methods.comprobarPassword = async function (
  passwordFormulario
) {
  return await bcrypt.compare(passwordFormulario, this.contrasena);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;
