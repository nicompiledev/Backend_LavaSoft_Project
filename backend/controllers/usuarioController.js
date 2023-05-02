const conectarDB = require("../config/mysql.js");
const generarJWT = require("../helpers/generarJWT.js");
const generarId = require("../helpers/generarId.js");
const emailRegistro = require("../helpers/usuarios/emailRegistro.js");
const emailOlvidePassword = require("../helpers/usuarios/emailOlvidePassword.js");
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario.js");

const registrar = async (req, res) => {
  const { nombre, apellido, genero, correo_electronico, contrasena, telefono } = req.body;

  try {

    const existeUsuario = await Usuario.findOne({ correo_electronico });

    if (existeUsuario) {
      const error = new Error("Usuario ya registrado");
      return res.status(400).json({ msg: error.message });
    }

    const usuario = new Usuario({
      nombre,
      apellido,
      genero,
      correo_electronico,
      contrasena,
      telefono,
    });

    const usuarioGuardado = await usuario.save();

    if(!usuarioGuardado) {
      const error = new Error("Error al guardar el usuario");
      return res.status(400).json({ msg: error.message });
    }

    // Enviar el email
    emailRegistro({
      email: correo_electronico,
      nombre,
      token: usuario.token,
    });

    res.json({ nombre, apellido, correo_electronico, telefono });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const perfil = async (req, res) => {
  const usuario = req.usuario;
  try {
    res.status(200).json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

/*  const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
  },
  genero: {
    type: String,
    enum: ["Masculino", "Femenino"],
    required: true,
    trim: true,
  },
  correo_electronico: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  contrasena: {
    type: String,
    required: true,
    trim: true,
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    default: generarId(), // Se usa un helper para generar un ID aleatorio por defecto
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
}) */


const confirmar = async (req, res) => {
  // Obtener el token de la URL
  const { token } = req.params;
  try {
    // Comprobar si algun usuario tiene ese token
    const usuarioConfirmar = await Usuario.findOne({ token });

    // Si no existe el usuario
    if (!usuarioConfirmar) {
      const error = new Error("Token no válido");
      return res.status(404).json({ msg: error.message });
    }

    // Si existe el usuario, modifico el usuario confirmarlo y borrar el token
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = null;

    await usuarioConfirmar.save();

    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

const autenticar = async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  try {
    // Comprobar si el correo existe
    const usuario = await Usuario.findOne({ correo_electronico });

    if (!usuario) {
      const error = new Error("El correo no existe");
      return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el usuario está confirmado
    if (!usuario.confirmado) {
      const error = new Error("Tu Cuenta no ha sido confirmada, por favor verifica tu email");
      return res.status(403).json({ msg: error.message });
    }

    // Revisar el password
    if (await usuario.compararPassword(contrasena)) {
      // Generar el JWT y devolverlo:
      const token = generarJWT(usuario._id);
      // Autenticar
      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        genero: usuario.genero,
        correo_electronico: usuario.correo_electronico,
        telefono: usuario.telefono,
        token,
      });
    } else {
      const error = new Error("La contraseña es incorrecta");
      return res.status(403).json({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const olvidePassword = async (req, res) => {
  const { correo_electronico } = req.body;

  try {
    // Ejecutar una consulta para obtener el usuario con el correo_electronico proporcionado
    const usuario = await Usuario.findOne({ correo_electronico });

    if (usuario) {
      const error = new Error("El Usuario no existe");
      return res.status(400).json({ msg: error.message });
    }

    // Generar un nuevo token y actualizarlo en la base de datos
    usuario.token = generarId();
    await usuario.save();

    // Enviar Email con instrucciones
    emailOlvidePassword({
      email: correo_electronico,
      nombre: usuario.nombre,
      token,
    });

    res.json({ msg: "Hemos enviado un correo_electronico con las instrucciones" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { contrasena } = req.body;

  try {
    // Comprobar si el token es válido y si existe un usuario con ese token
    const usuario = await Usuario.findOne({ token });

    if (!usuario) {
      const error = new Error("Token no válido");
      return res.status(400).json({ msg: error.message })
    }

    // Hashear el password
    usuario.token = null;
    usuario.contrasena = contrasena;

    res.json({ message: "Password modificado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-contrasena");

    if (!usuario) {
      const error = new Error("Hubo un error");
      return res.status(400).json({ msg: error.message });
    }

    const { correo_electronico } = req.body;

    if (usuario.correo_electronico !== req.body.correo_electronico) {
      const [rows] = await conexion.execute(
        "SELECT * FROM usuarios WHERE correo_electronico = ?",
        [correo_electronico]
      );

      const existeEmail = rows[0];
      if (existeEmail) {
        const error = new Error("Ese correo_electronico ya esta en uso");
        return res.status(400).json({ msg: error.message });
      }
    }

    // contraseña
    if (req.body.contrasena) {
      const salt = await bcrypt.genSalt(10);
      const contrasenaHash = await bcrypt.hash(req.body.contrasena, salt);
      req.body.contrasena = contrasenaHash;
    }

    await conexion.execute(
      "UPDATE usuarios SET nombre = ?, apellido = ?, correo_electronico = ?, telefono = ? WHERE id_usuario = ?",
      [req.body.nombre, req.body.apellido, req.body.correo_electronico, req.body.telefono, req.params.id_usuario]
    );

    const usuarioActualizado = {
      id_usuario: req.params.id_usuario,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      correo_electronico: req.body.correo_electronico,
      telefono: req.body.telefono,
    };

    res.json(usuarioActualizado);

  } catch (error) {
    console.log(error);
  } finally {
    if (conexion) {
      try {
        await conexion.close();
      } catch (error) {
        console.log('Error al cerrar la conexión:', error);
      }
    }
  }
};


const actualizarPassword = async (req, res) => {
  // Leer los datos
  const { id_usuario } = req.usuario;
  const { pwd_actual, pwd_nuevo } = req.body;


  let conexion;

  try {
    // Conectar a la base de datos
    const conexion = await conectarDB();

    // Comprobar que el usuario existe
    const [rows] = await conexion.execute(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id_usuario]
    );

    if (rows.length === 0) {
      const error = new Error("Hubo un error");
      return res.status(400).json({ msg: error.message });
    }

    // Comprobar su password
    const usuario = rows[0];
    if (pwd_actual === usuario.contrasena) {
      // Almacenar el nuevo password
      await conexion.execute(
        "UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?",
        [pwd_nuevo, id_usuario]
      );
      res.json({ msg: "Password Almacenado Correctamente" });
    } else {
      const error = new Error("El Password Actual es Incorrecto");
      return res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    console.log(`error: ${error.message}`);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  } finally {
    if (conexion) {
      try {
        await conexion.close();
      } catch (error) {
        console.log('Error al cerrar la conexión:', error);
      }
    }
  }
};

module.exports = {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};
