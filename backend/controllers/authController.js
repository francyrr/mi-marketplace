import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const generateToken = (id, name, email, phone, profile_image) => {
    return jwt.sign(
        { id, name, email, phone, profile_image },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'Por favor, completa todos los campos requeridos.' });
    }

    try {
        const userExists = await pool.query('SELECT id FROM "user" WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            `INSERT INTO "user" (name, email, password, phone)
             VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, profile_image`, 
            [name, email, hashedPassword, phone]
        );

        const newUser = result.rows[0];
        const token = generateToken(
            newUser.id,
            newUser.name,
            newUser.email,
            newUser.phone,
            newUser.profile_image
        );

        res.status(201).json({
            message: 'Registro exitoso.',
            token,
            usuario: { 
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                profile_image: newUser.profile_image
            }
        });

    } catch (error) {
        console.error('Error en el registro de usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const token = generateToken(
            user.id,
            user.name,
            user.email,
            user.phone,
            user.profile_image
        );

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            usuario: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profile_image: user.profile_image
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
};


export const updateProfile = async (req, res) => {
    const { name, email, phone } = req.body;
    const userId = req.user.id; 

    try {
        if (email) {
            const emailExists = await pool.query(
                'SELECT id FROM "user" WHERE email = $1 AND id != $2',
                [email, userId]
            );
            if (emailExists.rows.length > 0) {
                return res.status(400).json({ message: 'El nuevo email ya está registrado por otro usuario.' });
            }
        }

        let query = 'UPDATE "user" SET ';
        const params = [];
        const updates = [];
        let paramIndex = 1;

        if (name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            params.push(name);
        }
        if (email !== undefined) {
            updates.push(`email = $${paramIndex++}`);
            params.push(email);
        }
        if (phone !== undefined) {
            updates.push(`phone = $${paramIndex++}`);
            params.push(phone);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar.' });
        }

        query += updates.join(', ') + ` WHERE id = $${paramIndex} RETURNING id, name, email, phone, profile_image`;
        params.push(userId);

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const updatedUser = result.rows[0];
        res.status(200).json({
            message: 'Perfil actualizado exitosamente.',
            usuario: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profile_image: updatedUser.profile_image
            }
        });

    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el perfil.' });
    }
};

export const getMisPublicaciones = async (req, res) => {
    try {
        const userId = req.user.id; 

        const result = await pool.query(
            'SELECT * FROM product WHERE vendedor_id = $1 ORDER BY created_at DESC', 
            [userId]
        );

        res.json(result.rows); 

    } catch (error) {
        console.error("Error en authController al obtener mis publicaciones:", error, error.stack);
        res.status(500).json({ message: "Error interno del servidor al obtener tus publicaciones." });
    }
};