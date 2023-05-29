const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  nombreAdmin: {type: String, required: true },
  correo_electronico: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  token: { type: String, required: false },
  creado: { type: Date, default: Date.now() },
});

adminSchema.pre("save", async function (next) {
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
adminSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.contrasena);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;