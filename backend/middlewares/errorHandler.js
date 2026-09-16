/* ==========================================================================
   MIDDLEWARES DE MANEJO DE ERRORES Y RUTAS NO ENCONTRADAS (404 / 500)
   ========================================================================== */

// Manejador para rutas 404 no encontradas
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        error: true,
        codigo: 404,
        mensaje: `La ruta solicitada '${req.originalUrl}' no existe en la API de Hermanos Jota.`
    });
};

// Manejador de errores globales 500
const errorHandler = (err, req, res, next) => {
    console.error('🔥 Error interno del servidor:', err);
    res.status(err.status || 500).json({
        error: true,
        codigo: err.status || 500,
        mensaje: err.message || 'Error interno del servidor. Por favor intente más tarde.'
    });
};

module.exports = {
    notFoundHandler,
    errorHandler
};
