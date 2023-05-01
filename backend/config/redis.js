const redis = require("redis");
const { promisify } = require("util");
require("dotenv").config();

const conectarRedis = () => {
  const client = redis.createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
  });

  client.on("error", (error) => {
    console.error(`Error al conectarse a Redis: ${error.message}`);
  });

  client.on("connect", () => {
    console.log("Conexión a Redis exitosa");
  });

  return {
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
  };
};

module.exports = conectarRedis;