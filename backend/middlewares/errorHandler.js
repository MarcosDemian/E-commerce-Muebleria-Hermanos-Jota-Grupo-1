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

// Manejador de errores centralizado (debe registrarse al final, con 4 parámetros)
const errorHandler = (err, req, res, next) => {
    const status = err.status || err.statusCode || 500;

    // Solo se imprime el stack completo para errores del servidor (5xx)
    if (status >= 500) {
        console.error('🔥 Error interno del servidor:', err);
    }

    // Body JSON mal formado en una petición (error de express.json())
    const mensaje = err.type === 'entity.parse.failed'
        ? 'El cuerpo de la petición no es un JSON válido.'
        : status >= 500
            ? 'Error interno del servidor. Por favor intente más tarde.'
            : err.message;

    res.status(status).json({
        error: true,
        codigo: status,
        mensaje
    });
};

module.exports = {
    notFoundHandler,
    errorHandler
};
