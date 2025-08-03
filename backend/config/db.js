import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Solo carga el archivo .env en desarrollo o test
if (process.env.NODE_ENV !== 'production') {
  const envPath = process.env.NODE_ENV === 'test'
    ? path.resolve('backend', '.env.test')
    : path.resolve('backend','.env');

  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error("❌ Error al cargar el archivo .env:", result.error);
    console.error(`Verifica que exista el archivo en: ${envPath}`);
    process.exit(1);
  } else {
    console.log(`✅ Variables de entorno cargadas desde: ${envPath}`);
  }
} else {
  console.log("🌐 Producción: usando variables de entorno de Render");
}

// Protección en test para no usar DB de desarrollo
if (process.env.NODE_ENV === 'test' && process.env.DB_DATABASE === 'mi_marketplace') {
  console.error("🚨 Estás en NODE_ENV=test pero tu DB apunta a la base de desarrollo. ¡Abortando!");
  process.exit(1);
}

const { Pool } = pg;

// Configuración de conexión
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE || process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false // Necesario en Render
});

// Manejo de errores
pool.on('error', (err) => {
  console.error('❌ Error inesperado en el cliente inactivo de la base de datos:', err);
  process.exit(-1);
});

// Verificación de conexión
pool.query('SELECT current_database();')
  .then(res => {
    console.log(`✅ ¡Conexión exitosa a la base de datos "${res.rows[0].current_database}" en PostgreSQL!`);
  })
  .catch(err => {
    console.error('❌ Error al verificar la conexión de la base de datos:', err.stack);
    console.error('Verifica que PostgreSQL esté corriendo y que las credenciales sean correctas.');
    process.exit(1);
  });

export default pool;
