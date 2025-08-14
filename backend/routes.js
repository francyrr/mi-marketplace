import express from 'express';
import pool from './config/db.js';
import multer from "multer";
import path from "path";
import { registerUser, loginUser, updateProfile, getMisPublicaciones } from './controllers/authController.js'; 
import { protect } from './middleware/authMiddleware.js';

const router = express.Router();
const profileStorage = multer.diskStorage({
    destination: "./uploads/profiles",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadProfile = multer({ storage: profileStorage });

// Ruta para subir foto de perfil
router.post("/upload-profile", uploadProfile.single("profileImage"), protect, async (req, res) => {
    const imagePath = `/uploads/profiles/${req.file.filename}`;

    try {
        await pool.query(
            `UPDATE "user" SET profile_image = $1 WHERE id = $2`,
            [imagePath, req.user.id]
        );
        res.json({ mensaje: "Foto de perfil actualizada", imagePath });
    } catch (error) {
        console.error("Error actualizando foto de perfil:", error);
        res.status(500).json({ error: "Error actualizando foto de perfil" });
    }
});

// --- Configuración de Multer para imágenes de PRODUCTOS ---
const productStorage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadProduct = multer({ storage: productStorage });

// Ruta para subir imágenes de productos
router.post('/upload', uploadProduct.single('imagen'), protect, (req, res) => {
    if (req.file) {
        res.json({ filename: req.file.filename });
    } else {
        res.status(400).json({ error: "No se encontró el archivo de imagen." });
    }
});

router.post('/registro', registerUser);
router.post('/login', loginUser);
router.put('/editar-perfil', protect, updateProfile);
router.get('/profile', protect, (req, res) => {
    res.json({ usuario: { ...req.user, id: req.user.id } });
});

router.get('/mis-publicaciones', protect, getMisPublicaciones); 

// --- Rutas para PRODUCTOS ---
// Obtener todos los productos
router.get('/productos', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, nombre, descripcion, precio, imagen, categoria, ubicacion, vendedor_id, calificacion, vendidos, created_at, lat, lng
             FROM product`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener la lista de productos" });
    }
});

// Obtener un producto por ID con datos del vendedor
router.get('/productos/:id', protect, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT
                p.id,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen,
                p.calificacion,
                p.vendidos,
                p.categoria,
                p.ubicacion,
                p.lat,
                p.lng,
                p.vendedor_id,
                p.created_at,
                u.name AS nombre_vendedor,
                u.email AS email_vendedor,
                u.phone AS telefono_vendedor
               FROM product p
               JOIN "user" u ON p.vendedor_id = u.id
               WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener el detalle del producto:", error);
        res.status(500).json({ error: "Error al cargar el producto." });
    }
});


// Ruta para crear una nueva publicación (producto)
router.post('/crear-publicacion', protect, async (req, res) => {
    const { nombre, descripcion, precio, imagen, categoria, ubicacion, lat, lng } = req.body;
    const vendedor_id = req.user.id; 
    try {
        const result = await pool.query(
            `INSERT INTO product (nombre, descripcion, precio, imagen, categoria, ubicacion, vendedor_id, lat, lng)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [nombre, descripcion, precio, imagen, categoria, ubicacion, vendedor_id, lat, lng]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error al crear publicación:", error);
        res.status(500).json({ error: "Error al crear la publicación" });
    }
});

// Ruta para actualizar una publicación existente
router.put('/actualizar-publicacion/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen, categoria, ubicacion, lat, lng } = req.body;
    const user_id = req.user.id; // El ID del usuario que intenta actualizar

    try {
        // Verificar que el producto existe y que el usuario es el vendedor
        const productResult = await pool.query(`SELECT vendedor_id FROM product WHERE id = $1`, [id]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: "Publicación no encontrada." });
        }

        if (productResult.rows[0].vendedor_id !== user_id) {
            return res.status(403).json({ error: "No tienes permiso para actualizar esta publicación." });
        }

        const updateResult = await pool.query(
            `UPDATE product
             SET nombre = $1, descripcion = $2, precio = $3, imagen = $4, categoria = $5, ubicacion = $6, lat = $7, lng = $8
             WHERE id = $9
             RETURNING *`,
            [nombre, descripcion, precio, imagen, categoria, ubicacion, lat, lng, id]
        );

        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error("Error al actualizar publicación:", error);
        res.status(500).json({ error: "Error al actualizar la publicación." });
    }
});


// Ruta para eliminar una publicación
router.delete('/eliminar-publicacion/:id', protect, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id; // El ID del usuario que intenta eliminar

    try {
        
        const productResult = await pool.query(`SELECT vendedor_id FROM product WHERE id = $1`, [id]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: "Publicación no encontrada." });
        }

        if (productResult.rows[0].vendedor_id !== user_id) {
            return res.status(403).json({ error: "No tienes permiso para eliminar esta publicación." });
        }

        await pool.query(`DELETE FROM product WHERE id = $1`, [id]);
        res.json({ mensaje: "Publicación eliminada exitosamente." });
    } catch (error) {
        console.error("Error al eliminar publicación:", error);
        res.status(500).json({ error: "Error al eliminar la publicación." });
    }
});

// --- Rutas de Favoritos ---
// Añadir un producto a favoritos
router.post('/favoritos', protect, async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;
    try {
        await pool.query(`
            INSERT INTO favorito (user_id, product_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, product_id) DO NOTHING
        `, [user_id, product_id]);
        res.json({ mensaje: "Agregado a favoritos" });
    } catch (err) {
        console.error("Error agregando favorito:", err);
        res.status(500).json({ error: "No se pudo agregar favorito" });
    }
});

// Eliminar un producto de favoritos
router.delete('/favoritos/:product_id', protect, async (req, res) => {
    const { product_id } = req.params;
    const user_id = req.user.id;
    try {
        await pool.query(`
            DELETE FROM favorito
            WHERE user_id = $1 AND product_id = $2
        `, [user_id, product_id]);
        res.json({ mensaje: "Eliminado de favoritos" });
    } catch (err) {
        console.error("Error eliminando favorito:", err);
        res.status(500).json({ error: "No se pudo eliminar favorito" });
    }
});

// Obtener la lista de favoritos del usuario
router.get('/mis-favoritos', protect, async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(`
            SELECT p.* FROM product p
            JOIN favorito f ON p.id = f.product_id
            WHERE f.user_id = $1
        `, [user_id]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error obteniendo favoritos:", err);
        res.status(500).json({ error: "No se pudieron obtener los favoritos" });
    }
});

export default router;