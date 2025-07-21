// Importa Mongoose para interactuar con MongoDB
const mongoose = require('mongoose');
// Importa dotenv para cargar variables de entorno desde el archivo .env
require('dotenv').config();

// Obtiene la URI de MongoDB desde las variables de entorno
const mongoURI = process.env.MONGO_URI;

/**
 * Función asíncrona para establecer la conexión con la base de datos.
 */
const connectDB = async () => {
  try {
    // Intenta conectarse a MongoDB usando la URI proporcionada
    await mongoose.connect(mongoURI);
    console.log('✅ Conexión a MongoDB establecida correctamente.');
  } catch (error) {
    // Si hay un error en la conexión, lo muestra en la consola y termina el proceso
    console.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1); // Detiene la aplicación si no se puede conectar a la DB
  }
};

// Exporta la función para que pueda ser utilizada en otros archivos
module.exports = connectDB;
