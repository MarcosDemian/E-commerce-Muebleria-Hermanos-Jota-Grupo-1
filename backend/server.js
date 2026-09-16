/* ==========================================================================
   SERVIDOR PRINCIPAL BACKEND — MUEBLERÍA HERMANOS JOTA
   Consigna Final Sprint 3 y 4 (ITBA)
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const path = require('path');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const productosRoutes = require('./routes/productos.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(logger);

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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`===========================================================`);
    console.log(` Servidor Hermanos Jota funcionando en http://localhost:${PORT}`);
    console.log(` Endpoint Productos: http://localhost:${PORT}/api/productos`);
    console.log(`===========================================================`);
});
