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
    folder: 'user_uploads',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname
  }
});

const upload = multer({ storage: storage });

const {
  loguearAdmin,
  getLavederos,
  getLavadero,
  modificarLavadero,
  eliminarLavadero,
} = require('../controllers/adminController.js');
const checkAuthAdmin = require('../middleware/authMiddlewareAdmin.js');


// área publica
router.post("/login", loguearAdmin);

// area privada
//router.post("/registrar-lavadero", upload.array('images'), registrarLavadero);
router.get("/lavaderos", checkAuthAdmin, getLavederos);
router.get("/lavaderos/:id_lavadero", checkAuthAdmin, getLavadero);
router.put("/lavaderos/:id_lavadero", checkAuthAdmin, modificarLavadero);
router.delete("/lavaderos/:id_lavadero", checkAuthAdmin, eliminarLavadero);

module.exports = router;