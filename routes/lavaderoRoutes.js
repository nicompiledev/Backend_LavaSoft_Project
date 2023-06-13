const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'IMAGENES_LAVADEROS',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname
  }
});

const upload = multer({ storage: storage });

const {
  registrarLavadero,
  editarLavadero,
  autenticarLavadero,
  getReservasNoAtendidas,
  putCancelarReserva,
  servicioTerminado,
  crearSesionPago,
  webhook
} = require('../controllers/lavaderoController.js');
const checkAuth = require('../middleware/authMiddleware.js')


// área publica
router.post("/peticion", upload.array('images'), registrarLavadero);
router.post("/login", autenticarLavadero)

// Area Privada
router.put("/lavadero", checkAuth, upload.array('images'), editarLavadero);
router.get("/reservas", checkAuth, getReservasNoAtendidas);
router.delete("/reservas", checkAuth, putCancelarReserva);
router.put("/reservas", checkAuth, servicioTerminado);
router.post("/irapagar", checkAuth, crearSesionPago);

// Webhooks
router.post("/webhook", webhook);

module.exports = router;