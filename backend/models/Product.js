/* ==========================================================================
   MODELO MONGOOSE: Product
   Consigna Final Sprint 5 y 6 — Mueblería Hermanos Jota
   ========================================================================== */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio.'],
            trim: true
        },
        descripcion: {
            type: String,
            default: '',
            trim: true
        },
        precio: {
            type: Number,
            required: [true, 'El precio del producto es obligatorio.'],
            min: [0, 'El precio no puede ser negativo.']
        },
        stock: {
            type: Number,
            default: 10,
            min: [0, 'El stock no puede ser negativo.']
        },
        imagenUrl: {
            type: String,
            default: ''
        },
        // Campos adicionales para mantener la riqueza visual del catálogo
        categoria: {
            type: String,
            default: 'General'
        },
        imagen: {
            type: String,
            default: ''
        },
        detalles: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                // Asegura compatibilidad entre imagenUrl (consigna) e imagen (UI)
                if (!ret.imagenUrl && ret.imagen) {
                    ret.imagenUrl = ret.imagen;
                }
                if (!ret.imagen && ret.imagenUrl) {
                    ret.imagen = ret.imagenUrl;
                }
                return ret;
            }
        }
    }
);

// Sincronizar imagenUrl e imagen antes de guardar
productSchema.pre('save', function () {
    if (this.imagenUrl && !this.imagen) {
        this.imagen = this.imagenUrl;
    } else if (this.imagen && !this.imagenUrl) {
        this.imagenUrl = this.imagen;
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
