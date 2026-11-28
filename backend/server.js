/* ==========================================================================
   SERVIDOR PRINCIPAL BACKEND — MUEBLERÍA HERMANOS JOTA
   Consigna Final Sprint 5, 6, 7 y 8 (MongoDB + CRUD + Auth JWT + Pedidos)
   ========================================================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const productosRoutes = require('./routes/productos.routes');
const authRoutes = require('./routes/auth.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const Product = require('./models/Product');
const User = require('./models/User');
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
        mensaje: '🛍️ API REST Mueblería Hermanos Jota activa (MongoDB + Auth JWT + Pedidos)',
        version: '3.0.0',
        endpoints: {
            productos: '/api/productos',
            productoPorId: '/api/productos/:id',
            registro: '/api/auth/registro',
            login: '/api/auth/login',
            perfil: '/api/auth/perfil',
            pedidos: '/api/pedidos',
            misPedidos: '/api/pedidos/mis-pedidos'
        }
    });
});

// Rutas de API
app.use('/api/productos', productosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', authRoutes); // Alias de compatibilidad
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/orders', pedidosRoutes); // Alias de compatibilidad

// Manejo de errores 404 y 500
app.use(notFoundHandler);
app.use(errorHandler);

// Función para conectar a MongoDB, poblar catálogo inicial y crear admin si corresponde
async function connectDB() {
    if (!MONGODB_URI) {
        console.error('❌ Error: MONGODB_URI no está definida en las variables de entorno (.env).');
        process.exit(1);
    }

    if (mongoose.connection.readyState === 1) {
        return;
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

    // Crear usuario administrador desde variables de entorno si no existe
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
        const adminExiste = await User.findOne({ email: adminEmail.trim().toLowerCase() });
        if (!adminExiste) {
            await User.create({
                nombre: 'Administrador Hermanos Jota',
                email: adminEmail.trim().toLowerCase(),
                password: adminPassword,
                rol: 'admin'
            });
            console.log(`👑 Usuario admin creado automáticamente (${adminEmail})`);
        }
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
                console.log(` Endpoint Auth:      http://localhost:${PORT}/api/auth`);
                console.log(` Endpoint Pedidos:   http://localhost:${PORT}/api/pedidos`);
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
