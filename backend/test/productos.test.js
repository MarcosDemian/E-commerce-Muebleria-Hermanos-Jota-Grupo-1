/* ==========================================================================
   TESTS DE LA API — MUEBLERÍA HERMANOS JOTA
   Se ejecutan con:  npm test   (dentro de /backend)
   Supertest llama a la app de Express directamente, sin abrir ningún puerto,
   así que NO hace falta tener el servidor corriendo.
   ========================================================================== */

const request = require('supertest');
const app = require('../server');
const productos = require('../data/productos');

// El logger imprime cada petición; lo silenciamos para que la salida de los tests sea legible
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
    console.log.mockRestore();
});

describe('GET /api/productos', () => {
    test('devuelve 200 y el listado completo en JSON', async () => {
        const res = await request(app).get('/api/productos');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(productos.length);
    });

    test('cada producto tiene los campos esperados', async () => {
        const res = await request(app).get('/api/productos');

        res.body.forEach(p => {
            expect(p).toEqual(expect.objectContaining({
                id: expect.any(Number),
                nombre: expect.any(String),
                categoria: expect.any(String),
                precio: expect.any(Number),
                imagen: expect.any(String),
                descripcion: expect.any(String)
            }));
        });
    });

    test('los ids son únicos', async () => {
        const res = await request(app).get('/api/productos');
        const ids = res.body.map(p => p.id);

        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe('GET /api/productos — filtros', () => {
    test('?categoria filtra por categoría', async () => {
        const res = await request(app).get('/api/productos?categoria=Living');

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        res.body.forEach(p => expect(p.categoria).toBe('Living'));
    });

    test('?categoria no distingue mayúsculas de minúsculas', async () => {
        const a = await request(app).get('/api/productos?categoria=living');
        const b = await request(app).get('/api/productos?categoria=LIVING');

        expect(a.body.length).toBeGreaterThan(0);
        expect(a.body).toEqual(b.body);
    });

    test('?busqueda filtra por nombre o descripción', async () => {
        const res = await request(app).get('/api/productos?busqueda=mesa');

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        res.body.forEach(p => {
            const texto = `${p.nombre} ${p.descripcion}`.toLowerCase();
            expect(texto).toContain('mesa');
        });
    });

    test('categoria y busqueda se pueden combinar', async () => {
        const res = await request(app).get('/api/productos?categoria=Comedor&busqueda=mesa');

        expect(res.status).toBe(200);
        res.body.forEach(p => expect(p.categoria).toBe('Comedor'));
    });

    test('una categoría inexistente devuelve un array vacío (no un error)', async () => {
        const res = await request(app).get('/api/productos?categoria=Inexistente');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('GET /api/productos/:id', () => {
    test('devuelve 200 y el producto pedido', async () => {
        const res = await request(app).get('/api/productos/3');

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(3);
        expect(res.body.nombre).toBe('Butaca Mendoza');
        expect(res.body.detalles).toBeDefined();
    });

    test('devuelve 404 en JSON si el producto no existe', async () => {
        const res = await request(app).get('/api/productos/999');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            error: true,
            codigo: 404,
            mensaje: expect.stringContaining('999')
        });
    });

    test.each(['abc', '1.5'])('devuelve 400 si el id no es un entero ("%s")', async (id) => {
        const res = await request(app).get(`/api/productos/${id}`);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe(true);
        expect(res.body.codigo).toBe(400);
    });
});

describe('Manejo de errores y rutas', () => {
    test('una ruta inexistente devuelve 404 en JSON', async () => {
        const res = await request(app).get('/api/nada');

        expect(res.status).toBe(404);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.error).toBe(true);
        expect(res.body.mensaje).toContain('/api/nada');
    });

    test('un JSON mal formado en el body devuelve 400 (express.json + errorHandler)', async () => {
        const res = await request(app)
            .post('/api/productos')
            .set('Content-Type', 'application/json')
            .send('{ esto no es json');

        expect(res.status).toBe(400);
        expect(res.body.error).toBe(true);
        expect(res.body.mensaje).toMatch(/JSON/);
    });

    test('la ruta raíz responde con la información de la API', async () => {
        const res = await request(app).get('/');

        expect(res.status).toBe(200);
        expect(res.body.endpoints).toBeDefined();
    });
});

describe('Middleware logger', () => {
    test('registra el método y la URL de cada petición', async () => {
        await request(app).get('/api/productos/1');

        const llamadas = console.log.mock.calls.map(c => c[0]).join('\n');
        expect(llamadas).toContain('GET -> /api/productos/1');
    });
});