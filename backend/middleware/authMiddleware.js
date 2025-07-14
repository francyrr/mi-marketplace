import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const result = await pool.query(
                `SELECT id, name, email, phone, profile_image FROM "user" WHERE id = $1`, 
                [decoded.id]
            );
            
            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'No autorizado, usuario no encontrado (token válido, pero user_id no existe).' });
            }

            req.user = result.rows[0]; 
            next();
        } catch (error) {
            console.error('Token inválido o expirado:', error.message);
            res.status(401).json({ message: 'No autorizado, token fallido o expirado.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no se proporcionó token.' });
    }
};