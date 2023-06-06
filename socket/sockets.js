const { Reserva } = require('../models/Reserva.js');
const Lavadero = require('../models/type_users/lavadero.js');
const { Servicio } = require('../models/Servicio.js');
const moment = require('moment');

module.exports = (io) => {
  io.on("connection", async (socket) => {
    socket.on("reservar", async (reservaData) => {
      const usuario = socket.usuario;
      const { fecha, hora_agendada, id_lavadero, id_servicio } = reservaData;

      // Obtener información del lavadero y del servicio
      const lavadero = await Lavadero.findById(id_lavadero);
      const servicio = await Servicio.findById(id_servicio);

      // Obtener reservas existentes para el lavadero y la fecha seleccionada
      const reservas = await Reserva.find({
        id_lavadero: id_lavadero,
        fecha: fecha,
        estado: { $ne: 'cancelado' }
      });

      // Asignar un espacio de trabajo disponible
      let espacioDisponible = 1;
      while (espacioDisponible <= lavadero.espacios_de_trabajo) {
        let reservasEspacio = reservas.filter(r => r.espacio_de_trabajo === espacioDisponible && r.hora_inicio === hora_agendada);
        if (reservasEspacio.length === 0) {
          break;
        }
        espacioDisponible++;
      }

      if (espacioDisponible > lavadero.espacios_de_trabajo) {
        // No hay espacios disponibles
        return;
      }

      // Crear nueva reserva
      const nuevaReserva = new Reserva({
        id_lavadero: id_lavadero,
        id_usuario: usuario._id,
        id_servicio: id_servicio,
        fecha: fecha,
        hora_inicio: hora_agendada,
        hora_fin: moment(hora_agendada, 'h:mm A').add(servicio.duracion / 60, 'hours').format('h:mm A'),
        espacio_de_trabajo: espacioDisponible
      });

      await nuevaReserva.save();
    });

    socket.on("horasDisponibles", async (datos) => {
      const { id_lavadero, fecha, id_servicio } = datos;
      const horasLibres = await horasDisponibles(id_lavadero, fecha, id_servicio);
      socket.emit("horasLibres", horasLibres);
    });
  });
};

const horasDisponibles = async (id_lavadero, fecha, id_servicio) => {
  // Obtener información del lavadero y del servicio
  const lavadero = await Lavadero.findById(id_lavadero);
  const servicio = await Servicio.findById(id_servicio);

  // Obtener reservas existentes para el lavadero y la fecha seleccionada
  const reservas = await Reserva.find({
    id_lavadero: id_lavadero,
    fecha: fecha,
    estado: { $ne: 'cancelado' }
  });

  // Crear un arreglo con todas las horas disponibles
  let horaInicio = moment(lavadero.hora_apertura, 'h:mm A');
  let horaCierre = moment(lavadero.hora_cierre, 'h:mm A');
  let duracionServicio = servicio.duracion;
  let intervalo = duracionServicio / 60;
  let horasDisponibles = [];

  while (horaInicio.isBefore(horaCierre)) {
    horasDisponibles.push(horaInicio.format('h:mm A'));
    horaInicio.add(intervalo, 'hours');
  }

  // Excluir horas ocupadas
  reservas.forEach(reserva => {
    let horaReservaInicio = moment(reserva.hora_inicio, 'h:mm A');
    let horaReservaFin = moment(reserva.hora_fin, 'h:mm A');
    horasDisponibles = horasDisponibles.filter(hora => {
      let horaDisponible = moment(hora, 'h:mm A');
      return !horaDisponible.isBetween(horaReservaInicio, horaReservaFin);
    });
  });

  return horasDisponibles;
}