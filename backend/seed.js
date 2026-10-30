/* ==========================================================================
   SCRIPT DE SEED (POBLACIÓN INICIAL DE MONGODB) — MUEBLERÍA HERMANOS JOTA
   Ejecutar con: npm run seed
   ========================================================================== */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const productosIniciales = require('./data/productos');

async function seedDatabase() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('La variable MONGODB_URI no está definida en el archivo .env');
        }

        console.log('⏳ Conectando a MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB Atlas');

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

        await Product.deleteMany({});
        const insertados = await Product.insertMany(docs);
        console.log(`🎉 Se insertaron ${insertados.length} productos en la colección 'products'.`);

        await mongoose.disconnect();
        console.log('🔌 Conexión cerrada correctamente.');
    } catch (error) {
        console.error('❌ Error ejecutando el seed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
