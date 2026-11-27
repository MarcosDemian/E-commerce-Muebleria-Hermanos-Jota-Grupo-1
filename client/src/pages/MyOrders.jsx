import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_PEDIDOS } from '../config';

export default function MyOrders() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_PEDIDOS}/mis-pedidos`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.mensaje || 'No pudimos cargar tu historial de pedidos.');
        }

        setPedidos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando pedidos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [token]);

  const formatearPrecio = (monto) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(monto || 0);

  const formatearFecha = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : '-';

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">HISTORIAL DE COMPRAS</p>
          <h1>Mis Pedidos</h1>
          <p>
            Seguimiento de las piezas encargadas por <strong>{user?.nombre || user?.email}</strong> en Casa Taller.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && (
            <div className="loading-state">
              <p>⏳ Cargando tus pedidos...</p>
            </div>
          )}

          {error && (
            <div className="error-state" role="alert">
              <h3>⚠️ Error al cargar pedidos</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && pedidos.length === 0 && (
            <div className="empty-state" style={{ padding: '3.5rem 1.5rem' }}>
              <p className="eyebrow">HISTORIAL DE ÓRDENES</p>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                Aún no tenés pedidos registrados
              </h2>
              <p className="muted" style={{ maxWidth: '520px', margin: '0 auto 1.5rem' }}>
                Cuando confirmes una compra desde tu carrito, vas a poder consultar aquí el detalle de cada orden, sus productos y el estado de entrega.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => navigate('/productos')}
                >
                  EXPLORAR CATÁLOGO
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => navigate('/perfil')}
                >
                  VOLVER A MI PERFIL
                </button>
              </div>
            </div>
          )}

          {!loading && !error && pedidos.length > 0 && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {pedidos.map((pedido) => (
                <article
                  key={pedido._id}
                  className="contact-form"
                  style={{ background: '#fff', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.85rem' }}>
                    <div>
                      <p className="eyebrow" style={{ marginBottom: '0.2rem' }}>
                        PEDIDO #{pedido._id.slice(-6).toUpperCase()}
                      </p>
                      <small className="muted">{formatearFecha(pedido.createdAt)}</small>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        className="filter-btn active"
                        style={{ cursor: 'default', textTransform: 'uppercase' }}
                      >
                        {pedido.estado || 'confirmado'}
                      </span>
                      <strong style={{ color: 'var(--siena)', fontSize: '1.15rem' }}>
                        {formatearPrecio(pedido.total)}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {pedido.items.map((item, idx) => {
                      const rawImg = item.imagen || 'img/aparador-uspallata.png';
                      const imageSrc =
                        rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('/')
                          ? rawImg
                          : `/${rawImg}`;
                      return (
                        <div
                          key={`${pedido._id}-${idx}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                        >
                          <img
                            src={imageSrc}
                            alt={item.nombre}
                            className="cart-item-img"
                            style={{ width: '56px', height: '56px' }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 600 }}>{item.nombre}</p>
                            <small className="muted">
                              {item.cantidad} {item.cantidad === 1 ? 'unidad' : 'unidades'} × {formatearPrecio(item.precio)}
                            </small>
                          </div>
                          <strong>{formatearPrecio(item.precio * item.cantidad)}</strong>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
