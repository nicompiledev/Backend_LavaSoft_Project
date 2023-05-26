const express = require('express');
const responseTime = require("response-time");
const dotenv = require('dotenv');
const cors = require('cors');
const { conectarMongoDB } = require('./config/index.js');
const usuarioRoutes = require('./routes/usuarioRoutes.js');
const adminRouter = require('./routes/adminRoutes.js');
const lavaderoRouter = require('./routes/lavaderoRoutes.js');
const anonimoRouter = require('./routes/anonimoRoutes.js');
const initSockets = require('./socket/sockets.js');
const chatSocket = require('./socket/chat.js');
const socketIO = require('socket.io');

//JWT:
const jwt = require('jsonwebtoken');

// Model Requerido para el middleware de sockets
const Usuario = require('./models/Usuario.js');

// Imports
const app = express();
const http = require("http");
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.use(async (socket, next) => {
  if (socket.handshake.headers.rol === 'admin') {
    return next()
  } else if (socket.handshake.headers && socket.handshake.headers.authorization) {
    const token = socket.handshake.headers.authorization.split(' ')[1];
    // Verificar el token aquí
    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let id = decoded.id;
      let rol = decoded.rol;

      switch (rol) {
        case "usuario":
          socket.usuario = await Usuario.findById(id).select(
            "-contrasena -token -confirmado -creado"
          );
          break;
        case "admin":
          socket.admin = await Admin.findById(id).select(
            "-contrasena -token -creado"
          );
          break;
        case "lavadero":
          socket.lavadero = await Lavadero.findById(id).select(
            "-contrasena -token -confirmado -creado"
          );
          break;
        default:
          break;
      }

    return next();
    } catch (error) {
      console.error(error);
      next(new Error('Token no válido'));
    }
  } else {
    console.log('No hay token');
    next(new Error('Token no válido o inexistente'));
  }
});

chatSocket(io)
initSockets(io)


// Configuración de variables de entorno
dotenv.config();


conectarMongoDB()
  .then(async () => {
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos", error);
    process.exit(1);
  });


// Middleware

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      // El Origen del Request esta permitido
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors());
app.use(responseTime());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    try {
      JSON.parse(req.body); // Añadir JSON.parse aquí
    } catch (e) {
      console.error(e);
    }
  }
  next();
});

const PORT = process.env.PORT || 4000;

// Rutas

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/admins", adminRouter);
app.use("/api/lavaderos", lavaderoRouter);
app.use("/api/anonimo", anonimoRouter);

module.exports = app;