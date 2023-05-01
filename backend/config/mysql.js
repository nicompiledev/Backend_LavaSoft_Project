const mysql = require("mysql2/promise");

const conectarMySqlDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    console.log("Conexión a la base de datos MySQL exitosa");
    return connection;
  } catch (error) {
    console.error(`Error al conectarse a la base de datos MySQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarMySqlDB;