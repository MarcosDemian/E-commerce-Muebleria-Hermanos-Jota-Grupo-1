/* ==========================================================================
   SERVIDOR PRINCIPAL BACKEND — MUEBLERÍA HERMANOS JOTA
   Consigna Final Sprint 5 y 6 (Persistencia MongoDB + CRUD Completo)
   ========================================================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const productosRoutes = require('./routes/productos.routes');
const Product = require('./models/Product');
const productosIniciales = require('./data/productos');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middlewares globales
app.use(logger);          // 1° logging: registra método y URL de TODA petición
app.use(cors());          // permite que el frontend React (otro puerto) consuma la API
app.use(express.json());  // parsea body JSON (para peticiones POST / PUT)

// Ruta base de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: '🛍️ API REST Mueblería Hermanos Jota activa (MongoDB + Mongoose)',
        version: '2.0.0',
        endpoints: {
            productos: '/api/productos',
            productoPorId: '/api/productos/:id'
        }
    });
});

// Rutas de API
app.use('/api/productos', productosRoutes);

// Manejo de errores 404 y 500
app.use(notFoundHandler);
app.use(errorHandler);

// Función para conectar a MongoDB y poblar catálogo inicial si está vacío
async function connectDB() {
    if (!MONGODB_URI) {
        console.error('❌ Error: MONGODB_URI no está definida en las variables de entorno (.env).');
        process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado exitosamente a MongoDB Atlas');

    // Si la colección está vacía, cargamos el catálogo inicial automáticamente
    const count = await Product.countDocuments();
    if (count === 0) {
        const docs = productosIniciales.map(({ id, ...item }) => ({
            nombre: item.nombre,
            descripcion: item.descripcion,
            precio: item.precio,
            stock: item.stock ?? 10,
            imagenUrl: item.imagenUrl || item.imagen,
            imagen: item.imagen || item.imagenUrl,
            categoria: item.categoria || 'General',
            detalles: item.detalles || {}
        }));
        await Product.insertMany(docs);
        console.log(`🌱 Catálogo inicial cargado automáticamente (${docs.length} productos).`);
    }
}

// Iniciar servidor solo si se ejecuta directamente (`node server.js`).
if (require.main === module) {
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`===========================================================`);
                console.log(` Servidor Hermanos Jota funcionando en http://localhost:${PORT}`);
                console.log(` Endpoint Productos: http://localhost:${PORT}/api/productos`);
                console.log(`===========================================================`);
            });
        })
        .catch((err) => {
            console.error('❌ Error al conectar con MongoDB:', err.message);
            process.exit(1);
        });
}

app.connectDB = connectDB;
module.exports = app;
