const {generarJWTHasPaid} = require("../helpers/generarJWT.js");
const generarId = require("../helpers/generarId.js");
const emailRegistro = require("../helpers/lavaderos/emailRegistro.js");
const emailCancelado = require("../helpers/lavaderos/emailCancelado.js")
const emailServicioTerminada = require("../helpers/lavaderos/emailServicioTerminada.js")
const emailOlvidePassword = require("../helpers/usuarios/emailOlvidePassword.js");
const { AILavaderoREAL } = require("./openai/openai.js");

const Usuario = require("../models/type_users/Usuario.js");
const Lavadero = require("../models/type_users/Lavadero.js");
const { Servicio } = require("../models/Servicio.js");
const { Reserva } = require("../models/Reserva.js");

// Stripe
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const registrarLavadero = async (req, res) => {
  let error = "";
  try {
    const { nombreLavadero, NIT, departamento, ciudad, sector, direccion, telefono, correo_electronico, hora_apertura, hora_cierre, espacios_de_trabajo, longitud, latitud, siNoLoRecogen, tipoVehiculos } = req.body;

    if(hora_apertura >= hora_cierre){
      error = new Error("La hora de apertura debe ser menor a la hora de cierre");
      return res.status(400).json({ msg: error.message });
    }

    // Si open ai está bien configurado, se puede ejecutar el codigo de abajo
    const respuestaOpenAI = await AILavaderoREAL(nombreLavadero, direccion, correo_electronico, telefono);

    switch (respuestaOpenAI) {
      case "falso":
        error = new Error("La información ingresada es falsa");
        return res.status(400).json({ msg: error.message });
      case "verdadero":
        //continuar el codigo
        break;
      default:
        //return res.status(401).json({ msg: respuestaOpenAI });
        break;
    }

    const existeLavadero = await Lavadero.findOne({ correo_electronico });
    if (existeLavadero) {
      error = new Error("El correo electrónico ya está registrado para otro lavadero");
      return res.status(400).json({ msg: error.message });
    }

    const lavadero = new Lavadero({
      nombreLavadero,
      NIT,
      departamento,
      ciudad,
      sector,
      direccion,
      telefono,
      correo_electronico,
      siNoLoRecogen,
      hora_apertura,
      hora_cierre,
      tipoVehiculos: tipoVehiculos, // Inicializa el campo TopoVehiculos
      imagenes: [], // inicializa el campo imagenes
      espacios_de_trabajo,
      ubicacion: {
        type: "Point",
        coordinates: [longitud, latitud],
      },
    });

    // Save the user to the database
    const lavaderoGuardado = await lavadero.save();

    try {
      // Save images
      if (!req.files) {
        error = new Error("No se subieron imágenes");
        return res.status(500).json({ msg: error.message });
      }

      const imageUrls = await req.files.map((file) => file.path);

      lavaderoGuardado.imagenes = await imageUrls; // asigna las URLs de las imágenes al campo imagenes del lavadero
      await lavaderoGuardado.save(); // guarda las URLs de las imágenes en el lavadero

      // Send email
      /*       await emailRegistro({
              email: correo_electronico,
              nombre
            });
       */
      res.status(200).json({ msg: "Tu petición se ha realizado con éxito, por favor espera a que un administrador acepte tu solicitud" });

    } catch (e) {
      console.log(e)
      // Si se produce un error al insertar las imágenes, cancela el registro del usuario
      await lavaderoGuardado.remove(); // elimina el lavadero recién creado

      // Envía la respuesta de error
      error = new Error("Hubo un error al subir las imágenes");
      res.status(500).json({ msg: error.message });
    }

  } catch (e) {
    console.log(e)
    error = new Error("Hubo un error al registrar el lavadero");
    res.status(400).json({ msg: error.message });
  }
};

const editarLavadero = async (req, res) => {
  let error = "";
  try {
    const { NIT, nombreLavadero, descripcion, telefono, siNoLoRecogen, departamento, ciudad, sector, direccion, latitud, longitud, correo_electronico, hora_apertura, hora_cierre, tipoVehiculos, espacios_de_trabajo } = req.body;

    if(hora_apertura >= hora_cierre){
      error = new Error("La hora de apertura debe ser menor a la hora de cierre");
      return res.status(400).json({ msg: error.message });
    }

    // Find user by email
    const existeLavadero = await Lavadero.findOne({ correo_electronico });

    if (!existeLavadero) {
      error = new Error("El usuario no existe");
      return res.status(400).json({ msg: error.message });
    }

    existeLavadero.NIT = NIT;
    existeLavadero.nombreLavadero = nombreLavadero;
    existeLavadero.descripcion = descripcion;
    existeLavadero.telefono = telefono;
    existeLavadero.siNoLoRecogen = siNoLoRecogen;
    existeLavadero.departamento = departamento;
    existeLavadero.ciudad = ciudad;
    existeLavadero.sector = sector;
    existeLavadero.direccion = direccion;
    existeLavadero.ubicacion = {
      type: "Point",
      coordinates: [longitud, latitud],
    };
    existeLavadero.hora_apertura = hora_apertura;
    existeLavadero.hora_cierre = hora_cierre;
    existeLavadero.tipoVehiculos = tipoVehiculos;
    existeLavadero.espacios_de_trabajo = espacios_de_trabajo;

    try {
      if (req.files) {
        const imageUrls = await req.files.map((file) => file.path);
        existeLavadero.imagenes = await imageUrls; // asigna las URLs de las imágenes al campo imagenes del lavadero
      }
    } catch (e) {
      console.log(e)
      error = new Error("Hubo un error al subir las imágenes");
      res.status(500).json({ msg: error.message });
    }

    // si todos los campos son correctos, visualizado: true
    if(NIT && nombreLavadero && descripcion && telefono && siNoLoRecogen && departamento && ciudad && sector && direccion && latitud && longitud && correo_electronico && hora_apertura && hora_cierre && tipoVehiculos && espacios_de_trabajo && existeLavadero.imagenes.length > 0 && existeLavadero.servicios.length > 0){
      existeLavadero.visualizado = true;
    }

    await existeLavadero.save();

    res.status(200).json({ msg: "Se actualizó su información correctamente" });

  } catch (e) {
    console.log(e)
    error = new Error("Hubo un error al editar el lavadero");
    res.status(400).json({ msg: error.message });
  }
};

const autenticarLavadero = async (req, res) => {
  let error = "";
  try {
    const { correo_electronico, contrasena } = req.body;

    // Find user by email
    const existeLavadero = await Lavadero.findOne({ correo_electronico });

    if (!existeLavadero) {
      error = new Error("El usuario no existe");
      return res.status(400).json({ msg: error.message });
    }

    if (!existeLavadero.estado) {
      error = new Error("La cuenta no ha sido aceptada por administrador, por favor sé paciente");
      return res.status(400).json({ msg: error.message });
    }

    if (await existeLavadero.comprobarPassword(contrasena)) {

      // Generate JWT token
      const token = generarJWTHasPaid(existeLavadero._id, "lavadero", existeLavadero.hasPaid, existeLavadero.visualizado);

      res.status(200).json({
        _id: existeLavadero._id,
        nombre: existeLavadero.nombreLavadero,
        NIT: existeLavadero.NIT,
        descripcion: existeLavadero.descripcion,
        departamento: existeLavadero.departamento,
        ciudad: existeLavadero.ciudad,
        sector: existeLavadero.sector,
        direccion: existeLavadero.direccion,
        telefono: existeLavadero.telefono,
        correo_electronico: existeLavadero.correo_electronico,
        tipoVehiculos: existeLavadero.tipoVehiculos,
        siNoLoRecogen: existeLavadero.siNoLoRecogen,
        hora_apertura: existeLavadero.hora_apertura,
        hora_cierre: existeLavadero.hora_cierre,
        tipoVehiculos: existeLavadero.tipoVehiculos,
        token,
        imagenes: existeLavadero.imagenes,
      });
    } else {
      error = new Error("La contraseña es incorrecta");
      return res.status(401).json({ msg: error.message });
    }

  } catch (e) {
    console.log(e)
    error = new Error("Hubo un error al autenticar el lavadero");
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const getReservasNoAtendidas = async (req, res) => {
  let error = "";
  try {
    const { _id } = req.lavadero;

    const reservas = await Reserva.find({ id_lavadero: _id, estado: "pendiente" });

    res.status(200).json({ reservas });

  } catch (e) {
    console.log(e)
    error = new Error("Hubo un error al obtener las reservas");
    res.status(500).json({ msg: error.message });
  }
}

const putCancelarReserva = async (req, res) => {

  let error = "";

  try {
    const { id_reserve, id_usuario, id_servicio, motivo } = req.body
    const { nombreLavadero } = req.lavadero

    try {
      const [reserva, usuario, servicio] = await Promise.all([
        Reserva.findById(id_reserve),
        Usuario.findById(id_usuario),
        Servicio.findById(id_servicio)
      ]);


      if (motivo == "No llego") {

      }

      /*    TEMPORALMENTE COMENTADO
            await emailCancelado({
              email: usuario.correo_electronico,
              lavadero: nombreLavadero,
              nombre: usuario.nombre,
              reserva: reserva.fecha,
              servicio: servicio.nombre,
              motivo: motivo
            }); */

      reserva.estado = "cancelado";
      reserva.motivoCancelacion = motivo;

      await reserva.save();
    } catch (e) {
      error = new Error("Hubo un error al cancelar la reserva");
      return res.status(404).json({ msg: error.message });
    }

    res.status(200).json({ msg: 'Se cancelo con exito' })

  }
  catch (e) {
    error = new Error("Hubo un error al cancelar la reserva");
    res.status(500).json({ msg: error.message });
  }
}

const servicioTerminado = async (req, res) => {

  let error = "";
  try {
    const { id_reserve, id_usuario } = req.body
    const { nombreLavadero } = req.lavadero

    try {
      const [reserva, usuario] = await Promise.all([
        Reserva.findById(id_reserve),
        Usuario.findById(id_usuario),
      ]);

      reserva.estado = 'terminado'

      await reserva.save()

      /*  TEMPORALMENTE DESACTIVADO
            await emailServicioTerminada({
              email: usuario.correo_electronico,
              nombre: usuario.nombre,
              lavadero: nombreLavadero,
            }); */
    } catch (e) {
      console.log(e)
      error = new Error("Hubo un error al terminar el servicio");
      return res.status(404).json({ msg: error.message });
    }

    res.status(200).json({ msg: 'Se cambio el estado con exito' })

  }
  catch (e) {
    error = new Error("Hubo un error al terminar el servicio");
    res.status(500).json({ msg: error.message });
  }
}

const crearSesionPago = async (req, res) => {
  const { item } = req.body;
  // id en string
  const _id = req.lavadero._id.toString();

  const session = await stripe.checkout.sessions.create({
    client_reference_id: _id,
    payment_method_types: ['card'],
    line_items: [
      {
        price: item,
        quantity: 1,
      }
    ],
    mode: 'subscription',
    success_url: 'http://localhost:4200/inicio',
    cancel_url: 'http://localhost:4200/dashboard-lavadero/subscripcion',
    subscription_data: {
      trial_period_days: 14,
    },
  });
  res.json(session);
}

const webhook = async (req, res) => {
  let event;
  try {
    event = req.body; // Obtener el evento
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      // Obtener el ID del usuario del client_reference_id
      const LavaderoID = session.client_reference_id;

      // Actualizar el estado del usuario en la base de datos para reflejar que ha pagado
      await Lavadero.findByIdAndUpdate(LavaderoID, { hasPaid: true });

      // Obtener el ID de la suscripción de Stripe
      const subscriptionId = session.subscription;

      // Almacenar el ID de la suscripción en la base de datos
      await Lavadero.findByIdAndUpdate(LavaderoID, { subscriptionId });

      // Obtener el ID del cliente de Stripe
      const customerId = session.customer;

      // Almacenar el ID del cliente en la base de datos
      await Lavadero.findByIdAndUpdate(LavaderoID, { customerId });

      console.log(`🔔 Lavadero ${LavaderoID} just subscribed!`);

      break;

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      const updatedCustomerId = updatedSubscription.customer;

      // Buscar al usuario en la base de datos utilizando el ID del cliente de Stripe
      const updatedLavadero = await Lavadero.findOne({ customerId: updatedCustomerId });

      // Actualizar el estado de la suscripción en la base de datos
      await Lavadero.findByIdAndUpdate(updatedLavadero._id, { subscriptionStatus: updatedSubscription.status });

      console.log(`🔔 Subscription updated! Customer: ${updatedCustomerId}`);
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      const deletedCustomerId = deletedSubscription.customer;

      // Buscar al usuario en la base de datos utilizando el ID del cliente de Stripe
      const deletedLavadero = await Lavadero.findOne({ customerId: deletedCustomerId });

      // Actualizar el estado del usuario en la base de datos para reflejar que su membresía ha expirado
      await Lavadero.findByIdAndUpdate(deletedLavadero._id, { haPagado: false, subscriptionStatus: 'canceled' });

      console.log(`🔔 Subscription canceled! Customer: ${deletedCustomerId}`);
      break;


    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.json({ received: true });  // Eso quiere decir que recibimos el evento
}


module.exports = {
  registrarLavadero,
  editarLavadero,
  autenticarLavadero,
  getReservasNoAtendidas,
  putCancelarReserva,
  servicioTerminado,
  crearSesionPago,
  webhook
};