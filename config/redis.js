const redis = require("redis");
const { promisify } = require("util");
require("dotenv").config();

// Utiliza la URL de conexión proporcionada por Render
const publisher = redis.createClient(process.env.REDIS_URL);



// También puedes usar la misma URL para el cliente subscriber si es necesario
const subscriber = redis.createClient(process.env.REDIS_URL);

publisher.on("error", (error) => {
  console.error(`Error al conectarse a Redis: ${error.message} con publisher`);
});

subscriber.on("error", (error) => {
  console.error(`Error al conectarse a Redis: ${error.message} con subscriber`);
});

publisher.on("connect", () => {
  console.log("Conexión a Redis exitosa con publisher");
});

subscriber.on("connect", () => {
  console.log("Conexión a Redis exitosa con subscriber");
});


async function updateRedis(id) {


  // Borrar todas las claves en Redis
/*   publisher.flushall((err, succeeded) => {
    console.log(succeeded); // Devolverá verdadero si se ejecutó correctamente
  }); */

  // Obtener las claves en Redis
  const keys = await publisher.keys('lavaderos_*');

  // Verificar si keys es un arreglo
  if (Array.isArray(keys)) {
    // Borrar las claves en Redis
    for (const key of keys) {
      await publisher.del(key);
    }
  }

  // Borrar la clave del lavadero específico
  if (id) {
    await publisher.del(`lavadero_${id}`);
  }
}

/* updateRedis(); */


module.exports = {
  publisher,
  subscriber,
  getAsync: promisify(publisher.get).bind(publisher),
  setAsync: promisify(publisher.set).bind(publisher),
  updateRedis
};