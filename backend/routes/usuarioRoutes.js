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
} = require('../controllers/usuarioController.js');
const checkAuth = require('../middleware/authMiddleware.js')


// área publica
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.post("/nuevo-password/:token", nuevoPassword);

// Area privada
router.get("/perfil", checkAuth, perfil);
router.put("/actualizar_perfil", checkAuth, actualizarPerfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);

module.exports = router;
