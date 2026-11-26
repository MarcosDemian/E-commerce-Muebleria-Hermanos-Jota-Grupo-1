import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile({ onShowToast }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onShowToast) {
      onShowToast('Sesión cerrada correctamente');
    }
    navigate('/');
  };

  const fechaAlta = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Miembro activo';

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">MI CUENTA · HERMANOS JOTA</p>
          <h1>Hola, {user?.nombre || 'Cliente'}</h1>
          <p>
            Desde tu perfil podés revisar tus datos personales y acceder rápidamente a tus pedidos.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="contact-form" style={{ background: 'var(--alabaster)' }}>
            <div>
              <p className="eyebrow">INFORMACIÓN DE LA CUENTA</p>
              <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>
                Datos del usuario
              </h2>
            </div>

            <div className="detail-specs" style={{ margin: '0.5rem 0 1rem' }}>
              <dl>
                <div>
                  <dt>Nombre completo</dt>
                  <dd><strong>{user?.nombre || '-'}</strong></dd>
                </div>
                <div>
                  <dt>Correo electrónico</dt>
                  <dd>{user?.email || '-'}</dd>
                </div>
                <div>
                  <dt>Rol</dt>
                  <dd style={{ textTransform: 'capitalize' }}>{user?.rol || 'cliente'}</dd>
                </div>
                <div>
                  <dt>ID de cliente</dt>
                  <dd className="muted" style={{ fontSize: '0.85rem' }}>
                    {user?._id || user?.id || '-'}
                  </dd>
                </div>
                <div>
                  <dt>Fecha de registro</dt>
                  <dd>{fechaAlta}</dd>
                </div>
              </dl>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => navigate('/mis-pedidos')}
                >
                  VER MIS PEDIDOS
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => navigate('/productos')}
                >
                  IR AL CATÁLOGO
                </button>
              </div>

              <button
                type="button"
                className="button button-secondary"
                style={{ borderColor: 'var(--dusty)', color: '#9b2c2c' }}
                onClick={handleLogout}
              >
                CERRAR SESIÓN
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
