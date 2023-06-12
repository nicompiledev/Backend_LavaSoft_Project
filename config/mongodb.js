const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.set("strictQuery", false);


const conectarMongoDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

/*     const realizarInsercion = require("./insertion/insercion.js");
    await realizarInsercion()
 */
    console.log("Conexión a la base de datos MongoDB exitosa");
  } catch (error) {
    console.error(`Error al conectarse a la base de datos MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarMongoDB;
