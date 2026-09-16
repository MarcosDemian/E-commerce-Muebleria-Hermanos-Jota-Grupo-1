/* ==========================================================================
   RUTAS DE LA API DE PRODUCTOS (EXPRESS ROUTER)
   ========================================================================== */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Cargar catálogo de productos desde el archivo JSON
const productosPath = path.join(__dirname, '../data/productos.json');

const obtenerProductos = () => {
    const data = fs.readFileSync(productosPath, 'utf-8');
    return JSON.parse(data);
};

// GET /api/productos — Listado completo de productos
router.get('/', (req, res, next) => {
    try {
        const productos = obtenerProductos();
        
        // Filtro opcional por categoría si viene por query string (ej: ?categoria=Living)
        const { categoria, busqueda } = req.query;
        let resultado = productos;

        if (categoria) {
            resultado = resultado.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
        }

        if (busqueda) {
            const q = busqueda.toLowerCase();
            resultado = resultado.filter(p => p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q));
        }

        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

// GET /api/productos/:id — Obtener producto específico por ID
router.get('/:id', (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'El parámetro ID debe ser un número entero válido.'
            });
        }

        const productos = obtenerProductos();
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
