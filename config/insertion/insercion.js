const faker = require('faker');
require('faker/locale/es_MX.js');

const Lavadero = require("../../models/type_users/Lavadero.js");
const Servicio = require("../../models/Servicio.js");

const realizarInsercion = async () => {


    const lavaderos = [
        {
            nombreLavadero: 'Autolimpio Colombia',
            NIT: '567891234',
            descripcion: 'En Autolimpio Colombia nos especializamos en brindar un lavado impecable para tu vehículo. Nuestro equipo de expertos utiliza técnicas de limpieza avanzadas y productos de alta calidad para dejar tu auto reluciente.',
            telefono: '3215601896',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'oeste',
            direccion: 'Carrera 14 # 9-20, La Castellana',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.65710788617591, 4.550425563581399] // Reemplaza longitude y latitude con las coordenadas reales
            },

            correo_electronico: 'admin@autolimpio.com',
            contrasena: 'test1234',

            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        }
        ,
        {
            nombreLavadero: 'LavaCar Express',
            NIT: '567896687',
            descripcion: 'En LavaCar Express entendemos que tu tiempo es valioso. Por eso, te ofrecemos un lavado rápido y eficiente sin comprometer la calidad. Obtén un resultado impecable en cuestión de minutos.',
            telefono: '3115751896',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'centro',
            direccion: 'calle 21 # 20 - 18, San José',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.67259111732837, 4.539558367053374] // Reemplaza longitude y latitude con las coordenadas reales
            },

            correo_electronico: 'admin@lavacarexpress.com',
            contrasena: 'test1235',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()

        },
        {
            nombreLavadero: 'SuperLavado',
            NIT: '549296687',
            descripcion: 'En SuperLavado nos esforzamos por superar tus expectativas en cada lavado. Nuestro personal altamente capacitado y nuestras modernas instalaciones garantizan una limpieza completa y un acabado brillante.',
            telefono: '3115751549',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'oeste',
            direccion: 'carrera 15N # 19- 45, Laureles',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.65597439783147, 4.559692022948127] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@superlavado.com',
            contrasena: 'test1236',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'CleanCar Center',
            NIT: '369896687',
            descripcion: 'CleanCar Center es tu centro de lavado integral. Ofrecemos una amplia gama de servicios, desde lavado básico hasta tratamientos de pulido y encerado. Déjanos cuidar de tu vehículo y devolverle su brillo original.',
            telefono: '3115781549',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'sur',
            direccion: 'carrera 18 # 58 - 13, La Cejita',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.68856358070731, 4.519524812340521] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@clancarcenter.com',
            contrasena: 'test1237',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()

        },
        {
            nombreLavadero: 'MegaLavados',
            NIT: '167896687',
            descripcion: 'En MegaLavados, nuestro enfoque es simple: brindar resultados excepcionales. Utilizamos tecnología de punta y productos de primera calidad para garantizar un lavado a fondo que dejará tu automóvil como nuevo.',
            telefono: '3125787549',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'sur',
            direccion: 'carrera 19 # 48 - 21, Las Acacias',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.68904328859666, 4.5213959683756855] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@megalavados.com',
            contrasena: 'test1238',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'TurboLavado',
            NIT: '167896465',
            descripcion: '¿Necesitas un lavado rápido pero eficiente? En TurboLavado, utilizamos equipos de alta presión y productos especializados para eliminar la suciedad más difícil en tiempo récord. Obtén un lavado de calidad en tiempo exprés.',
            telefono: '3135467549',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'sur',
            direccion: 'calle principal, sector caseta comunal, Pinares',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.69239612261788, 4.511027478268858] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@turbolavado.com',
            contrasena: 'test1239',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'Lavado Total',
            NIT: '237696457',
            descripcion: 'En Lavado Total, nos ocupamos de cada detalle. Nuestro equipo de expertos realiza un lavado minucioso tanto en el exterior como en el interior de tu vehículo, dejándolo impecable en todos los aspectos.',
            telefono: '3103247549',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'centro',
            direccion: 'frente a la manzana 13, sector 1, Villa del Prado',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.69810124614278, 4.53553068861514] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@lavadototal.com',
            contrasena: 'test1240',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'LavaMax',
            NIT: '227675357',
            descripcion: ' Con LavaMax, tu auto alcanzará su máximo esplendor. Nuestros servicios de lavado y detallado están diseñados para resaltar la belleza de tu vehículo y proteger su pintura. Descubre el poder del máximo cuidado.',
            telefono: '3201247679',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'centro',
            direccion: 'enseguida bomba la 21 , sector bosque',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.68167338296497, 4.541481538320298] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@lavamax.com',
            contrasena: 'test1241',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'Lavautos VIP',
            NIT: '107675341',
            descripcion: 'En Lavautos VIP, te ofrecemos un servicio exclusivo y personalizado. Nuestro equipo altamente calificado se encarga de mimar tu vehículo con tratamientos premium que dejarán una impresión duradera.',
            telefono: '3141247321',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'oeste',
            direccion: 'bomba atlantis, sector avenida bolivar',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.65554034740266, 4.558961985389132] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@lavautosvip.com',
            contrasena: 'test1242',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'BrilloAuto',
            NIT: '654675751',
            descripcion: 'En BrilloAuto, entendemos que un automóvil reluciente refleja tu estilo de vida. Utilizamos productos de calidad y técnicas de pulido avanzadas para brindarte un brillo incomparable y un acabado perfecto.',
            telefono: '3145747321',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'oeste',
            direccion: 'bombra oro negro, sector locomotora',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.6466233691572, 4.573553381376996] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@brilloauto.com',
            contrasena: 'test1243',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'LavaRápido Plus',
            NIT: '754665791',
            descripcion: 'En LavaRápido Plus, la velocidad y la calidad van de la mano. Nuestro enfoque eficiente garantiza un lavado rápido sin comprometer la limpieza y el brillo de tu vehículo. Obtén resultados sorprendentes en poco tiempo.',
            telefono: '3115647521',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'Sector oriente',
            direccion: 'avenida centenario enseguida de homecenter',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.6554140562462, 4.547855856048926] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@lavarapidoplus.com',
            contrasena: 'test1244',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()

        },
        {
            nombreLavadero: 'LimpiaCarrosTop',
            NIT: '5671846932',
            descripcion: 'En LimpiaCarroTop, nos apasiona dejar los autos impecables. Nuestro equipo de limpieza realiza un lavado detallado, prestando atención a cada rincón y recoveco. Confía en nosotros para mantener tu vehículo impecable.',
            telefono: '3111245678',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'Sector oriente',
            direccion: 'avenida centenario frente a la bomba texaco',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.6442180407772, 4.563279959253109] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@limpiacarrostop.com',
            contrasena: 'test1245',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'Lavado Estelar',
            NIT: '6671846751',
            descripcion: 'En Lavado Estelar, brindamos un servicio de lavado de estrella. Utilizamos productos de calidad superior y técnicas profesionales para asegurarnos de que tu automóvil reciba un tratamiento VIP en cada visita.',
            telefono: '3002365487',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'centro',
            direccion: 'carrera 13 con calle 21 detras de la plaza de bolivar',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.67256657352571, 4.531459502006726] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@lavadoestelar.com',
            contrasena: 'test1246',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()

        },
        {
            nombreLavadero: 'Lavautos Profesional',
            NIT: '6671847895',
            descripcion: 'En Lavautos Profesional, cuidamos tu vehículo como si fuera nuestro. Nuestro equipo de especialistas en limpieza utiliza métodos avanzados y productos de primera calidad para garantizar un resultado profesional en cada lavado.',
            telefono: '3006579484',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'centro',
            direccion: 'frente a la cancha de la patria, sector puesto de salud',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.70153654295042, 4.540022140290105] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@lavautosprofesional.com',
            contrasena: 'test1247',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'SpeedWash',
            NIT: '6671847415',
            descripcion: ' En SpeedWash, la velocidad no compromete la calidad. Realizamos un lavado rápido pero minucioso utilizando equipos de alta velocidad y productos especializados que eliminan la suciedad sin dejar rastros.',
            telefono: '3215604478',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'centro',
            direccion: 'cll 33 # 15 - 45, la pavona',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.70044735363707, 4.5377786864447245] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@speedwash.com',
            contrasena: 'test1248',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'CleanMachine',
            NIT: '3568741569',
            descripcion: 'En CleanMachine, la limpieza es nuestra pasión. Nuestra maquinaria de última generación y nuestros productos de calidad superior trabajan en armonía para brindarte un lavado a fondo y una experiencia de primer nivel.',
            telefono: '3215552134',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'centro',
            direccion: 'calle 12 # 15 - 23, Parque sucre',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.66900998927375, 4.536501174170098] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@cleanmachine.com',
            contrasena: 'test1249',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'Lavado Ecológico',
            NIT: '3568741569',
            descripcion: 'En Lavado Ecológico, nos preocupamos por el medio ambiente. Utilizamos productos biodegradables y técnicas de lavado sostenibles para brindarte un servicio impecable mientras reducimos nuestro impacto en el planeta.',
            telefono: '3126547841',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'sur',
            direccion: 'frente al hospital del sur, entrada al barrio la villa',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.70207685100749, 4.514561799515079] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@lavadoecologico.com',
            contrasena: 'test1250',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'LavaMóvil',
            NIT: '3548741852',
            descripcion: 'LavaMóvil lleva el lavado de autos hasta tu puerta. Nuestro equipo de expertos se desplaza con equipos móviles totalmente equipados para brindarte un lavado conveniente y de alta calidad en la comodidad de tu hogar.',
            telefono: '3016556841',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'norte',
            direccion: 'Avenida centenario, bomba terpel 1km antes del sena',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.6408367833711, 4.569987597896954] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@lavamovil.com',
            contrasena: 'test1251',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'LavaMóvil',
            NIT: '3548741852',
            descripcion: 'LavaMóvil lleva el lavado de autos hasta tu puerta. Nuestro equipo de expertos se desplaza con equipos móviles totalmente equipados para brindarte un lavado conveniente y de alta calidad en la comodidad de tu hogar.',
            telefono: '3016556841',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'norte',
            direccion: 'Avenida centenario, bomba terpel 1km antes del sena',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.6408367833711, 4.569987597896954] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@lavamovil.com',
            contrasena: 'test1251',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'CarWash Deluxe',
            NIT: '5648749152',
            descripcion: 'En CarWash Deluxe, te ofrecemos un lavado de lujo. Nuestro equipo de expertos utiliza productos premium y técnicas exclusivas para brindarte una experiencia de lavado que va más allá de lo ordinario.',
            telefono: '3019756876',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'centro occidente',
            direccion: 'Diagonal al archivo de la epa, barrio granada',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.67286027157601, 4.544448208382292] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@carwashdeluxe.com',
            contrasena: 'test1252',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        },
        {
            nombreLavadero: 'TopClean Auto',
            NIT: '5648749152',
            descripcion: 'En TopClean Auto, nuestro objetivo es ser la opción número uno para el cuidado de tu automóvil. Con servicios de lavado detallado y atención meticulosa, nos aseguramos de que tu vehículo siempre se vea impecable y reluciente.',
            telefono: '3046675876',
            siNoLoRecogen: 'Sí',
            departamento: 'Quindío',
            ciudad: 'Armenia',
            sector: 'oeste',
            direccion: 'bomba terpel de la crq, av 19 norte',
            ubicacion: {
                type: 'Point',
                coordinates: [-75.66180507682769, 4.557210266521835] // Reemplaza longitude y latitude con las coordenadas reales
            },
            correo_electronico: 'admin@topcleanauto.com',
            contrasena: 'test1253',
            hora_apertura: '08:00',
            hora_cierre: '18:00',
            tipoVehiculos: ['Moto', 'Carro'],
            imagenes: [
        "https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6873081/pexels-photo-6873081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://img.freepik.com/foto-gratis/hermoso-coche-servicio-lavado_23-2149212221.jpg?w=1380&t=st=1685927664~exp=1685928264~hmac=e9f145c959b1d89d61eae24420bc9f48e539b2f518da39ba8967dd783d461498",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://img.freepik.com/foto-gratis/mano-masculina-esponja-espuma-lavando-coche_1157-36584.jpg?w=1380&t=st=1685927713~exp=1685928313~hmac=1076757b4c5928a22a1d932746c6621cd1f27915109c18a0a6c514dfe11b8b71",
        "https://img.freepik.com/vector-gratis/plantilla-logotipo-detalle-degradado_52683-83042.jpg?w=1380&t=st=1685927813~exp=1685928413~hmac=178da83b8cad87dda9883a4ec53f862a3e8935ec714caa921f6167fe42de00e3",
        "https://img.freepik.com/fotos-premium/trabajador-lavado-coche-rojo-esponja-tunel-lavado_179755-10792.jpg?w=1380",
        "https://images.pexels.com/photos/6873086/pexels-photo-6873086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ],
            espacios_de_trabajo: 10,
            strikes: 0,
            estado: true,
            visualizado: true,

            creado: Date.now()
        }
    ];

    Lavadero.insertMany(lavaderos)
        .then((result) => {
            console.log('Documentos insertados exitosamente:', result);
        })
        .catch((error) => {
            console.error('Error al insertar documentos:', error);
        });
};

module.exports = realizarInsercion;
