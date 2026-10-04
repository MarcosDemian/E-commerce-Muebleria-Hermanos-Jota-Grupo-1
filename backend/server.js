/* ==========================================================================
   SERVIDOR PRINCIPAL BACKEND — MUEBLERÍA HERMANOS JOTA
   Consigna Final Sprint 3 y 4 (ITBA)
   ========================================================================== */

const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const productosRoutes = require('./routes/productos.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(logger);          // 1° logging: registra método y URL de TODA petición
app.use(cors());          // permite que el frontend React (otro puerto) consuma la API
app.use(express.json());  // parsea body JSON (para futuras peticiones POST)

// Ruta base de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: '🛍️ API REST Mueblería Hermanos Jota activa',
        version: '1.0.0',
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

// Iniciar servidor solo si se ejecuta directamente (`node server.js`).
// Si otro archivo lo importa (por ejemplo, los tests), no abre el puerto.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`===========================================================`);
        console.log(` Servidor Hermanos Jota funcionando en http://localhost:${PORT}`);
        console.log(` Endpoint Productos: http://localhost:${PORT}/api/productos`);
        console.log(`===========================================================`);
    });
}

module.exports = app;