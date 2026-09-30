/* ==========================================================================
   RUTAS DE LA API DE PRODUCTOS (EXPRESS ROUTER)
   Montado en server.js bajo /api/productos
   ========================================================================== */

const express = require('express');
const router = express.Router();

// Catálogo de productos (array de objetos en archivo .js local)
const productos = require('../data/productos');

// GET /api/productos — Listado completo de productos
router.get('/', (req, res, next) => {
    try {
        // Filtros opcionales por query string (ej: ?categoria=Living&busqueda=mesa)
        const { categoria, busqueda } = req.query;
        let resultado = productos;

        if (categoria) {
            resultado = resultado.filter(p => p.categoria.toLowerCase() === String(categoria).toLowerCase());
        }

        if (busqueda) {
            const q = String(busqueda).toLowerCase();
            resultado = resultado.filter(p =>
                p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)
            );
        }

        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

// GET /api/productos/:id — Obtener producto específico por ID
router.get('/:id', (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'El parámetro ID debe ser un número entero válido.'
            });
        }

        const producto = productos.find(p => p.id === id);

        if (!producto) {
            return res.status(404).json({
                error: true,
                codigo: 404,
                mensaje: `No se encontró ningún producto con el ID ${id}.`
            });
        }

        res.json(producto);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
