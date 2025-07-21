const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db/connection');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// --- CONFIGURACIÓN DE SEGURIDAD ---

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
});

app.use(limiter);


// --- RESTO DE LA CONFIGURACIÓN ---

connectDB();

// --- ¡NUEVA CONFIGURACIÓN DE CORS! ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://api-wod-generator.vercel.app' // <-- ¡AÑADE LA URL DE TU APP DE VERCEL AQUÍ!
];

const corsOptions = {
  origin: (origin, callback) => {
    // Si la petición viene de uno de los orígenes permitidos (o no tiene origen, como una app móvil), se permite.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por la política de CORS'));
    }
  }
};

// Usa la nueva configuración de CORS
app.use(cors(corsOptions));


app.use(express.json());


// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API del Generador de WODs CrossFit' });
});


// --- RUTAS DE LA API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/users', require('./routes/user'));


// --- PUERTO Y ARRANQUE DEL SERVIDOR ---
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
