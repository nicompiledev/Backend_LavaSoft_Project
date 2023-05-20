const request = require('supertest');
const app = require('../index.js');
const { publisher, subscriber } = require('../config/redis.js');
const generarJWT = require("../helpers/generarJWT.js");
const checkAuth = require("../middleware/authMiddleware.js");
const mongoose = require('mongoose');

// Models
const Usuario = require('../models/Usuario.js');
const Lavadero = require('../models/lavadero.js');
const { Reserva } = require('../models/Reserva.js');
const { Servicio } = require('../models/Servicio.js');


afterAll(async () => {
  await publisher.quit();
  await subscriber.quit();
  await mongoose.connection.close();
});


const generarNuevoUsuario = () => {
  return {
    nombre: 'Juan',
    apellido: 'Perez',
    genero: 'Masculino',
    fecha_nacimiento: '1990-01-01',
    correo_electronico: 'slash2130kevin@gmail.com',
    contrasena: 'contrasena123',
    telefono: '1234567890'
  };
};
const generarNuevoLavadero = (id_servicio = null) => {
  return {
    nombre: 'Lavadero 1',
    ciudad: 'Bogota',
    direccion: 'Calle 1 # 1 - 1',
    telefono: '1234567890',
    correo_electronico: 'slash2130kevin@gmail.com',
    contrasena: 'contrasena123',
    hora_apertura: '08:00',
    hora_cierre: '18:00',
    imagenes: ['https://res.cloudinary.com/djx5h4cjt/image/upload/v1629789853/IMAGENES_LAVADEROS/1_1_1.png'],
    espacios_de_trabajo: 5,
    ubicacion: {
      type: 'Point',
      coordinates: [-74.08175, 4.60971]
    },
    servicios: id_servicio ? [id_servicio] : []
  };
};


const generarNuevaReserva = (id_lavadero, id_usuario, id_servicio) => {
  return {
    id_lavadero: id_lavadero,
    id_usuario: id_usuario,
    id_servicio: id_servicio,
    fecha: '2021-08-25',
    hora_inicio: '08:00',
    hora_fin: '09:00',
    espacio_de_trabajo: 4,
  };
};

const generarNuevoServicio = () => {
  return {
    nombre: 'Lavado de carro',
    detalle: 'Lavado de carro',
    costo: 10000,
    duracion: 60
  };
};



//* ----------------------------------------------------------------------------------------------------------------------- *//
//* ----------------------------------------------------------------------------------------------------------------------- *//
//* ----------------------------------------------------------------------------------------------------------------------- *//
//* ------------------------------------------- USUARIO ------------------------------------------------------------------ *//

describe('Registro de usuario', () => {
  beforeEach(async () => {
    await Usuario.deleteMany({});
  });

  test('Cuando registra un usuario correctamente', async () => {
    const nuevoUsuario = generarNuevoUsuario();

    const response = await request(app)
      .post('/api/usuarios')
      .send(nuevoUsuario);

    expect(response.statusCode).toBe(200);  // Explicacion: statusCode es el codigo de respuesta que nos da el servidor, en este caso 200 es que todo esta bien
    expect(response.body).toEqual({  // Explicacion: body es el cuerpo de la respuesta que nos da el servidor, en este caso es un objeto con los datos del usuario
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      correo_electronico: nuevoUsuario.correo_electronico,
      telefono: nuevoUsuario.telefono
    });

    const usuarioEnBaseDeDatos = await Usuario.findOne({ correo_electronico: nuevoUsuario.correo_electronico });  // Esto es para verificar que el usuario se guardo en la base de datos
    expect(usuarioEnBaseDeDatos).toBeTruthy();  // Explicacion: toBeTruthy() es una funcion que verifica que el valor que le pasemos sea verdadero, en este caso si el usuario existe en la base de datos
  });

  test('Cuando el correo ya existe', async () => {
    const nuevoUsuario = generarNuevoUsuario();

    await Usuario.create(nuevoUsuario);

    const response = await request(app)
      .post('/api/usuarios')
      .send(nuevoUsuario);

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({ msg: 'Usuario ya registrado, no puedes crear una cuenta con este correo electrónico' });

    const usuariosEnBaseDeDatos = await Usuario.find({ correo_electronico: nuevoUsuario.correo_electronico });
    expect(usuariosEnBaseDeDatos.length).toBe(1);
  });

  test('Cuando hay un error al guardar un usuario', async () => {

    const nuevoUsuario = {
      nombre: 'Juan',
      apellido: 'Perez',
      genero: 'Masculino',
      fecha_nacimiento: '1990-01-01',
      correo_electronico: 'asdfasd',
      contrasena: '',
    };

    const response = await request(app)
      .post('/api/usuarios')
      .send(nuevoUsuario);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ msg: 'Error al guardar el usuario' });

    const usuariosEnBaseDeDatos = await Usuario.find({ correo_electronico: nuevoUsuario.correo_electronico });
    expect(usuariosEnBaseDeDatos.length).toBe(0);

  });

});

describe('Inicio de sesion', () => {
  beforeEach(async () => {
    await Usuario.deleteMany({});
  });

  test('Cuando inicia sesion correctamente', async () => {
    const usuario = generarNuevoUsuario();

    const nuevoUsuario = await Usuario.create(usuario);

    await nuevoUsuario.updateOne({ confirmado: true });

    // Desde el body de la peticion se envia el correo y la contrasena
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        correo_electronico: 'slash2130kevin@gmail.com',
        contrasena: 'contrasena123',
      });

    expect(response.statusCode).toBe(200);

  });

  test('Cuando el correo no existe', async () => {
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        correo_electronico: 'slash2130kevin@gmail.com',
        contrasena: 'contrasena123',
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ msg: 'El correo no existe' });
  });

  test('Cuando el usuario no ha confirmado su correo', async () => {

    const nuevoUsuario = generarNuevoUsuario();

    await Usuario.create(nuevoUsuario);

    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        correo_electronico: 'slash2130kevin@gmail.com',
        contrasena: 'contrasena123',
      });

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({ msg: 'Tu Cuenta no ha sido confirmada, por favor verifica tu email' });

  });

  test('Cuando la contrasena es incorrecta', async () => {
    const usuario = generarNuevoUsuario();

    const nuevoUsuario = await Usuario.create(usuario);

    await nuevoUsuario.updateOne({ confirmado: true });

    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        correo_electronico: 'slash2130kevin@gmail.com',
        contrasena: 'contrasena1234',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ msg: 'La contraseña es incorrecta' });
  });
});

describe('Confirmacion de correo', () => {
  beforeEach(async () => {
    await Usuario.deleteMany({});
  });

  test('Cuando el token es valido', async () => {
    const usuario = generarNuevoUsuario();

    const nuevoUsuario = await Usuario.create(usuario);

    const response = await request(app)
      .get(`/api/usuarios/confirmar/${nuevoUsuario.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ msg: 'Usuario Confirmado Correctamente' });
  });

  test('Cuando el token no es valido', async () => {
    const response = await request(app)
      .get(`/api/usuarios/confirmar/123`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ msg: 'Token no válido' });
  });
});

describe('Middleware de autenticación', () => {
  let usuario;
  let token;

  beforeEach(async () => {
    await Usuario.deleteMany({});
    usuario = generarNuevoUsuario();
    const nuevoUsuario = await Usuario.create(usuario);
    await nuevoUsuario.updateOne({ confirmado: true });
    token = generarJWT(nuevoUsuario._id);
  });

  test('Cuando el token es valido', async () => {
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await checkAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('Cuando el token no es valido', async () => {
    const req = {
      headers: {
        authorization: `Bearer 123`,
      },
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await checkAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Token no Válido' });

  });

  test('Cuando el token no existe', async () => {
    const req = {
      headers: {},
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await checkAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Token no Válido o inexistente' });

  });
});

describe('Middleware de autenticación', () => {
  let usuario;
  let token;

  beforeEach(async () => {
    await Usuario.deleteMany({});
    usuario = generarNuevoUsuario();
    const nuevoUsuario = await Usuario.create(usuario);
    await nuevoUsuario.updateOne({ confirmado: true });
    token = generarJWT(nuevoUsuario._id);
  });

  test('Cuando el token es válido', async () => {
    const response = await request(app)
      .get('/api/usuarios/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('usuario');
  });
});

describe('Olvide Password', () => {
  let usuario;

  beforeEach(async () => {
    await Usuario.deleteMany({});
    usuario = generarNuevoUsuario();
    await Usuario.create(usuario);
  });

  test('Cuando el usuario existe', async () => {
    const response = await request(app)
      .post('/api/usuarios/olvide-password')
      .send({ correo_electronico: usuario.correo_electronico });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ msg: 'Hemos enviado un correo_electronico con las instrucciones' });
  });

  test('Cuando el usuario no existe', async () => {
    const response = await request(app)
      .post('/api/usuarios/olvide-password')
      .send({ correo_electronico: 'salpdpasdpl@gmail.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ msg: 'El Usuario no existe' });
  });
});

describe('Nuevo Password', () => {
  let usuario;
  let token;

  beforeEach(async () => {
    await Usuario.deleteMany({});
    usuario = generarNuevoUsuario();
    const nuevoUsuario = await Usuario.create(usuario);
    token = generarJWT(nuevoUsuario._id);
    nuevoUsuario.token = token;
    await nuevoUsuario.save();
  });

  test('Cuando el token es válido', async () => {
    const response = await request(app)
      .post(`/api/usuarios/nuevo-password/${token}`)
      .send({ contrasena: '123456789' })

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Password modificado correctamente' });
  });

  test('Cuando el token no es válido', async () => {
    const response = await request(app)
      .post(`/api/usuarios/nuevo-password/123`)
      .send({ contrasena: '123456789' })

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ msg: 'Token no válido' });
  });
});

describe('Actualizar Perfil', () => {
  let token;
  let nuevoUsuario;
  beforeEach(async () => {
    await Usuario.deleteMany({});
    const usuario = generarNuevoUsuario();
    nuevoUsuario = await Usuario.create(usuario);
    token = generarJWT(nuevoUsuario._id);
  });

  test('Cuando el perfil se actualiza correctamente', async () => {
    const response = await request(app)
      .put(`/api/usuarios/actualizar_perfil`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Juan',
        apellido: 'Perez',
        genero: 'Masculino',
        correo_electronico: 'slash2130kevin@gmail.com',
        telefono: '1234567890'
      });

    expect(response.statusCode).toBe(200);
  });

  test('Cuando el correo_electronico ya esta en uso', async () => {

    const usuario = {
      nombre: 'Kevin',
      apellido: 'Perez',
      genero: 'Masculino',
      fecha_nacimiento: '1990-01-01',
      correo_electronico: 'kevin@gmail.com',
      contrasena: 'contrasena123',
      telefono: '1234567890'
    }
    await Usuario.create(usuario);

    const response = await request(app)
      .put(`/api/usuarios/actualizar_perfil`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Juan',
        apellido: 'Perez',
        genero: 'Masculino',
        correo_electronico: 'kevin@gmail.com',
        telefono: '1234567890'
      });

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({ msg: 'Ese correo electronico ya esta en uso' });
  });
});

describe('Actualizar Password', () => {
  let token;
  let nuevoUsuario;
  beforeEach(async () => {
    await Usuario.deleteMany({});
    const usuario = generarNuevoUsuario();
    nuevoUsuario = await Usuario.create(usuario);
    token = generarJWT(nuevoUsuario._id);
  });

  test('Cuando el password se actualiza correctamente', async () => {
    const response = await request(app)
      .put(`/api/usuarios/actualizar-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        pwd_actual: 'contrasena123',
        pwd_nuevo: '123456789'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ msg: 'Contraseña Actualizada Correctamente' });
  });

  test('Cuando el password actual es incorrecto', async () => {
    const response = await request(app)
      .put(`/api/usuarios/actualizar-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        pwd_actual: 'CONTRASEÑAINCORRECTA',
        pwd_nuevo: '123456789'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ msg: 'La contraseña actual es incorrecta' });
  });
});

//*********************************************************************************************************************
//********************************************* LAVADEROS *************************************************************
//*********************************************************************************************************************

describe('Loguear Lavadero', () => {
  beforeEach(async () => {
    await Lavadero.deleteMany({});
  });

  test('Cuando loguea correctamente', async () => {
    const lavadero = generarNuevoLavadero();
    const LavaderoGuardado = await Lavadero.create(lavadero);
    LavaderoGuardado.confirmado = true;
    await LavaderoGuardado.save();

    const response = await request(app)
      .post('/api/lavaderos/login')
      .send({
        correo_electronico: lavadero.correo_electronico,
        contrasena: lavadero.contrasena
      });

    expect(response.statusCode).toBe(200);
  });
});

describe('Obtener Reservas No Atendidas', () => {
  let token;
  let nuevoLavadero;
  beforeEach(async () => {
    await Reserva.deleteMany({});
    await Lavadero.deleteMany({});

    const lavadero = generarNuevoLavadero();
    nuevoLavadero = await Lavadero.create(lavadero);
    token = generarJWT(nuevoLavadero._id);
  });

  test('Cuando se obtienen las reservas no atendidas correctamente', async () => {

    const reserva = generarNuevaReserva(nuevoLavadero._id, '1', '1');
    await Reserva.create(reserva);

    const response = await request(app)
      .get(`/api/lavaderos/reservas`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  test('Cuando no hay reservas pendientes', async () => {

    await Reserva.deleteMany({});

    const response = await request(app)
      .get(`/api/lavaderos/reservas`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});

describe('Cancelar Reserva', () => {
  let token;
  let nuevoLavadero;
  let nuevoServicio;
  let nuevoUsuario;
  let nuevaReserva;
  beforeEach(async () => {
    await Reserva.deleteMany({});
    await Lavadero.deleteMany({});
    await Usuario.deleteMany({});
    await Servicio.deleteMany({});

    const servicio = generarNuevoServicio();
    nuevoServicio = await Servicio.create(servicio);

    const lavadero = generarNuevoLavadero(nuevoServicio._id);
    nuevoLavadero = await Lavadero.create(lavadero);
    token = generarJWT(nuevoLavadero._id);

    const usuario = generarNuevoUsuario();
    nuevoUsuario = await Usuario.create(usuario);

    const reserva = generarNuevaReserva(nuevoLavadero._id, nuevoUsuario._id, '1');
    nuevaReserva = await Reserva.create(reserva);
  });

  test('Cuando se cancela la reserva correctamente', async () => {

    const response = await request(app)
      .delete(`/api/lavaderos/reservas`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_reserve: nuevaReserva._id,
        id_servicio: nuevoServicio._id,
        id_usuario: nuevoUsuario._id,
        motivo: "No tengo tiempo"
      });

    expect(response.statusCode).toBe(200);
  });

  test('Cuando algun dato no exista', async () => {

    const response = await request(app)
      .delete(`/api/lavaderos/reservas`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_reserve: "615165",
        id_servicio: nuevoServicio._id,
        id_usuario: nuevoUsuario._id,
        motivo: "No tengo tiempo"
      });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ msg: 'La reserva o el usuario no existe' });
  });
});

describe('Servicio Terminado', () => {
  let token;
  let nuevoLavadero;
  let nuevoServicio;
  let nuevoUsuario;
  let nuevaReserva;
  beforeEach(async () => {
    await Reserva.deleteMany({});
    await Lavadero.deleteMany({});
    await Usuario.deleteMany({});
    await Servicio.deleteMany({});

    const servicio = generarNuevoServicio();
    nuevoServicio = await Servicio.create(servicio);

    const lavadero = generarNuevoLavadero(nuevoServicio._id);
    nuevoLavadero = await Lavadero.create(lavadero);
    token = generarJWT(nuevoLavadero._id);

    const usuario = generarNuevoUsuario();
    nuevoUsuario = await Usuario.create(usuario);

    const reserva = generarNuevaReserva(nuevoLavadero._id, nuevoUsuario._id, '1');
    nuevaReserva = await Reserva.create(reserva);
  });

  test('Cuando se termina el servicio correctamente', async () => {

    const response = await request(app)
      .put(`/api/lavaderos/reservas`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_reserve: nuevaReserva._id,
        id_usuario: nuevoUsuario._id,
      });

    expect(response.statusCode).toBe(200);
  });

  test('Cuando algun dato no exista', async () => {

    const response = await request(app)
      .put(`/api/lavaderos/reservas`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_reserve: "615165",
        id_usuario: nuevoUsuario._id,
      });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ msg: 'La reserva o el usuario no existe' });
  });
});


//* ----------------------------------------------------------------------------------------------------------------------- *//
//* ----------------------------------------------------------------------------------------------------------------------- *//
//* ----------------------------------------------------------------------------------------------------------------------- *//
//* ------------------------------------------- ANONIMO ------------------------------------------------------------------ *//

describe('Obtener Lavaderos', () => {
  // req.query.page;
  beforeEach(async () => {
    await Lavadero.deleteMany({});

    // Crear 11 lavaderos
    for (let i = 1; i <= 11; i++) {
      const lavadero = {
        nombre: "Lavadero " + i,
        ciudad: "Bogotá",
        direccion: "Calle " + i,
        telefono: "123456789" + i,
        correo_electronico: "lavadero" + i + "@gmail.com",
        contrasena: "123456789" + i,
        hora_apertura: "08:00",
        hora_cierre: "18:00",
        imagenes: ['https://res.cloudinary.com/djx5h4cjt/image/upload/v1629789853/IMAGENES_LAVADEROS/1_1_1.png'],
        espacios_de_trabajo: 5,
        ubicacion: {
          type: 'Point',
          coordinates: [-74.08175, 4.60971]
        },
        servicios: []
      };
      let result = await Lavadero.create(lavadero);
      result.confirmado = true;
      await result.save();
    }
  });

  test('Cuando se obtienen los lavaderos correctamente', async () => {
      // Buscar los 10 primeros lavaderos de la pagina 1 req.query.page = 1
      const response = await request(app)
        .get(`/api/anonimo/lavaderos?page=${1}`)

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(10);

      // Buscar los 10 primeros lavaderos de la pagina 2 req.query.page = 2
      const response2 = await request(app)
        .get(`/api/anonimo/lavaderos?page=${2}`)

      expect(response2.statusCode).toBe(200);
      expect(response2.body.length).toBe(1);
  });
});

describe('Obtener Lavadero por ID', () => {
  let nuevoLavadero;
  beforeEach(async () => {
    await Lavadero.deleteMany({});

    const lavadero = generarNuevoLavadero();
    nuevoLavadero = await Lavadero.create(lavadero);
    nuevoLavadero.confirmado = true;
    await nuevoLavadero.save();
  });

  test('Cuando se obtiene el lavadero correctamente', async () => {
    const response = await request(app)
      .get(`/api/anonimo/lavadero/${nuevoLavadero._id}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.nombre).toBe(nuevoLavadero.nombre);
  });

  test('Cuando el lavadero no existe', async () => {
    const response = await request(app)
      .get(`/api/anonimo/lavadero/615165`)

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ msg: 'No existe el lavadero' });
  });
});

//*********************************************************************************************************************
//*********************************************************************************************************************
//********************************************* ADMINISTRADOR *************************************************************
//*********************************************************************************************************************
//*********************************************************************************************************************
// PENDIENTE YA QUE ESTÁ EN MYSQL Y ESTÁ PENDIENTE SI SE DEJARÁ AHI.

/* const getLavederos = async (req, res) => {
  try {
    const lavaderos = await lavadero.find({ estado: true });
    res.status(200).json({
      nombre: lavaderos.nombre,
      ciudad: lavaderos.ciudad,
      direccion: lavaderos.direccion,
      telefono: lavaderos.telefono,
      correo_electronico: lavaderos.correo_electronico,
      hora_apertura: lavaderos.hora_apertura,
      hora_cierre: lavaderos.hora_cierre,
      espacio_de_trabajo: lavaderos.espacio_de_trabajo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};
RUTA: router.get("/lavaderos", checkAuthAdmin, getLavederos);
*/



