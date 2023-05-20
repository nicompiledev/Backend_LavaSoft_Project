const express = require('express');
const router = express.Router();

const {
  getLavaderos,
  getLavaderoID
} = require('../controllers/anonimoController.js');

// área publica
router.get("/lavaderos", getLavaderos);
router.get("/lavadero/:id", getLavaderoID);

module.exports = router;