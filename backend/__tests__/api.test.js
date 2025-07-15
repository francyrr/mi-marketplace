import request from 'supertest';
import app from '../server.js';
import pool from '../config/db.js';

describe('Pruebas de API Marketplace', () => {
  let token;

  beforeAll(async () => {

    const login = await request(app)
      .post('/api/login')
      .send({
        email: 'techcorp@example.com',
        password: 'password123'
      })
      .expect(200);

    token = login.body.token;
  });

  afterAll(async () => {
    await pool.end();
  });

  it('GET /api/productos devuelve lista de productos', async () => {
    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/crear-publicacion crea un producto', async () => {
    const nuevoProducto = {
      nombre: 'Test Supertest',
      descripcion: 'Prueba jest supertest',
      precio: 99.99,
      imagen: 'test.jpg',
      categoria: 'Test',
      ubicacion: 'Testville',
      lat: -33.4,
      lng: -70.6
    };

    const res = await request(app)
      .post('/api/crear-publicacion')
      .set('Authorization', `Bearer ${token}`)
      .send(nuevoProducto)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe('Test Supertest');
  });

  it('GET /api/mis-favoritos devuelve favoritos vacíos o con items', async () => {
    const res = await request(app)
      .get('/api/mis-favoritos')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/login con credenciales inválidas devuelve 401', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'invalido@example.com',
        password: 'malpassword'
      })
      .expect(401);
  });
});
