const express = require('express');
const router = express.Router();

const {
  getLavaderos,
  getLavaderoID,
  getLavaderosRadio
} = require('../controllers/anonimoController.js');

// área publica
router.get("/lavaderos", getLavaderos);
router.get("/lavadero/:id", getLavaderoID);
router.post("/lavaderosRadio", getLavaderosRadio)

module.exports = router;