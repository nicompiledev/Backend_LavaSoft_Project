const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario.js");
const Admin = require("../models/Admin.js");
const Lavadero = require("../models/lavadero.js");

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Obtener el token del encabezado de autorización y decodificarlo
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log(decoded);

      let id = decoded.id;
      let rol = decoded.rol;

      switch (rol) {
        case "usuario":
          // mandar con sus vehiculos
          req.usuario = await Usuario.findById(id).select(
            "-contrasena -token -creado"
          ).populate("vehiculos");
          break;
        case "admin":
          req.admin = await Admin.findById(id).select(
            "-contrasena -token -creado"
          );
          break;
        case "lavadero":
          req.lavadero = await Lavadero.findById(id).select(
            "-contrasena -token -confirmado -creado"
          );
          break;
      }

      return next();
    } catch (e) {
      const error = new Error("Token no Válido");
      return res.status(403).json({ msg: error.message });
    }
  }

  if (!token) {
    const error = new Error("Token no Válido o inexistente");
    res.status(401).json({ msg: error.message });
  }
};

module.exports = checkAuth;
