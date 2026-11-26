/* ==========================================================================
   RUTAS DE AUTENTICACIÓN (REGISTRO, LOGIN Y PERFIL CON BCRYPT + JWT)
   Montado en server.js bajo /api/auth 
   Consigna Final Sprint 7 y 8 
   ========================================================================== */

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'hermanos_jota_jwt_secret_2026_seguro';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper para firmar un JWT con los datos esenciales del usuario
const generarToken = (usuario) => {
    return jwt.sign(
        {
            id: usuario._id.toString(),
            _id: usuario._id.toString(),
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Handler compartido para POST /registro y POST /register
const registrarUsuario = async (req, res, next) => {
    try {
        const nombre = (req.body.nombre || req.body.name || '').trim();
        const email = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password || '';

        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'Todos los campos (nombre, email y password) son obligatorios.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'La contraseña debe tener al menos 6 caracteres.'
            });
        }

        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'Ya existe un usuario registrado con ese email.'
            });
        }

        // El modelo User hashea automáticamente la contraseña en su hook pre('save') con bcrypt
        const nuevoUsuario = await User.create({
            nombre,
            email,
            password
        });

        const token = generarToken(nuevoUsuario);
        const userJson = nuevoUsuario.toJSON();

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente.',
            token,
            usuario: userJson,
            user: userJson
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: Object.values(error.errors).map(e => e.message).join(' ')
            });
        }
        next(error);
    }
};

// 1. POST /api/auth/registro (y alias /register)
router.post('/registro', registrarUsuario);
router.post('/register', registrarUsuario);

// 2. POST /api/auth/login — Valida credenciales contra MongoDB y devuelve un JWT
router.post('/login', async (req, res, next) => {
    try {
        const email = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password || '';

        if (!email || !password) {
            return res.status(400).json({
                error: true,
                codigo: 400,
                mensaje: 'Por favor, ingresá tu email y contraseña.'
            });
        }

        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(401).json({
                error: true,
                codigo: 401,
                mensaje: 'Credenciales inválidas (email o contraseña incorrectos).'
            });
        }

        const passwordValida = await usuario.compararPassword(password);
        if (!passwordValida) {
            return res.status(401).json({
                error: true,
                codigo: 401,
                mensaje: 'Credenciales inválidas (email o contraseña incorrectos).'
            });
        }

        const token = generarToken(usuario);
        const userJson = usuario.toJSON();

        res.json({
            mensaje: 'Inicio de sesión exitoso.',
            token,
            usuario: userJson,
            user: userJson
        });
    } catch (error) {
        next(error);
    }
});

// Handler compartido para GET /perfil y GET /me (Ruta protegida con JWT)
const obtenerPerfil = async (req, res, next) => {
    try {
        const usuario = await User.findById(req.user.id);

        if (!usuario) {
            return res.status(404).json({
                error: true,
                codigo: 404,
                mensaje: 'Usuario no encontrado.'
            });
        }

        const userJson = usuario.toJSON();

        res.json({
            ...userJson,
            usuario: userJson,
            user: userJson
        });
    } catch (error) {
        next(error);
    }
};

// 3. GET /api/auth/perfil (y alias /me) — Ruta protegida con middleware JWT
router.get('/perfil', authMiddleware, obtenerPerfil);
router.get('/me', authMiddleware, obtenerPerfil);

module.exports = router;
