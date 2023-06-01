const generarJWT = require("../helpers/generarJWT.js");
const generarId = require("../helpers/generarId.js");
const emailRegistro = require("../helpers/usuarios/emailRegistro.js");
const emailOlvidePassword = require("../helpers/usuarios/emailOlvidePassword.js");

const Usuario = require("../models/Usuario.js");
const { VehiculoUsuario } = require("../models/Vehiculos.js");

const registrar = async (req, res) => {
  const { nombre, apellido, genero, fecha_nacimiento, correo_electronico, contrasena, telefono } = req.body;

  let usuario;

  try {

    const existeUsuario = await Usuario.findOne({ correo_electronico });

    if (existeUsuario) {
      const error = new Error("Usuario ya registrado, no puedes crear una cuenta con este correo electrónico");
      return res.status(409).json({ msg: error.message });
    }

    usuario = new Usuario({
      nombre,
      apellido,
      genero,
      fecha_nacimiento,
      correo_electronico,
      contrasena,
      telefono,
    });

    try {
      await usuario.save();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      return res.status(400).json({ msg: "Error al guardar el usuario" });
    }
    // Enviar el email de confirmación y validar si se envió correctamente
    /*  TEMPORALMENTE COMENTADO POR TEST 
        await emailRegistro({
          email: correo_electronico,
          nombre,
          token: usuario.token,
        }); */

    res.status(200).json({ nombre, apellido, correo_electronico, telefono });

  } catch (error) {
    usuario.remove();
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const perfil = async (req, res) => {
  const usuario = req.usuario;
  try {
    res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const confirmar = async (req, res) => {
  // Obtener el token de la URL
  const { token } = req.params;
  try {
    // Comprobar si algun usuario tiene ese token
    const usuarioConfirmar = await Usuario.findOne({ token });

    // Si no existe el usuario
    if (!usuarioConfirmar) {
      const error = new Error("Token no válido");
      return res.status(401).json({ msg: error.message });
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
    if (await usuario.comprobarPassword(contrasena)) {
      // Generar el JWT y devolverlo:
      const token = generarJWT(usuario._id, "usuario");
      // Autenticar
      res.status(200).json({
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        genero: usuario.genero,
        correo_electronico: usuario.correo_electronico,
        telefono: usuario.telefono,
        token,
        rol: "usuario",
      });
    } else {
      const error = new Error("La contraseña es incorrecta");
      return res.status(401).json({ msg: error.message });
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

    console.log("usuario", usuario)

    if (!usuario) {
      const error = new Error("El Usuario no existe");
      return res.status(400).json({ msg: error.message });
    }

    // Generar un nuevo token y actualizarlo en la base de datos
    usuario.token = generarId();
    await usuario.save();

    // Enviar Email con instrucciones
    /*
    TEMPORALMENTE INHABILITADO POR PRUEBAS
        emailOlvidePassword({
          email: correo_electronico,
          nombre: usuario.nombre,
          token: usuario.token,
        }); */

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
      return res.status(401).json({ msg: error.message })
    }

    // Hashear el password
    usuario.token = null;
    usuario.contrasena = contrasena;

    await usuario.save();

    res.status(200).json({ msg: "Password modificado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const actualizarPerfil = async (req, res) => {

  const { nombre, apellido, genero, fecha_nacimiento, correo_electronico, telefono } = req.body;
  const { _id } = req.usuario

  let mensaje = "";

  try {

    if (req.usuario.correo_electronico !== correo_electronico) {
      const existeEmail = await Usuario.findOne({ correo_electronico });

      if (existeEmail) {
        const error = new Error("Ese correo electronico ya esta en uso");
        return res.status(409).json({ msg: error.message });
      }

      mensaje = "Como cambiaste tu correo electronico, debes confirmar la cuenta nuevamente, te hemos enviado al nuevo correo electronico un link de confirmacion";
    }

    // Actualizar el usuario con update
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      _id,
      {
        nombre,
        apellido,
        genero,
        telefono,
        fecha_nacimiento,
      },
      { new: true }
    );


    res.status(200).json({ usuario: usuarioActualizado, msg: mensaje, resultado: 'Haz actualizado tu perfil correctamente' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};


const confirmarCorreoElectronico = async (req, res) => {
  const { token, correo_electronico } = req.params;

  try {
    // Comprobar si el token es válido y si existe un usuario con ese token
    const usuario = await Usuario.findOne({ token });

    if (!usuario) {
      const error = new Error("Token no válido");
      return res.status(401).json({ msg: error.message })
    }

    usuario.token = null;
    usuario.correo_electronico = correo_electronico;

    await usuario.save();

    res.status(200).json({ msg: "Correo electronico confirmado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const agregarVehiculo = async (req, res) => {

  const { placa, marca, modelo, tipo_vehiculo } = req.body;

  let vehiculoGuardado;

  try {

    const vehiculo = new VehiculoUsuario({
      placa,
      marca,
      modelo,
      tipo_vehiculo,
    });

    vehiculoGuardado = await vehiculo.save();

    console.log(vehiculoGuardado);

    const usuarioConVehiculo = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      {
        $push: {
          vehiculos: vehiculoGuardado._id,
        },
      },
      { new: true }
    ).populate("vehiculos");

    res.status(200).json({ usuario: usuarioConVehiculo, msg: "Vehiculo agregado correctamente" });

  } catch (error) {

    if (vehiculoGuardado) {
      await VehiculoUsuario.findByIdAndDelete(vehiculoGuardado._id);
    }
    console.log(error);
    res.status(500).json({ msg: error });
  }

}


const eliminarVehiculo = async (req, res) => {
  const { id_vehiculo } = req.body;
  const usuario = req.usuario;

  try {

    const vehiculo = usuario.vehiculos.find(vehiculo => vehiculo._id.toString() === id_vehiculo);
    if (!vehiculo) {
      return res.status(404).json({ msg: "Vehículo no encontrado" });
    }
  
    usuario.vehiculos.pull(vehiculo);
    await usuario.save();
  
    await VehiculoUsuario.findByIdAndRemove(id_vehiculo);
  
    return res.json({ usuario: usuario, msg: "Vehículo eliminado correctamente" });
  } catch (error) {

    console.log(error);
    res.status(500).json({ error: error, msg: "No se pudo eliminar el vehiculo" });
  }
}

const actualizarPassword = async (req, res) => {
  // Leer los datos
  const { _id } = req.usuario;
  const { pwd_actual, pwd_nuevo } = req.body;

  try {

    // Comprobar usuario por ID
    const UsuarioModificar = await Usuario.findById(_id);

    if (await UsuarioModificar.comprobarPassword(pwd_actual)) {

      // actualizar el usuario con update ya teniendo el usuario
      await Usuario.findByIdAndUpdate(
        _id,
        {
          contrasena: pwd_nuevo,
        },
        { new: true }
      );

      res.status(200).json({ msg: "Contraseña Actualizada Correctamente" });
    } else {
      const error = new Error("La contraseña actual es incorrecta");
      res.status(401).json({ msg: error.message });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
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
  confirmarCorreoElectronico,
  agregarVehiculo,
  eliminarVehiculo
};
