const jwt = require("jsonwebtoken");
// id, rol y de manera opcional hasPaid
const generarJWT = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const generarJWTHasPaid = (id, rol, hasPaid, visualizado) => {
  return jwt.sign({ id, rol, hasPaid, visualizado }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { generarJWT, generarJWTHasPaid };
