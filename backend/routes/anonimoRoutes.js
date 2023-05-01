const express = require('express');
const router = express.Router();

const {
  getLavaderos,
} = require('../controllers/anonimoController.js');

// área publica
router.get("/lavaderos", getLavaderos);

module.exports = router;