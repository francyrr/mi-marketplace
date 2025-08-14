import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import routes from './routes.js';

const app = express();

//carpeta "public" para imágenes estáticas
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

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads/profiles', express.static(profilesUploadsDir));

// CORS dinámico: frontend en producción y localhost en desarrollo
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://frontend-mi-marketplace.onrender.com'
    : 'http://localhost:5173',
  credentials: true
}));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//  Rutas API
app.use('/api', routes);
// ... (resto de tu código de server.js)

// Tus rutas de API (DEBEN ir ANTES del catch-all)
app.use('/api', routes);

// Este es el middleware de catch-all para el frontend
// Sirve el index.html para todas las demás rutas
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}
// Middleware de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});

// ... (resto de tu código de server.js)

// Middleware de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});

// Levantar servidor
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
}

export default app;
