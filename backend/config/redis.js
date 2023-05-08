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
  console.error(`Error al conectarse a Redis: ${error.message}`);
});

subscriber.on("error", (error) => {
  console.error(`Error al conectarse a Redis: ${error.message}`);
});

publisher.on("connect", () => {
  console.log("Conexión a Redis exitosa");
});

subscriber.on("connect", () => {
  console.log("Conexión a Redis exitosa");
});

module.exports = {
  publisher,
  subscriber,
  getAsync: promisify(publisher.get).bind(publisher),
  setAsync: promisify(publisher.set).bind(publisher),
};