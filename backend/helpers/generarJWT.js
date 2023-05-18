const jwt = require("jsonwebtoken");

const generarJWT = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generarJWT;
