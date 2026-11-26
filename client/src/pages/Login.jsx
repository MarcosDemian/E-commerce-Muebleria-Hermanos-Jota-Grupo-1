import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login({ onShowToast }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Ruta destino tras login exitoso (la ruta protegida previa o /perfil)
  const from = location.state?.from?.pathname || '/perfil';

  const validate = () => {
    const nextErrors = {};
    const emailTrim = formData.email.trim();

    if (!emailTrim) {
      nextErrors.email = 'El email es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      nextErrors.email = 'Por favor, ingresá un email válido.';
    }

    if (!formData.password) {
      nextErrors.password = 'La contraseña es obligatoria.';
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
      const data = await login({
        email: formData.email.trim(),
        password: formData.password
      });

      const userName = data?.usuario?.nombre || data?.user?.nombre || 'nuevamente';
      if (onShowToast) {
        onShowToast(`¡Bienvenido/a, ${userName}!`);
      }

      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Credenciales inválidas. Intentá nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">MI CUENTA · HERMANOS JOTA</p>
          <h1>Ingresar</h1>
          <p>
            Accedé a tu cuenta para consultar tu perfil, gestionar tus pedidos y seguir tus piezas seleccionadas.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '540px' }}>
          {serverError && (
            <div className="error-state" style={{ marginBottom: '1.5rem' }} role="alert">
              <h3>⚠️ No pudimos iniciar sesión</h3>
              <p>{serverError}</p>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
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
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'invalid' : ''}
              />
              <small className="field-error">{errors.password}</small>
            </div>

            <button
              type="submit"
              className="button button-primary"
              disabled={submitting}
            >
              {submitting ? 'INGRESANDO...' : 'INGRESAR'}
            </button>

            <p className="muted" style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', textAlign: 'center' }}>
              ¿Todavía no tenés cuenta?{' '}
              <Link to="/registro" className="text-link">
                Crear cuenta →
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
