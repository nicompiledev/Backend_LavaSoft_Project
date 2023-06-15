const { Reserva } = require('../models/Reserva.js');
const Lavadero = require('../models/type_users/Lavadero.js');
const { Servicio } = require('../models/Servicio.js');
const moment = require('moment');

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
  /* Necesito que mi codigo cumpla los siguientes requisitos en el momento de mostrar los tiempos disponibles para reservar, las divisiones van dependiendo el intervalo del servicio que se seleccionó, por ejemplo, si se selecciona un servicio de 30min, las divisiones serán de 30min, si se selecciona un servicio de 1:30min, las divisiones serán de 1:30min, etc.

Suponiendo que se reserva un servicio de duración de 30min que empieza a las 8:30 AM y termina a las 9:00AM.
1. No se podría agendar un servicio de 1:30min de duración a las 8:00AM porque está "Ocupado" de 8:30AM a 9:00AM con el servicio de 30min de duración.
2. Si se podría agendar un servicio de 30min a las 8:00 AM ya que de 8:00 AM a 8:30 AM está libre y no entra en conflicto, Ya que el siguiente es de 8:30 a 9:00.
3. No olvides tener en cuenta los espacios de trabajo, o sea, si alguien agendo a las 8:30AM pero aun hay espacio disponible, aun se puede reservar ahi.
4. Si se podría agendar un servicio de 1:30min a las 9:00AM ya que de 9:00AM a 10:30AM está libre y no entra en conflicto, Ya que el siguiente es de 10:30 a 12:00.
5. Si un servicio de 1:30min empieza a las 8:00AM y termina a las 9:30AM, no se podría agendar un servicio de 30min a las 9:00AM ya que de 9:00AM a 9:30AM está "Ocupado" con el servicio de 1:30min de duración.
DEBES TENER MUY PRESENTE LOS ESPACIOS DE TRABAJO 

  modelos:
    const reservaSchema = new mongoose.Schema({
    id_lavadero: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lavadero", required: true }],
    id_usuario: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }],
    nombre_servicio: { type: String, required: true },
    nombre_usuario: { type: String, required: true },
    fecha: { type: String, required: true },
    hora_inicio: { type: String, required: true },
    hora_fin: { type: String, required: true },
    espacio_de_trabajo: { type: Number, required: true },
    estado: { type: String, enum: ["pendiente", "terminado", "cancelado"], default: "pendiente"},
    motivoCancelacion: {type: String, default: "No fue cancelado"}
  });

  const servicioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String, enum: ["lavado", "encerado", "polichado", "aspirado", "desinfeccion", "otros"], required: true },
    tipoVehiculo: { type: String, required: true },
    detalle: { type: String, required: true },
    costo: { type: Number, required: true },
    duracion: { type: Number, required: true }
  });

*/

  //log

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
    let costoTotal = 0;
    for (const servicio of servicios) {
      duracionTotal += servicio.duracion;
      costoTotal += servicio.costo;
    }

    const horasLibres = [];
    let hora = moment(lavadero.hora_apertura, 'h:mm A');
    const horaCierre = moment(lavadero.hora_cierre, 'h:mm A');
    while (hora.isBefore(horaCierre)) {
      const horaFin = moment(hora, 'h:mm A').add(duracionTotal / 60, 'hours');
      const reservasEspacio = reservas.filter(reserva => {
        return moment(reserva.hora_inicio, 'h:mm A').isBetween(hora, horaFin) ||
          moment(reserva.hora_fin, 'h:mm A').isBetween(hora, horaFin) ||
          moment(reserva.hora_inicio, 'h:mm A').isSameOrBefore(hora) && moment(reserva.hora_fin, 'h:mm A').isSameOrAfter(horaFin);
      });
      if (reservasEspacio.length === 0) {
        horasLibres.push(hora.format('h:mm A'));
      }
      hora.add(duracionTotal / 60, 'hours');
    }

    return horasLibres;
  } catch (error) {
    console.log(error);
  }

};
