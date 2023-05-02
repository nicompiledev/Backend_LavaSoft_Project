const { Reserva } = require('../models/Agendar.js');
const Lavadero = require('../models/lavadero.js');
const { Servicio } = require('../models/Servicio.js');
const Usuario = require('../models/Usuario.js');
const moment = require('moment');

module.exports = function (io) {
  io.on("connection", async (socket) => {
    socket.on("reservar", async (datos) => {
      // Los datos tendran la siguiente estructura
      // {
      //   id_lavadero: "id del lavadero",
      //   id_servicio: "id del servicio",
      //   id_usuario: "id del usuario",
      //   fecha: "fecha de la reserva",
      //   hora_agendada: "hora de la reserva en cual inicia el servicio agendado",
      // }

      // Reserva tiene la siguiente estructura
      // {|
      //   id_lavadero: "id del lavadero",
      //   id_usuario: "id del usuario",
      //   id_servicio: "id del servicio",
      //   fecha: "fecha de la reserva",
      //   hora_inicio: "hora de inicio de la reserva",
      //   hora_fin: "hora de fin de la reserva",
      //   espacio_de_trabajo: "espacio de trabajo de la reserva",
      // |}

      // Servicio tiene la siguiente estructura
      // {|
      //   lavadero: "id del lavadero",
      //   nombre: "nombre del servicio",
      //   detalle: "detalle del servicio",
      //   costo: "costo del servicio",
      //   duracion: "duracion del servicio en minutos",
      // |}

      // Lavadero tiene la siguiente estructura
      // {|
      //   nombre: "nombre del lavadero"
      //   ciudad: "ciudad del lavadero"
      //   direccion: "direccion del lavadero"
      //   telefono: "telefono del lavadero"
      //   correo_electronico: "correo electronico del lavadero"
      //   contrasena: "contraseña del lavadero"
      //   hora_apertura: "hora de apertura del lavadero"  (Formato 9:00 AM)
      //   hora_cierre: "hora de cierre del lavadero"
      //   estado: "estado del lavadero"
      //   confirmado: "confirmacion del lavadero"
      //   token: "token del lavadero"
      //   imagenes: "imagenes del lavadero"
      //   espacios_de_trabajo: "espacios de trabajo del lavadero"  // o sea pueden trabajar 2 carros al mismo tiempo
      //   ubicacion: "ubicacion del lavadero"
      // |}

      try {
        // validar que el lavadero exista
        const { id_lavadero, id_servicio, id_usuario } = datos;
        const lavadero = await Lavadero.findById(id_lavadero);
        if (!lavadero) {
          throw new Error("El lavadero no existe");
        }

        // validar que el servicio exista
        const servicio = await Servicio.findById(id_servicio);
        if (!servicio) {
          throw new Error("El servicio no existe");
        }

        // validar que el usuario exista
        const usuario = await Usuario.findById(id_usuario);
        if (!usuario) {
          throw new Error("El usuario no existe");
        }

        const { hora_agendada, fecha } = datos;

        // Calcular hora fin teniendo en cuenta la duracion del servicio
        const hora_fin = moment(hora_agendada, "HH:mm").add(
          servicio.duracion,
          "minutes"
        );

        // Hora inicio con el formato 9:00 AM
        hora_agendada = moment(hora_agendada, "HH:mm").format(
          "HH:mm"
        );

        // Obtener los espacios de trabajo ocupados
        const espaciosOcupados = await Reserva.find({
          id_lavadero,
          fecha: fecha,
          hora_inicio: { $lt: hora_fin },
          hora_fin: { $gt: hora_agendada },
        });

        // Validar que el lavadero tenga espacios de trabajo disponibles
        if (espaciosOcupados.length >= lavadero.espacios_de_trabajo) {
          throw new Error("El lavadero no tiene espacios de trabajo disponibles");
        }

        // Validar que el lavadero este abierto
        const hora_apertura = moment(lavadero.hora_apertura, "HH:mm");
        const hora_cierre = moment(lavadero.hora_cierre, "HH:mm");
        const hora_inicio = moment(hora_agendada, "HH:mm");

        // Validar que la hora de inicio este entre la hora de apertura y cierre
        if (hora_inicio.isBefore(hora_apertura) || hora_fin.isAfter(hora_cierre)) {
          throw new Error("El lavadero no esta abierto");
        }

        // Validar si la duracion del servicio entra en conflicto con un espacio despues donde los 4 espacios estan ocupados
        const hora_inicio_espacio = moment(hora_agendada, "HH:mm");
        const hora_fin_espacio = moment(hora_agendada, "HH:mm").add(
          servicio.duracion,
          "minutes"
        );

        // Obtener los espacios de trabajo ocupados
        const espaciosOcupadosDespues = await Reserva.find({
          id_lavadero,
          fecha: fecha,
          hora_inicio: { $lt: hora_fin_espacio },
          hora_fin: { $gt: hora_inicio_espacio },
        });

        // Validar que el lavadero tenga espacios de trabajo disponibles
        if (espaciosOcupadosDespues.length >= lavadero.espacios_de_trabajo) {
          throw new Error("El lavadero no tiene espacios de trabajo disponibles en la duracion del servicio");
        }

        // Crear la reserva
        const reserva = new Reserva({
          id_lavadero,
          id_usuario,
          id_servicio,
          fecha,
          hora_inicio: hora_agendada,
          hora_fin: hora_fin.format("HH:mm"),
          espacio_de_trabajo: espaciosOcupados.length + 1
        });

        // Guardar la reserva
        const reservaGuardada = await reserva.save();

        if(!reservaGuardada) {
          throw new Error("Error al guardar la reserva");
        }else {
          const horasLibres = await horasDisponibles(id_lavadero, fecha, id_servicio);
          socket.nsp.emit("horasLibres", horasLibres);
        }

      } catch (error) {
        return socket.emit("reservaCreada", { error: error.message });
      }
    });

    // Mandar las horas disponibles
    socket.on("horasDisponibles", async (datos) => {
      const { id_lavadero, fecha, id_servicio } = datos;
      const horasLibres = await horasDisponibles(id_lavadero, fecha, id_servicio);
      socket.emit("horasLibres", horasLibres);
    });
  });
};

const horasDisponibles = async (id_lavadero, fecha, id_servicio) => {
  try {
    // Obtener el lavadero
    const lavadero = await Lavadero.findById(id_lavadero);
    if (!lavadero) {
      throw new Error("El lavadero no existe");
    }
    // Obtener el servicio
    const servicio = await Servicio.findById(id_servicio);
    if (!servicio) {
      throw new Error("El servicio no existe");
    }

    const horasLibres = [];
    const hora_fin = moment(lavadero.hora_cierre, "HH:mm");
    const hora_inicio_servicio = moment(lavadero.hora_apertura, "HH:mm");
    const hora_fin_servicio = moment(lavadero.hora_apertura, "HH:mm").add(
      servicio.duracion,
      "minutes"
    );

    // Obtener todas las reservas en la fecha seleccionada
    const reservas = await Reserva.find({
      id_lavadero,
      fecha: fecha,
      hora_inicio: { $lt: hora_fin.format("HH:mm") },
      hora_fin: { $gt: lavadero.hora_apertura },
    });

    // Obtener las horas libres
    while (hora_inicio_servicio.isBefore(hora_fin)) {
      const reservasSuperpuestas = reservas.filter(
        (reserva) =>
          reserva.hora_inicio < hora_fin_servicio.format("HH:mm") &&
          reserva.hora_fin > hora_inicio_servicio.format("HH:mm")
      );
      if (reservasSuperpuestas.length < lavadero.espacios_de_trabajo) {
        horasLibres.push(hora_inicio_servicio.format("HH:mm"));
      }
      hora_inicio_servicio.add(servicio.duracion, "minutes");
      hora_fin_servicio.add(servicio.duracion, "minutes");
    }

    return horasLibres;
  } catch (error) {
    throw new Error(error.message);
  }
};