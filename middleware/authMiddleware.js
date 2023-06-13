const jwt = require("jsonwebtoken");
const Usuario = require("../models/type_users/Usuario.js");
const Admin = require("../models/type_users/Admin.js");
const Lavadero = require("../models/type_users/Lavadero.js");

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Obtener el token del encabezado de autorización y decodificarlo
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verificar si el token es nulo o vacío
      if (!token) {
        const error = new Error("Token no válido o inexistente");
        return res.status(403).json({ msg: error.message });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
            "-contrasena -token -visualizado -creado"
          );
          break;
      }

      return next();
    } catch (e) {
      console.log(e);
      const error = new Error("Token no válido");
      return res.status(403).json({ msg: error.message });
    }
  }

  // Si el token no está presente
  const error = new Error("Token no válido o inexistente");
  return res.status(401).json({ msg: error.message });
};

module.exports = checkAuth;
