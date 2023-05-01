const conectarMySqlDB = require("./mysql.js");
const conectarMongoDB = require("./mongodb.js");
const conectarRedis = require("./redis.js");

module.exports = { conectarMySqlDB, conectarMongoDB, conectarRedis };
