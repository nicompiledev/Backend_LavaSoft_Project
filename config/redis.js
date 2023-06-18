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

module.exports = {
  publisher,
  subscriber,
  getAsync: promisify(publisher.get).bind(publisher),
  setAsync: promisify(publisher.set).bind(publisher),
};