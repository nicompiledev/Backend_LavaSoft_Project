const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario.js");

const checkAuth = async (req, res, next) => {
  let token;
    // Verificar si hay un token en el encabezado de autorización
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Obtener el token del encabezado de autorización y decodificarlo
      try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);


      req.usuario = await Usuario.findById(decoded.id).select(
        "-contrasena -token -confirmado -creado"
      );

      return next();
    } catch (error) {
      const e = new Error("Token no Válido");
      return res.status(403).json({ msg: e.message });
    }
  }

  if (!token) {
    const error = new Error("Token no Válido o inexistente");
    res.status(403).json({ msg: error.message });
  }
};

module.exports = checkAuth;
