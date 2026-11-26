import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register({ onShowToast }) {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    const nombreTrim = formData.nombre.trim();
    const emailTrim = formData.email.trim();

    if (!nombreTrim) {
      nextErrors.nombre = 'El nombre es obligatorio.';
    } else if (nombreTrim.length < 3) {
      nextErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (!emailTrim) {
      nextErrors.email = 'El email es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      nextErrors.email = 'Por favor, ingresá un email válido.';
    }

    if (!formData.password) {
      nextErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      setSubmitting(true);
      await register({
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      if (onShowToast) {
        onShowToast(`¡Cuenta creada con éxito! Bienvenido/a, ${formData.nombre.trim()}`);
      }

      navigate('/perfil', { replace: true });
    } catch (err) {
      setServerError(err.message || 'No pudimos registrar tu cuenta. Intentá nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">NUEVA CUENTA · HERMANOS JOTA</p>
          <h1>Crear cuenta</h1>
          <p>
            Registrate para guardar tus datos, realizar pedidos en nuestra tienda online y consultar tu historial.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '540px' }}>
          {serverError && (
            <div className="error-state" style={{ marginBottom: '1.5rem' }} role="alert">
              <h3>⚠️ Error en el registro</h3>
              <p>{serverError}</p>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="nombre">Nombre completo *</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Tu nombre y apellido"
                autoComplete="name"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? 'invalid' : ''}
              />
              <small className="field-error">{errors.nombre}</small>
            </div>

            <div className="field">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'invalid' : ''}
              />
              <small className="field-error">{errors.email}</small>
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña (mínimo 6 caracteres) *</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'invalid' : ''}
              />
              <small className="field-error">{errors.password}</small>
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repetí tu contraseña"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'invalid' : ''}
              />
              <small className="field-error">{errors.confirmPassword}</small>
            </div>

            <button
              type="submit"
              className="button button-primary"
              disabled={submitting}
            >
              {submitting ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
            </button>

            <p className="muted" style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', textAlign: 'center' }}>
              ¿Ya tenés una cuenta?{' '}
              <Link to="/login" className="text-link">
                Ingresar →
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
