/* ==========================================================================
   MODELO MONGOOSE: User (Usuario con hashing bcrypt)
   Consigna Final Sprint 7 y 8 — Día 1 (Integrante 1)
   ========================================================================== */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio.'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio.'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor ingresá un email válido.']
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria.'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres.']
        },
        rol: {
            type: String,
            enum: ['cliente', 'admin'],
            default: 'cliente'
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        }
    }
);

// Hook pre-save: hashea la contraseña con bcrypt antes de guardar en MongoDB
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método de instancia para comparar contraseña en texto plano contra el hash guardado
userSchema.methods.compararPassword = async function (passwordIngresada) {
    return bcrypt.compare(passwordIngresada, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
