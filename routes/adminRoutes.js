const express = require('express');
const router = express.Router();
require('dotenv').config();


const {
  loguearAdmin,
  getLavederos,
  getLavadero,
  modificarLavadero,
  eliminarLavadero,
} = require('../controllers/adminController.js');
const checkAuth = require('../middleware/authMiddleware.js')


// área publica
router.post("/login", loguearAdmin);

// area privada
router.get("/lavaderos", getLavederos);
router.get("/lavaderos/:id_lavadero", checkAuth, getLavadero);
router.put("/lavaderos/:id_lavadero", checkAuth, modificarLavadero);
router.delete("/lavaderos/:id_lavadero", checkAuth, eliminarLavadero);

module.exports = router;