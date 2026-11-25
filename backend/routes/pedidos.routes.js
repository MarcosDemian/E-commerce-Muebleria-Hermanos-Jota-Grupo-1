/* ==========================================================================
   RUTAS DE PEDIDOS (PROTEGIDAS CON JWT)
   Montado en server.js bajo /api/pedidos
   Consigna Final Sprint 7 y 8 — Día 1 (Integrante 1)
   ========================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Order = require('../models/Order');
const authMiddleware = require('../middlewares/auth');

// Todas las rutas de pedidos requieren usuario autenticado (Header Authorization: Bearer <token>)
router.use(authMiddleware);

// 1. POST /api/pedidos — Crea un nuevo pedido asociado al usuario del JWT
router.post('/', async (req, res, next) => {
    try {
        const rawItems = req.body.items || req.body.productos || req.body.cart || [];

        if (!Array.isArray(rawItems) || rawItems.length === 0) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'El pedido debe incluir al menos un producto en "items".'
            });
        }

        // Normalizar items provenientes del carrito del frontend
        const itemsNormalizados = rawItems.map((item) => {
            const rawProdId = item.producto || item._id || item.id;
            const productoObjId =
                rawProdId && mongoose.Types.ObjectId.isValid(String(rawProdId))
                    ? rawProdId
                    : undefined;

            return {
                ...(productoObjId ? { producto: productoObjId } : {}),
                nombre: item.nombre || 'Producto Hermanos Jota',
                precio: Number(item.precio) || 0,
                cantidad: Number(item.cantidad || item.quantity) || 1,
                imagen: item.imagen || item.imagenUrl || ''
            };
        });

        const totalCalculado = itemsNormalizados.reduce(
            (acc, item) => acc + item.precio * item.cantidad,
            0
        );

        const totalFinal =
            req.body.total !== undefined && !Number.isNaN(Number(req.body.total))
                ? Number(req.body.total)
                : totalCalculado;

        const nuevoPedido = await Order.create({
            usuario: req.user.id,
            items: itemsNormalizados,
            total: totalFinal,
            direccionEnvio: req.body.direccionEnvio || '',
            notas: req.body.notas || ''
        });

        await nuevoPedido.populate('usuario', 'nombre email');

        res.status(201).json(nuevoPedido);
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

// Handler compartido para obtener los pedidos del usuario autenticado
const listarMisPedidos = async (req, res, next) => {
    try {
        const pedidos = await Order.find({ usuario: req.user.id })
            .populate('usuario', 'nombre email')
            .sort({ createdAt: -1 });

        res.json(pedidos);
    } catch (error) {
        next(error);
    }
};

// 2. GET /api/pedidos y GET /api/pedidos/mis-pedidos — Lista los pedidos del usuario logueado
router.get('/', listarMisPedidos);
router.get('/mis-pedidos', listarMisPedidos);

// 3. GET /api/pedidos/:id — Obtiene el detalle de un pedido específico del usuario logueado
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'El ID del pedido no es válido.'
            });
        }

        const pedido = await Order.findOne({
            _id: id,
            usuario: req.user.id
        }).populate('usuario', 'nombre email');

        if (!pedido) {
            return res.status(404).json({
                error: true,
                codigo: 404,
                mensaje: 'Pedido no encontrado o no pertenece al usuario actual.'
            });
        }

        res.json(pedido);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
