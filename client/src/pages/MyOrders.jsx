import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
          {/* Vista preparada para la integración de checkout y listado de órdenes (Ticket Día 3) */}
          <div className="empty-state" style={{ padding: '3.5rem 1.5rem' }}>
            <p className="eyebrow">PRÓXIMAMENTE · HISTORIAL DE ÓRDENES</p>
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
        </div>
      </section>
    </>
  );
}
