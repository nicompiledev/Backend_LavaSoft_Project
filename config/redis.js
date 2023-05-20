const redis = require("redis");
const { promisify } = require("util");
require("dotenv").config();

const publisher = redis.createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
});

const subscriber = redis.createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
});

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