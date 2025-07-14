import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST /upload
router.post('/upload', upload.single('imagen'), (req, res) => {
  try {
    console.log("Archivo recibido:", req.file);
    res.json({ 
      mensaje: 'Imagen subida con éxito',
      filename: req.file.filename 
    });
  } catch (err) {
    console.error('Error al subir imagen:', err);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

export default router;
