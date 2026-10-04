import React, { useState, useEffect } from 'react';
import { API_PRODUCTOS } from '../config';

export default function ProductDetail({ productId, onBack, onAddToCart }) {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    fetch(`${API_PRODUCTOS}/${productId}`)
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
  }, [productId]);

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
          <button className="button button-primary" onClick={onBack}>
            VOLVER AL CATÁLOGO
          </button>
        </div>
      </section>
    );
  }

  const imageSrc = producto.imagen.startsWith('/') ? producto.imagen : `/${producto.imagen}`;

  return (
    <section className="section detail-section">
      <div className="container">
        <button className="back-link" onClick={onBack}>
          ← Volver al catálogo
        </button>

        <div className="product-detail">
          <div className="detail-image">
            <img src={imageSrc} alt={producto.nombre} />
          </div>

          <div className="detail-content">
            <p className="product-category">{producto.categoria}</p>
            <h1>{producto.nombre}</h1>
            <p className="detail-description">{producto.descripcion}</p>
            <div className="detail-price">{formatearPrecio(producto.precio)}</div>

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
              style={{ width: '100%', marginBottom: '1.5rem' }}
              onClick={() => onAddToCart(producto, cantidad)}
            >
              🛒 AÑADIR AL CARRITO
            </button>

            {producto.detalles && (
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
    </section>
  );
}
