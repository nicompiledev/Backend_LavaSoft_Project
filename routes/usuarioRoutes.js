const express = require('express');
const router = express.Router();

const {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
  confirmarCorreoElectronico,
  agregarVehiculo,
  eliminarVehiculo
} = require('../controllers/usuarioController.js');
const checkAuth = require('../middleware/authMiddleware.js')


// área publica
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.post("/nuevo-password/:token", nuevoPassword);
router.post("/confirmar-correo/:token/:otroValor", confirmarCorreoElectronico);

// Area privada
router.get("/perfil", checkAuth, perfil);
router.put("/actualizar_perfil", checkAuth, actualizarPerfil);
router.put("/actualizar-contrasena", checkAuth, actualizarPassword);
router.post("/agregar-vehiculo", checkAuth, agregarVehiculo);
router.post("/eliminar-vehiculo", checkAuth, eliminarVehiculo);

module.exports = router;
