/* ==========================================================================
   TESTS DE LA API CRUD CON MONGODB — MUEBLERÍA HERMANOS JOTA
   Se ejecutan con:  npm test   (dentro de /backend)
   ========================================================================== */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    await app.connectDB();
});

afterAll(async () => {
    await mongoose.disconnect();
    console.log.mockRestore();
});

describe('API CRUD /api/productos (MongoDB + Mongoose)', () => {
    let productoCreadoId = null;

    test('GET /api/productos devuelve 200 y el listado de productos desde MongoDB', async () => {
        const res = await request(app).get('/api/productos');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(11);
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('nombre');
        expect(res.body[0]).toHaveProperty('precio');
    });

    test('POST /api/productos crea un producto en MongoDB y responde 201', async () => {
        const nuevo = {
            nombre: 'Banqueta Test CRUD',
            descripcion: 'Banqueta de prueba para test automatizado',
            precio: 150000,
            stock: 5,
            imagenUrl: 'img/butaca-mendoza.png',
            categoria: 'Living'
        };

        const res = await request(app)
            .post('/api/productos')
            .send(nuevo);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.nombre).toBe(nuevo.nombre);
        expect(res.body.precio).toBe(nuevo.precio);
        expect(res.body.stock).toBe(5);
        expect(res.body.imagenUrl).toBe(nuevo.imagenUrl);

        productoCreadoId = res.body._id;
    });

    test('GET /api/productos/:id devuelve 200 y el producto por su _id', async () => {
        const res = await request(app).get(`/api/productos/${productoCreadoId}`);

        expect(res.status).toBe(200);
        expect(res.body._id).toBe(productoCreadoId);
        expect(res.body.nombre).toBe('Banqueta Test CRUD');
    });

    test('PUT /api/productos/:id actualiza el producto existente', async () => {
        const res = await request(app)
            .put(`/api/productos/${productoCreadoId}`)
            .send({ precio: 175000, stock: 8 });

        expect(res.status).toBe(200);
        expect(res.body._id).toBe(productoCreadoId);
        expect(res.body.precio).toBe(175000);
        expect(res.body.stock).toBe(8);
    });

    test('DELETE /api/productos/:id elimina el producto y luego GET devuelve 404', async () => {
        const delRes = await request(app).delete(`/api/productos/${productoCreadoId}`);
        expect(delRes.status).toBe(200);

        const getRes = await request(app).get(`/api/productos/${productoCreadoId}`);
        expect(getRes.status).toBe(404);
    });

    test('GET /api/productos/:id con ID inválido devuelve 400', async () => {
        const res = await request(app).get('/api/productos/id-invalido');
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(true);
    });

    test('POST /api/productos sin nombre o precio requerido devuelve 400', async () => {
        const res = await request(app)
            .post('/api/productos')
            .send({ descripcion: 'Sin nombre ni precio' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe(true);
    });
});
