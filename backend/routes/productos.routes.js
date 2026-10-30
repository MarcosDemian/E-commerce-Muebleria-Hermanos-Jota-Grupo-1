/* ==========================================================================
   RUTAS DE LA API DE PRODUCTOS (EXPRESS ROUTER + MONGOOSE CRUD COMPLETO)
   Montado en server.js bajo /api/productos
   Consigna Final Sprint 5 y 6
   ========================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product');

// Helper para validar ObjectId de MongoDB
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1. GET /api/productos — Devuelve todos los productos (con filtros opcionales)
router.get('/', async (req, res, next) => {
    try {
        const { categoria, busqueda } = req.query;
        const filtro = {};

        if (categoria) {
            filtro.categoria = { $regex: new RegExp(`^${String(categoria).trim()}$`, 'i') };
        }

        if (busqueda) {
            const q = String(busqueda).trim();
            filtro.$or = [
                { nombre: { $regex: q, $options: 'i' } },
                { descripcion: { $regex: q, $options: 'i' } }
            ];
        }

        const productos = await Product.find(filtro).sort({ createdAt: 1 });
        res.json(productos);
    } catch (error) {
        next(error);
    }
});

// 2. GET /api/productos/:id — Devuelve un producto por _id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'El parámetro ID no es un ObjectId de MongoDB válido.'
            });
        }

        const producto = await Product.findById(id);

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

// 3. POST /api/productos — Crea un producto nuevo, responde 201
router.post('/', async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, stock, imagenUrl, imagen, categoria, detalles } = req.body;

        const imgFinal = imagenUrl || imagen || 'img/aparador-uspallata.png';

        const nuevoProducto = await Product.create({
            nombre,
            descripcion,
            precio,
            stock: stock !== undefined ? stock : 10,
            imagenUrl: imgFinal,
            imagen: imgFinal,
            categoria: categoria || 'General',
            detalles: detalles || {}
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: Object.values(error.errors).map(e => e.message).join(' ')
            });
        }
        next(error);
    }
});

// 4. PUT /api/productos/:id — Actualiza un producto existente
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'El parámetro ID no es un ObjectId de MongoDB válido.'
            });
        }

        const datosActualizados = { ...req.body };

        // Sincronizar imagenUrl e imagen si se envía alguno de los dos
        if (datosActualizados.imagenUrl && !datosActualizados.imagen) {
            datosActualizados.imagen = datosActualizados.imagenUrl;
        } else if (datosActualizados.imagen && !datosActualizados.imagenUrl) {
            datosActualizados.imagenUrl = datosActualizados.imagen;
        }

        const productoActualizado = await Product.findByIdAndUpdate(
            id,
            datosActualizados,
            { returnDocument: 'after', runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({
                error: true,
                codigo: 404,
                mensaje: `No se encontró ningún producto con el ID ${id} para actualizar.`
            });
        }

        res.json(productoActualizado);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: Object.values(error.errors).map(e => e.message).join(' ')
            });
        }
        next(error);
    }
});

// 5. DELETE /api/productos/:id — Elimina un producto existente
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'El parámetro ID no es un ObjectId de MongoDB válido.'
            });
        }

        const productoEliminado = await Product.findByIdAndDelete(id);

        if (!productoEliminado) {
            return res.status(404).json({
                error: true,
                codigo: 404,
                mensaje: `No se encontró ningún producto con el ID ${id} para eliminar.`
            });
        }

        res.json({
            mensaje: 'Producto eliminado correctamente.',
            producto: productoEliminado
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
