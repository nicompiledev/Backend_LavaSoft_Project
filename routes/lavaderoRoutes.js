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
  // basico
  registrarLavadero,
  editarLavadero,
  autenticarLavadero,
  getLavadero,

  // lavadero
  getReservasNoAtendidas,
  getReservasProceso,
  getReservasTerminadas,

  confirmarReserva,
  putCancelarReserva,
  servicioTerminado,

  // refrescar token
  refrescarToken,

  // pago
  crearSesionPago,
  webhook,

  // estadisticas
  obtenerGananciasTodosLosMeses,
  obtenerServiciosMasMenosSolicitados
} = require('../controllers/lavaderoController.js');
const checkAuth = require('../middleware/authMiddleware.js')


// área publica
router.post("/peticion", upload.array('images'), registrarLavadero);
router.post("/login", autenticarLavadero)

// Area Privada
router.get("/lavadero", checkAuth, getLavadero);
router.put("/lavadero", checkAuth, upload.array('images'), editarLavadero);
router.post("/reservas", checkAuth, getReservasNoAtendidas);
router.get("/reservas/proceso", checkAuth, getReservasProceso);
router.post("/reservas/terminadas", checkAuth, getReservasTerminadas);

router.put("/reservas/confirmar", checkAuth, confirmarReserva);
router.put("/reservas/cancelar", checkAuth, putCancelarReserva);
router.put("/reservas/terminar", checkAuth, servicioTerminado);
router.get("/refreshToken", checkAuth, refrescarToken);

router.post("/irapagar", checkAuth, crearSesionPago);

// Webhooks
router.post("/webhook", webhook);

// estadisticas
router.post("/estadisticas/ganancias", checkAuth, obtenerGananciasTodosLosMeses);
router.post("/estadisticas/servicios", checkAuth, obtenerServiciosMasMenosSolicitados);

module.exports = router;