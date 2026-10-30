import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API_PRODUCTOS } from '../config';

export default function ProductDetail({ onAddToCart, onShowToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [eliminando, setEliminando] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setError(null);
    fetch(`${API_PRODUCTOS}/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Producto no encontrado (HTTP ${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        setProducto(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching detail:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      setEliminando(true);
      const res = await fetch(`${API_PRODUCTOS}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('No se pudo eliminar el producto.');
      }

      if (onShowToast) {
        onShowToast(`"${producto.nombre}" fue eliminado del catálogo.`);
      }
      navigate('/productos');
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Ocurrió un error al intentar eliminar el producto.');
      setEliminando(false);
      setConfirmDeleteOpen(false);
    }
  };

  const formatearPrecio = (precio) => {
    return precio == null
      ? 'Precio a consultar'
      : new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
          maximumFractionDigits: 0,
        }).format(precio);
  };

  if (loading) {
    return (
      <section className="section container">
        <div className="loading-state">
          <p>⏳ Cargando ficha técnica de la pieza...</p>
        </div>
      </section>
    );
  }

  if (error || !producto) {
    return (
      <section className="section container">
        <div className="empty-state">
          <h2>Producto no encontrado</h2>
          <p>El producto solicitado no está disponible.</p>
          <button className="button button-primary" onClick={() => navigate('/productos')}>
            VOLVER AL CATÁLOGO
          </button>
        </div>
      </section>
    );
  }

  const rawImg = producto.imagenUrl || producto.imagen || 'img/aparador-uspallata.png';
  const imageSrc =
    rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('/')
      ? rawImg
      : `/${rawImg}`;

  return (
    <section className="section detail-section">
      <div className="container">
        <button className="back-link" onClick={() => navigate('/productos')}>
          ← Volver al catálogo
        </button>

        <div className="product-detail">
          <div className="detail-image">
            <img src={imageSrc} alt={producto.nombre} />
          </div>

          <div className="detail-content">
            <p className="product-category">{producto.categoria || 'Catálogo'}</p>
            <h1>{producto.nombre}</h1>
            <p className="detail-description">{producto.descripcion}</p>
            <div className="detail-price">{formatearPrecio(producto.precio)}</div>

            {producto.stock !== undefined && (
              <p className="muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                Stock disponible: <strong>{producto.stock} unidades</strong>
              </p>
            )}

            <div className="product-qty-selector">
              <label htmlFor="detail-qty">Cantidad:</label>
              <select 
                id="detail-qty" 
                value={cantidad} 
                onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
              >
                <option value={1}>1 unidad</option>
                <option value={2}>2 unidades</option>
                <option value={3}>3 unidades</option>
                <option value={4}>4 unidades</option>
                <option value={5}>5 unidades</option>
              </select>
            </div>

            <button 
              className="button button-primary" 
              style={{ width: '100%', marginBottom: '1rem' }}
              onClick={() => onAddToCart(producto, cantidad)}
            >
              🛒 AÑADIR AL CARRITO
            </button>

            <div className="admin-detail-actions" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Link 
                to={`/admin/editar-producto/${producto._id || producto.id}`}
                className="button button-secondary"
                style={{ flex: 1, textAlign: 'center' }}
              >
                ✏️ EDITAR PRODUCTO
              </Link>
              <button 
                type="button"
                className="button button-secondary"
                style={{ flex: 1, borderColor: 'var(--dusty)', color: 'var(--dusty)' }}
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={eliminando}
              >
                {eliminando ? 'ELIMINANDO...' : '🗑️ ELIMINAR'}
              </button>
            </div>

            {producto.detalles && Object.keys(producto.detalles).length > 0 && (
              <div className="detail-specs">
                <h2>Ficha Técnica y Materiales</h2>
                <dl>
                  {Object.entries(producto.detalles).map(([clave, valor]) => (
                    <div key={clave}>
                      <dt>{clave.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}</dt>
                      <dd>{valor}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <p className="detail-note">
              Los tiempos y dimensiones son referencias para esta demo académica de Mueblería Hermanos Jota.
            </p>
          </div>
        </div>
      </div>

      {confirmDeleteOpen && (
        <div className="cart-confirm-overlay" onClick={(e) => {
          if (e.target.classList.contains('cart-confirm-overlay')) {
            setConfirmDeleteOpen(false);
          }
        }}>
          <div className="cart-confirm-modal" role="dialog" aria-modal="true">
            <h3>¿Eliminar producto?</h3>
            <p>Se eliminará permanentemente <strong>{producto.nombre}</strong> de la base de datos MongoDB.</p>
            <div className="cart-confirm-actions">
              <button className="button button-secondary" onClick={() => setConfirmDeleteOpen(false)}>
                Cancelar
              </button>
              <button 
                className="button button-primary" 
                style={{ background: '#a33b2a' }}
                onClick={handleDelete}
                disabled={eliminando}
              >
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
