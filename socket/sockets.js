const { Reserva } = require('../models/Reserva.js');
const Lavadero = require('../models/lavadero.js');
const { Servicio } = require('../models/Servicio.js');
const Usuario = require('../models/Usuario.js');
const moment = require('moment');
const jwt = require('jsonwebtoken');

module.exports = function (io) {
  io.use(async (socket, next) => {
    if (socket.handshake.headers && socket.handshake.headers.authorization) {
      const token = socket.handshake.headers.authorization.split(' ')[1];
      // Verificar el token aquí
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id) {
          throw new Error('Token no válido');
        }
        socket.decoded = decoded.id;
        next();
      } catch (error) {
        next(new Error('Token no válido'));
      }
    } else {
      next(new Error('Token no válido o inexistente'));
    }
  });

  io.on("connection", async (socket) => {
    socket.on("reservar", async (reservaData) => {
      try {
        const id_usuario = socket.decoded;

        await validarLavadero(reservaData.id_lavadero);
        await validarServicio(reservaData.id_servicio);
        await validarUsuario(id_usuario);

        const { hora_agendada, fecha } = reservaData;

        const hora_agendada_moment = moment(hora_agendada, "h:mm A");
        const servicio = await Servicio.findById(reservaData.id_servicio);
        const hora_fin = hora_agendada_moment.clone().add(servicio.duracion, "minutes");

        await verificarDisponibilidad(reservaData.id_lavadero, fecha, hora_agendada_moment, hora_fin);

        const reserva = new Reserva({
          id_lavadero: reservaData.id_lavadero,
          id_usuario,
          id_servicio: reservaData.id_servicio,
          fecha,
          hora_inicio: hora_agendada_moment.format("h:mm A"),
          hora_fin: hora_fin.format("h:mm A"),
        });

        const reservaGuardada = await reserva.save();
        if (!reservaGuardada) {
          throw new Error("Error al guardar la reserva");
        } else {
          const horasLibres = await horasDisponibles(
            reservaData.id_lavadero,
            fecha,
            reservaData.id_servicio
          );
          socket.nsp.emit("horasLibres", horasLibres);
        }
      } catch (error) {
        return socket.emit("reservaCreada", { error: error.message });
      }
    });

    socket.on("horasDisponibles", async (datos) => {
      const { id_lavadero, fecha, id_servicio } = datos;
      const horasLibres = await horasDisponibles(id_lavadero, fecha, id_servicio);
      socket.emit("horasLibres", horasLibres);
    });
  });
};

const validarLavadero = async (id_lavadero) => {
  const lavadero = await Lavadero.findById(id_lavadero);
  if (!lavadero) {
    throw new Error("El lavadero no existe");
  }
};

const validarServicio = async (id_servicio) => {
  const servicio = await Servicio.findById(id_servicio);
  if (!servicio) {
    throw new Error("El servicio no existe");
  }
};

const validarUsuario = async (id_usuario) => {
  const usuario = await Usuario.findById(id_usuario);
  if (!usuario) {
    throw new Error("El usuario no existe");
  }
};

const verificarDisponibilidad = async (id_lavadero, fecha, hora_inicio, hora_fin) => {
  const reservas = await Reserva.find({
    id_lavadero,
    fecha,
    estado: { $ne: "cancelado" }, // Excluir reservas canceladas
  });

  const lavadero = await Lavadero.findById(id_lavadero);
  const hora_apertura = moment(lavadero.hora_apertura, "h:mm A");
  const hora_cierre = moment(lavadero.hora_cierre, "h:mm A");

  if (
    hora_inicio.isBefore(hora_apertura) ||
    hora_fin.isAfter(hora_cierre)
  ) {
    throw new Error("El lavadero no está abierto");
  }

  if (reservas.length >= lavadero.espacios_de_trabajo) {
    throw new Error("El lavadero no tiene espacios de trabajo disponibles");
  }

  for (let reserva of reservas) {
    let reservaInicio = moment(reserva.hora_inicio, 'h:mm A');
    let reservaFin = moment(reserva.hora_fin, 'h:mm A');

    if (
      (hora_inicio.isBetween(reservaInicio, reservaFin) || hora_fin.isBetween(reservaInicio, reservaFin))
    ) {
      throw new Error("Horario superpuesto con otra reserva");
    }
  }
};

const horasDisponibles = async (id_lavadero, fecha, id_servicio) => {
  const lavadero = await Lavadero.findById(id_lavadero);
  const horaApertura = moment(lavadero.hora_apertura, 'h:mm A');
  const horaCierre = moment(lavadero.hora_cierre, 'h:mm A');
  const servicio = await Servicio.findById(id_servicio);
  const duracionServicio = servicio.duracion;
  const intervalo = Math.ceil(duracionServicio / 15) * 15;
  const reservas = await Reserva.find({ id_lavadero, fecha });
  let horasDisponibles = [];
  let horaActual = horaApertura.clone();

  while (horaActual.isBefore(horaCierre)) {
    let horaFin = horaActual.clone().add(duracionServicio, 'minutes');
    let disponible = true;

    for (let reserva of reservas) {
      let reservaInicio = moment(reserva.hora_inicio, 'h:mm A');
      let reservaFin = moment(reserva.hora_fin, 'h:mm A');

      if (
        (horaActual.isBetween(reservaInicio, reservaFin) || horaFin.isBetween(reservaInicio, reservaFin)) &&
        reserva.estado !== 'cancelado'
      ) {
        disponible = false;
        break;
      }
    }

    if (disponible) {
      let espaciosOcupados = reservas.filter(reserva => {
        let reservaInicio = moment(reserva.hora_inicio, 'h:mm A');
        let reservaFin = moment(reserva.hora_fin, 'h:mm A');

        return (
          (horaActual.isBetween(reservaInicio, reservaFin) || horaFin.isBetween(reservaInicio, reservaFin)) &&
          reserva.estado !== 'cancelado'
        );
      }).length;

      if (espaciosOcupados >= lavadero.espacios_de_trabajo) {
        disponible = false;
      }
    }

    if (disponible) {
      horasDisponibles.push(horaActual.format('h:mm A'));
    }

    horaActual.add(intervalo, 'minutes');
  }

  return horasDisponibles;
};