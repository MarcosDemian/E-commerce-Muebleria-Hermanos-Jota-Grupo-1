/* ==========================================================================
   MODELO MONGOOSE: Order (Pedido vinculado al Usuario autenticado)
   Consigna Final Sprint 7 y 8 — Día 1 (Integrante 1)
   ========================================================================== */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: false
        },
        nombre: {
            type: String,
            required: [true, 'El nombre del producto en el pedido es obligatorio.'],
            trim: true
        },
        precio: {
            type: Number,
            required: [true, 'El precio unitario del producto es obligatorio.'],
            min: [0, 'El precio no puede ser negativo.']
        },
        cantidad: {
            type: Number,
            required: [true, 'La cantidad es obligatoria.'],
            min: [1, 'La cantidad debe ser al menos 1.'],
            default: 1
        },
        imagen: {
            type: String,
            default: ''
        }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El pedido debe estar asociado a un usuario autenticado.']
        },
        items: {
            type: [orderItemSchema],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: 'El pedido debe contener al menos un producto.'
            }
        },
        total: {
            type: Number,
            required: [true, 'El total del pedido es obligatorio.'],
            min: [0, 'El total no puede ser negativo.']
        },
        estado: {
            type: String,
            enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
            default: 'confirmado'
        },
        direccionEnvio: {
            type: String,
            default: '',
            trim: true
        },
        notas: {
            type: String,
            default: '',
            trim: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.__v;
                return ret;
            }
        }
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
