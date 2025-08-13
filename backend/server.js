import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import routes from './routes.js';

const app = express();
const __dirname = path.resolve();

// --- Middlewares y configuración de Express ---

// CORS dinámico: frontend en producción y localhost en desarrollo
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://frontend-mi-marketplace.onrender.com'
    : 'http://localhost:5173',
  credentials: true
}));

// Middlewares para parsear el body de las peticiones
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos de la carpeta "public"
const staticPath = path.resolve('public');
app.use('/public', express.static(staticPath));

// Crear directorios de uploads si no existen
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const profilesUploadsDir = path.resolve('uploads/profiles');
if (!fs.existsSync(profilesUploadsDir)) {
  fs.mkdirSync(profilesUploadsDir, { recursive: true });
}

// Servir archivos estáticos de los directorios de uploads
//  permite que el frontend acceda a las imágenes de perfil y productos
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads/profiles', express.static(profilesUploadsDir));


// --- Rutas de la API ---

app.use('/api', routes);


// --- Configuración para Producción (servir frontend estático) ---

if (process.env.NODE_ENV === 'production') {
  // Servir los archivos estáticos de la carpeta 'dist' del frontend
  app.use(express.static(path.join(__dirname, 'dist')));

  // Middleware de catch-all para servir el index.html
 
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}


// --- Middleware de Errores ---

// middleware captura y maneja cualquier error que ocurra en las rutas
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});


// --- Levantamiento del Servidor ---

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
}


export default app;
