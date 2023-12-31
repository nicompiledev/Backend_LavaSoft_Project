const { Reserva } = require('../models/Reserva.js');
const Lavadero = require('../models/type_users/Lavadero.js');
const { Servicio } = require('../models/Servicio.js');
const moment = require('moment-timezone');
moment.tz.setDefault("America/Bogota");


module.exports = (io) => {
  io.on("connection", async (socket) => {
    socket.on("reservar", async (reservaData) => {
      const usuario = socket.usuario;
      const { fecha, hora_agendada, id_lavadero, id_servicios, vehiculo } = reservaData;

      try {
        // Obtener información del lavadero
        const lavadero = await Lavadero.findById(id_lavadero);

        // si el usuario tiene una reserva pendiente en el lavadero, no puede hacer otra
        const reservaPendiente = await Reserva.findOne({
          id_vehiculo: vehiculo._id,
          id_lavadero: id_lavadero,
          estado: 'pendiente',
          fecha: { $gte: moment().format('YYYY-MM-DD') }
        });

        if (reservaPendiente) {
          socket.emit("reservaCreada", { "mensaje": "Ya tienes una reserva pendiente con ese vehículo en este lavadero" });
          return
        }

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

        const servicios = await Servicio.find({ _id: { $in: id_servicios } });

        // Calcular duración total y costo total
        let duracionTotal = 0;
        let costoTotal = 0;
        for (const servicio of servicios) {
          duracionTotal += servicio.duracion;
          costoTotal += servicio.costo;
        }

        // Crear nueva reserva
        const nuevaReserva = new Reserva({
          id_lavadero: id_lavadero,
          id_usuario: usuario._id,
          id_vehiculo: vehiculo._id,
          placa_vehiculo: vehiculo.placa,
          tipo_vehiculo: vehiculo.tipo_vehiculo,
          nombre_servicio: servicios.map(servicio => servicio.nombre).join(", "),
          nombre_usuario: usuario.nombre,
          fecha: fecha,
          costoTotal: costoTotal || 0,
          hora_inicio: hora_agendada,
          hora_fin: moment(hora_agendada, 'h:mm A').add(duracionTotal / 60, 'hours').format('h:mm A'),
          espacio_de_trabajo: espacioDisponible,
          estado: 'pendiente'
        });

        nuevaReserva.save();

        const horasLibres = await horasDisponibles(id_lavadero, fecha, id_servicios);
        io.emit("horasLibres", horasLibres);

      } catch (error) {
        console.log(error);

        socket.emit("reservaCreada", { "mensaje": "Error al crear la reserva", "tipo": "error" });
        return
      }
      socket.emit("reservaCreada", { "mensaje": "Reserva creada exitosamente", "tipo": "success" });
    });

    socket.on("horasDisponibles", async (datos) => {
      const { id_lavadero, fecha, id_servicios } = datos;

      const horasLibres = await horasDisponibles(id_lavadero, fecha, id_servicios);
      socket.emit("horasLibres", horasLibres);
    });
  });
};

const horasDisponibles = async (id_lavadero, fecha, id_servicios) => {
  try {
    const lavadero = await Lavadero.findById(id_lavadero);
    const reservas = await Reserva.find({
      id_lavadero: id_lavadero,
      fecha: fecha,
      estado: { $ne: 'cancelado' }
    });

    const servicios = await Servicio.find({ _id: { $in: id_servicios } });
    // Calcular duración total y costo total
    let duracionTotal = 0;
    for (const servicio of servicios) {
      duracionTotal += servicio.duracion;
    }
    const horasLibres = [];
    // hora es la hora de apertura del lavadero de la fecha seleccionada
    let hora = moment(lavadero.hora_apertura, 'h:mm A').set({ 'year': fecha.split('-')[0], 'month': fecha.split('-')[1] - 1, 'date': fecha.split('-')[2] });
    const horaCierre = moment(lavadero.hora_cierre, 'h:mm A').set({ 'year': fecha.split('-')[0], 'month': fecha.split('-')[1] - 1, 'date': fecha.split('-')[2] });
    while (hora.isBefore(horaCierre)) {  // Mientras la hora sea menor a la hora de cierre
      const fechaActual = moment(fecha).format('YYYY-MM-DD');
      const horaActual = moment.tz("America/Bogota");  // Actualizar la hora actual en cada iteración
      const horaFin = moment(hora, 'h:mm A').add(duracionTotal / 60, 'hours');
      const reservasEspacio = reservas.filter(reserva => {
        return moment(reserva.hora_inicio, 'h:mm A').isBetween(hora, horaFin) ||
          moment(reserva.hora_fin, 'h:mm A').isBetween(hora, horaFin) ||
          moment(reserva.hora_inicio, 'h:mm A').isSameOrBefore(hora) && moment(reserva.hora_fin, 'h:mm A').isSameOrAfter(horaFin);
      });
      if (reservasEspacio.length < lavadero.espacios_de_trabajo) {
        if (moment(fecha).isSame(fechaActual, 'day') && hora.isBefore(horaActual)) {  // si la fecha es hoy y la hora es menor a la hora actual
          hora.add(duracionTotal / 60, 'hours');
          continue;
        }
        horasLibres.push(hora.format('h:mm A'));
      }
      hora.add(duracionTotal / 60, 'hours');
    }

    return horasLibres;
  } catch (error) {
    console.log(error);
  }
}