/* Porque en la noche ya no me funciona el codigo, se supone que cuando la hora actual pasa la hora de cierre puese no deberia mandar horarios disponibles
Me manda todas las horas disponibles, no entiendo porque, cuando se supone que si ya pasó la hora de cierre, no deberia porque tener horas disponibles, ya el establecimiento cerró
No hay mensaje de error,  duelve todas las horas disponibles cuando el local ya cerró.

Lo esperado es que cuando ya haya pasado la hora de cierre pues no mande nada.

const moment = require('moment-timezone');
moment.tz.setDefault("America/Bogota");

let fecha = '2023-06-21'
let reservas = [];

let servicios = [
   {
nombre: 'Encerado con cera de carnauba',
categoria: 'encerado',
tipoVehiculo: 'Carro',
  detalle: 'Encerado con cera de carnauba, que protege la pintura de los rayos UV y la suciedad.',
costo: 50000,
duracion: 60,
__v: 0
}
]
    let duracionTotal = 0;
    for (const servicio of servicios) {
      duracionTotal += servicio.duracion;
    }


const horasLibres = [];
    let hora = moment("8:00 AM", 'h:mm A');
    const horaCierre = moment("6:00 PM", 'h:mm A');

    while (hora.isBefore(horaCierre)) {  // Mientras la hora sea menor a la hora de cierre
      const horaActual = moment.tz("America/Bogota");
      const horaFin = moment(hora, 'h:mm A').add(duracionTotal / 60, 'hours');
      const reservasEspacio = reservas.filter(reserva => {
        return moment(reserva.hora_inicio, 'h:mm A').isBetween(hora, horaFin) ||
          moment(reserva.hora_fin, 'h:mm A').isBetween(hora, horaFin) ||
          moment(reserva.hora_inicio, 'h:mm A').isSameOrBefore(hora) && moment(reserva.hora_fin, 'h:mm A').isSameOrAfter(horaFin);
      });
      if (reservasEspacio.length < 1 && (!moment(fecha).isSame(moment(), 'day') || (hora.isAfter(horaActual) && hora.isBefore(horaCierre)))) {
        horasLibres.push(hora.format('h:mm A'));
      }
      hora.add(duracionTotal / 60, 'hours');
    };


    console.log(horasLibres);

En el mismo texto del inicio dice que problema tengo y que espero que me retorne, no necesitas preguntarmelo. */

// Solucion:
// El problema es que estás usando el método isBefore() para comparar horas, pero no estás teniendo en cuenta la fecha, por lo que si la hora actual es mayor a la hora de cierre, pero la fecha es anterior a la fecha actual, entonces la hora actual es menor a la hora de cierre, por lo que el método isBefore() retorna true.

// Para solucionar esto, puedes usar el método isSameOrBefore() en lugar de isBefore().
//
// Ejemplo:
/* 
const moment = require('moment-timezone');
moment.tz.setDefault("America/Bogota");

let fecha = '2023-06-21'
let reservas = [];

let servicios = [
    {
        nombre: 'Encerado con cera de carnauba',
        categoria: 'encerado',
        tipoVehiculo: 'Carro',
        detalle: 'Encerado con cera de carnauba, que protege la pintura de los rayos UV y la suciedad.',
        costo: 50000,
        duracion: 60,
        __v: 0
    }
]
let duracionTotal = 0;
for (const servicio of servicios) {
    duracionTotal += servicio.duracion;
}


const horasLibres = [];
let hora = moment("8:00 AM", 'h:mm A');
const horaCierre = moment("6:00 PM", 'h:mm A');

while (hora.isSameOrBefore(horaCierre)) {  // Mientras la hora sea menor a la hora de cierre
    const horaActual = moment.tz("America/Bogota");
    const horaFin = moment(hora, 'h:mm A').add(duracionTotal / 60, 'hours');
    const reservasEspacio = reservas.filter(reserva => {
        return moment(reserva.hora_inicio, 'h:mm A').isBetween(hora, horaFin) ||
            moment(reserva.hora_fin, 'h:mm A').isBetween(hora, horaFin) ||
            moment(reserva.hora_inicio, 'h:mm A').isSameOrBefore(hora) && moment(reserva.hora_fin, 'h:mm A').isSameOrAfter(horaFin);
    }
    );
    if (reservasEspacio.length < 1 && (!moment(fecha).isSame(moment(), 'day') || (hora.isSameOrAfter(horaActual) && hora.isSameOrBefore(horaCierre)))) {
        horasLibres.push(hora.format('h:mm A'));
    }
    hora.add(duracionTotal / 60, 'hours');
};
*/

