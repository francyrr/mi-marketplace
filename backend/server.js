import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import routes from './routes.js';
import { fileURLToPath } from 'url';

const app = express();

// __dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Carpeta "public" para imágenes estáticas ===
const publicPath = path.join(__dirname, 'public');
app.use('/public', express.static(publicPath));

// === Crear directorios de uploads si no existen ===
const uploadsDir = path.join(__dirname, 'uploads');
const profilesUploadsDir = path.join(uploadsDir, 'profiles');
if (!fs.existsSync(profilesUploadsDir)) {
  fs.mkdirSync(profilesUploadsDir, { recursive: true });
}

// === Servir archivos estáticos de uploads ===

app.use('/uploads', express.static(uploadsDir));

// === CORS dinámico ===
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://frontend-mi-marketplace.onrender.com'
    : 'http://localhost:5173',
  credentials: true
}));

// === Middlewares ===
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// === Rutas API ===
app.use('/api', routes);

// === Servir index.html (fallback SPA) para rutas no-API ===
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));

  // Cualquier ruta que NO empiece con /api|/uploads|/public devuelve index.html
  app.get(/^\/(?!api|uploads|public).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// === Middleware de errores (una sola vez y al final) ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});

// === Levantar servidor ===
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
}

export default app;
