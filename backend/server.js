import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import routes from './routes.js';


const app = express();

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir);
}

const profilesUploadsDir = path.resolve('uploads/profiles');
if (!fs.existsSync(profilesUploadsDir)){
  fs.mkdirSync(profilesUploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
app.use('/uploads/profiles', express.static(profilesUploadsDir));

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
export default app;