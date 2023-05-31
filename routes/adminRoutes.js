const express = require('express');
const router = express.Router();
require('dotenv').config();


const {
  loguearAdmin,
  getLavederos,
  modificarLavadero,
  eliminarLavadero,
  activarLavadero,
  noActivarLavadero,
  LavaderosNoConfirmados,
} = require('../controllers/adminController.js');
const checkAuth = require('../middleware/authMiddleware.js')


// área publica
router.post("/login", loguearAdmin);

// area privada
router.get("/getAlllavadero", checkAuth, getLavederos);
router.put("/lavaderos/:id_lavadero", checkAuth, modificarLavadero);
router.delete("/lavaderos/:id_lavadero", checkAuth, eliminarLavadero);
router.post("/lavaderos/activar", checkAuth, activarLavadero);
router.post("/lavaderos/no-activar", checkAuth, noActivarLavadero);
router.get("/lavaderos/no-confirmados", checkAuth, LavaderosNoConfirmados);


module.exports = router;