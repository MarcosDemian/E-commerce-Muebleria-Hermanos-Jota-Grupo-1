/* ==========================================================================
   TESTS DE AUTENTICACIÓN (BCRYPT + JWT) Y PEDIDOS — MUEBLERÍA HERMANOS JOTA
   Consigna Final Sprint 7 y 8 — Día 1 (Integrante 1)
   Ejecutar con: npm test (dentro de /backend)
   ========================================================================== */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Order = require('../models/Order');

const testEmail = `test.dia1.${Date.now()}@hermanosjota.com.ar`;
const testPassword = 'PasswordSegura123';
let authToken = null;
let createdUserId = null;
let createdOrderId = null;

beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    await app.connectDB();
});

afterAll(async () => {
    // Limpiar usuario y pedido de prueba de MongoDB Atlas
    if (createdOrderId) {
        await Order.findByIdAndDelete(createdOrderId);
    }
    if (createdUserId) {
        await User.findByIdAndDelete(createdUserId);
    }
    await mongoose.disconnect();
    console.log.mockRestore();
});

describe('Flujo de Autenticación (/api/auth) con bcrypt y JWT', () => {
    test('POST /api/auth/registro crea un usuario con contraseña hasheada y devuelve un JWT (201)', async () => {
        const res = await request(app)
            .post('/api/auth/registro')
            .send({
                nombre: 'Cliente Prueba Día 1',
                email: testEmail,
                password: testPassword
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('usuario');
        expect(res.body.usuario.email).toBe(testEmail);
        expect(res.body.usuario.password).toBeUndefined(); // No debe exponer el hash en JSON

        authToken = res.body.token;
        createdUserId = res.body.usuario._id;

        // Verificar directamente en MongoDB que la contraseña se guardó hasheada con bcrypt
        const userInDb = await User.findById(createdUserId);
        expect(userInDb.password).not.toBe(testPassword);
        expect(userInDb.password).toMatch(/^\$2[aby]\$/); // Prefijo estándar de hash bcrypt
    });

    test('POST /api/auth/registro rechaza un email duplicado con 400', async () => {
        const res = await request(app)
            .post('/api/auth/registro')
            .send({
                nombre: 'Duplicado',
                email: testEmail,
                password: testPassword
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe(true);
    });

    test('POST /api/auth/login valida credenciales y devuelve un JWT (200)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: testPassword
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.usuario.email).toBe(testEmail);
        authToken = res.body.token;
    });

    test('POST /api/auth/login rechaza contraseña incorrecta con 401', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: 'PasswordIncorrecta999'
            });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe(true);
    });

    test('GET /api/auth/perfil sin token devuelve 401 Unauthorized', async () => {
        const res = await request(app).get('/api/auth/perfil');
        expect(res.status).toBe(401);
        expect(res.body.error).toBe(true);
    });

    test('GET /api/auth/perfil con Header Authorization: Bearer <token> devuelve 200 y los datos del usuario', async () => {
        const res = await request(app)
            .get('/api/auth/perfil')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe(testEmail);
        expect(res.body.nombre).toBe('Cliente Prueba Día 1');
    });
});

describe('Flujo de Pedidos Protegidos (/api/pedidos) con JWT', () => {
    test('POST /api/pedidos sin token devuelve 401 Unauthorized', async () => {
        const res = await request(app)
            .post('/api/pedidos')
            .send({
                items: [{ nombre: 'Aparador Uspallata', precio: 890000, cantidad: 1 }]
            });

        expect(res.status).toBe(401);
    });

    test('POST /api/pedidos con JWT crea el pedido asociado al usuario autenticado (201)', async () => {
        const res = await request(app)
            .post('/api/pedidos')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                items: [
                    {
                        nombre: 'Aparador Uspallata',
                        precio: 890000,
                        cantidad: 1,
                        imagen: 'img/aparador-uspallata.png'
                    },
                    {
                        nombre: 'Mesa de Noche Aconcagua',
                        precio: 285000,
                        cantidad: 2,
                        imagen: 'img/mesa-noche-aconcagua.png'
                    }
                ]
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.total).toBe(890000 + 285000 * 2);
        expect(res.body.items).toHaveLength(2);
        expect(res.body.usuario._id).toBe(createdUserId);

        createdOrderId = res.body._id;
    });

    test('GET /api/pedidos/mis-pedidos con JWT devuelve los pedidos del usuario autenticado', async () => {
        const res = await request(app)
            .get('/api/pedidos/mis-pedidos')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0]._id).toBe(createdOrderId);
    });
});
