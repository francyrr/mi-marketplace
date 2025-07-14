import pg from 'pg';
import dotenv from 'dotenv';


const result = dotenv.config({ path: 'C:\\Users\\Usuario\\Desktop\\Desafio-Latam\\mi-marketplace\\backend\\archivo.env' });


if (result.error) {
  console.error("❌ Error al cargar las variables de entorno:", result.error);
  console.error("Asegúrate de que la ruta especificada en dotenv.config() es correcta y que el archivo existe.");
} else {
  console.log("✅ Variables de entorno cargadas con éxito.");
}


const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE || process.env.DB_NAME, 
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente inactivo de la base de datos', err);
  process.exit(-1);
});

pool.query('SELECT current_database();')
  .then(res => {
    console.log(`✅ ¡Conexión exitosa a la base de datos "${res.rows[0].current_database}" en PostgreSQL!`);
  })
  .catch(err => {
    console.error('❌ Error al verificar la conexión de la base de datos:', err.stack);
    console.error('Verifica que PostgreSQL esté corriendo y que tus credenciales y la base de datos en el archivo .env sean correctas.');
  });

export default pool;