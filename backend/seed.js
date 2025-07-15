// backend/seed.js

import pool from './config/db.js';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });


const productosIniciales = [
    {
        nombre: 'Smartphone Avanzado',
        precio: 699.99,
        descripcion: 'El último modelo con cámara de alta resolución. Con una pantalla OLED vibrante y un sistema de triple cámara profesional, captura cada momento con una claridad impresionante. Batería de larga duración y procesador ultrarrápido para todas tus necesidades.',
        imagen: '/public/assets/img/celular.jpg',
        vendedorNombre: 'TechCorp',
        ubicacion: 'Santiago Centro',
        lat: -33.4411,
        lng: -70.6502,
        calificacion: 4.8,
        vendidos: 150,
        categoria: 'Electrónica',
    },
    {
        nombre: 'Auriculares Inalámbricos',
        precio: 99.99,
        descripcion: 'Sonido envolvente y cancelación de ruido activa para una experiencia auditiva inmersiva. Ligeros y cómodos, ideales para largas sesiones de escucha o llamadas. Conexión Bluetooth 5.2 estable y hasta 20 horas de batería.',
        imagen: '/public/assets/img/auriculares.jpg',
        vendedorNombre: "Tuyos Accesorios",
        ubicacion: 'Providencia',
        lat: -33.4208,
        lng: -70.6120,
        calificacion: 4.5,
        vendidos: 300,
        categoria: 'Electrónica',
    },
    {
        nombre: 'Libro de Cocina',
        precio: 25.00,
        descripcion: 'Recetas saludables y deliciosas inspiradas en la dieta mediterránea. Desde platos sencillos para el día a día hasta preparaciones más elaboradas para ocasiones especiales. Incluye consejos nutricionales y maridajes de vino.',
        imagen: '/public/assets/img/libro.jpg',
        vendedorNombre: 'LibrosYa',
        ubicacion: 'Las Condes',
        lat: -33.4079,
        lng: -70.5694,
        calificacion: 4.9,
        vendidos: 80,
        categoria: 'Libros',
    },
    {
        nombre: 'Reloj Inteligente Deportivo',
        precio: 199.99,
        descripcion: 'Monitorea tu actividad física y ritmo cardíaco con precisión. GPS integrado, resistencia al agua y modos deportivos para cada tipo de ejercicio. Recibe notificaciones de tu smartphone directamente en tu muñeca.',
        imagen: '/public/assets/img/reloj.jpg',
        vendedorNombre: 'FitGadgets',
        ubicacion: 'Ñuñoa',
        lat: -33.4600,
        lng: -70.6272,
        calificacion: 4.7,
        vendidos: 200,
        categoria: 'Electrónica',
    },
    {
        nombre: 'Cafetera Espresso Manual',
        precio: 120.00,
        descripcion: 'Prepara café como un barista profesional desde la comodidad de tu hogar. Diseño elegante y compacto, fácil de usar y limpiar. Compatible con café molido y cápsulas ESE. Disfruta de un espresso perfecto cada mañana.',
        imagen: '/public/assets/img/cafetera.jpg',
        vendedorNombre: 'CoffeeLovers',
        ubicacion: 'Vitacura',
        lat: -33.3986,
        lng: -70.5840,
        calificacion: 4.6,
        vendidos: 70,
        categoria: 'Hogar',
    },
    {
        nombre: 'Mochila Urbana Resistente',
        precio: 45.00,
        descripcion: 'Ideal para el día a día y tus viajes cortos. Fabricada con materiales repelentes al agua y costuras reforzadas. Múltiples compartimentos para laptop, tablet y accesorios. Diseño ergonómico para mayor comodidad.',
        imagen: '/public/assets/img/mochila.jpg',
        vendedorNombre: 'UrbanGear',
        ubicacion: 'Recoleta',
        lat: -33.4143,
        lng: -70.6477,
        calificacion: 4.4,
        vendidos: 180,
        categoria: 'Accesorios',
    },
    {
        nombre: 'Teclado Mecánico RGB',
        precio: 110.00,
        descripcion: 'Para gamers y programadores, con iluminación personalizable en millones de colores. Switches mecánicos de alta durabilidad para una respuesta táctil y sonora óptima. Teclas programables y software intuitivo.',
        imagen: '/public/assets/img/teclado.jpg',
        vendedorNombre: 'GameZone',
        ubicacion: 'Maipú',
        lat: -33.5135,
        lng: -70.7547,
        calificacion: 4.7,
        vendidos: 120,
        categoria: 'Electrónica',
    },
    {
        nombre: 'Set de Pinturas Acrílicas',
        precio: 35.00,
        descripcion: '24 colores vibrantes para tus obras de arte. Fórmulas de alta pigmentación que ofrecen una cobertura excelente y secado rápido. Ideales para lienzo, madera, papel y otras superficies. No tóxicas y fáciles de mezclar.',
        imagen: '/public/assets/img/pinturas.jpg',
        vendedorNombre: 'ArtSupplies',
        ubicacion: 'Providencia',
        lat: -33.4208,
        lng: -70.6120,
        calificacion: 4.8,
        vendidos: 60,
        categoria: 'Arte y Papelería',
        
    },
];

const usuariosIniciales = [
    { name: 'TechCorp', email: 'techcorp@example.com', password: 'password123', phone: '56911111111' },
    { name: 'Tuyos Accesorios', email: 'tuyos@example.com', password: 'password123', phone: '56987654321' },
    { name: 'LibrosYa', email: 'librosya@example.com', password: 'password123', phone: '56911223344' },
    { name: 'FitGadgets', email: 'fit@example.com', password: 'password123', phone: '56955667788' },
    { name: 'CoffeeLovers', email: 'coffee@example.com', password: 'password123', phone: '56998877665' },
    { name: 'UrbanGear', email: 'urban@example.com', password: 'password123', phone: '56944332211' },
    { name: 'GameZone', email: 'gamezone@example.com', password: 'password123', phone: '56977889900' },
    { name: 'ArtSupplies', email: 'artsupplies@example.com', password: 'password123', phone: '56910203040' },
];

async function seedDatabase() {
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN'); 

        // 1. Limpiar tablas 
        console.log('Limpiando tablas "product" y "user"...');
        await client.query('DELETE FROM product'); 
        await client.query('DELETE FROM "user"'); 
        console.log('Tablas limpiadas.');

        // 2. Insertar Usuarios
        const insertedUsers = {};
        for (const user of usuariosIniciales) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const result = await client.query(
                'INSERT INTO "user" (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name',
                [user.name, user.email, hashedPassword, user.phone]
            );
            insertedUsers[result.rows[0].name] = result.rows[0].id;
            console.log(`Usuario '${result.rows[0].name}' insertado con ID: ${result.rows[0].id}`);
        }

        // 3. Insertar Productos
        for (const product of productosIniciales) {
            const vendedorId = insertedUsers[product.vendedorNombre];
            if (!vendedorId) {
                console.warn(`Advertencia: No se encontró un usuario para el vendedor "${product.vendedorNombre}". Saltando producto: "${product.nombre}"`);
                continue;
            }

            await client.query(
                `INSERT INTO product (
                    nombre, descripcion, precio, imagen, vendedor_id, ubicacion, lat, lng,
                    calificacion, vendidos, categoria
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, 
                [
                    product.nombre,
                    product.descripcion,
                    product.precio,
                    product.imagen,
                    vendedorId,
                    product.ubicacion,
                    product.lat,
                    product.lng,
                    product.calificacion,
                    product.vendidos,
                    product.categoria
                    
                ]
            );
            console.log(`Producto '${product.nombre}' insertado.`);
        }

        await client.query('COMMIT'); 
        console.log(' ¡Base de datos sembrada exitosamente con datos de prueba!');

    } catch (error) {
        if (client) {
            await client.query('ROLLBACK'); 
        }
        console.error(' Error al sembrar la base de datos:', error.message);
        process.exit(1); 
    } finally {
        if (client) {
            client.release(); 
        }
        
    }
}


seedDatabase();