import React from 'react';

export default function ProductCard({ producto, onSelectProduct }) {
  const formatearPrecio = (precio) => {
    return precio == null
      ? 'Precio a consultar'
      : new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
          maximumFractionDigits: 0,
        }).format(precio);
  };

  const imageSrc = producto.imagen.startsWith('/') ? producto.imagen : `/${producto.imagen}`;

  return (
    <article className="product-card">
      <div 
        className="product-image-link" 
        onClick={() => onSelectProduct(producto.id)}
      >
        <img src={imageSrc} alt={producto.nombre} loading="lazy" />
      </div>
      <div className="product-card-body">
        <p className="product-category">{producto.categoria}</p>
        <h2>
          <a onClick={() => onSelectProduct(producto.id)}>
            {producto.nombre}
          </a>
        </h2>
        <div className="product-card-footer">
          <strong>{formatearPrecio(producto.precio)}</strong>
          <button 
            className="button button-secondary" 
            onClick={() => onSelectProduct(producto.id)}
          >
            VER DETALLE
          </button>
        </div>
      </div>
    </article>
  );
}
