/* ==========================================================================
   MIDDLEWARE DE AUTORIZACIÓN CON JWT (JSON Web Token)
   Verifica el header "Authorization: Bearer <token>" en rutas protegidas.
   Consigna Final Sprint 7 y 8 — Día 1 (Integrante 1)
   ========================================================================== */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hermanos_jota_jwt_secret_2026_seguro';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                codigo: 401,
                mensaje: 'Acceso denegado. No se proporcionó un token válido (Formato esperado: Authorization: Bearer <token>).'
            });
        }

        const token = authHeader.split(' ')[1]?.trim();

        if (!token) {
            return res.status(401).json({
                error: true,
                codigo: 401,
                mensaje: 'Acceso denegado. Token vacío.'
            });
        }

        const payload = jwt.verify(token, JWT_SECRET);

        // Adjuntamos los datos del usuario autenticado en req.user (y req.usuario por compatibilidad)
        const userData = {
            id: payload.id || payload._id,
            _id: payload.id || payload._id,
            nombre: payload.nombre,
            email: payload.email,
            rol: payload.rol || 'cliente'
        };

        req.user = userData;
        req.usuario = userData;

        next();
    } catch (error) {
        const mensaje =
            error.name === 'TokenExpiredError'
                ? 'La sesión ha expirado. Por favor, iniciá sesión nuevamente.'
                : 'Token inválido o no autorizado.';

        return res.status(401).json({
            error: true,
            codigo: 401,
            mensaje
        });
    }
};

// Permite importarlo como `const auth = require('./auth')` o `const { verifyToken } = require('./auth')`
authMiddleware.verifyToken = authMiddleware;
authMiddleware.auth = authMiddleware;

module.exports = authMiddleware;
