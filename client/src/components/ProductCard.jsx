import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProductCard({ producto }) {
  const navigate = useNavigate();
  const productId = producto._id || producto.id;

  const formatearPrecio = (precio) => {
    return precio == null
      ? 'Precio a consultar'
      : new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
          maximumFractionDigits: 0,
        }).format(precio);
  };

  const rawImg = producto.imagenUrl || producto.imagen || 'img/aparador-uspallata.png';
  const imageSrc =
    rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('/')
      ? rawImg
      : `/${rawImg}`;

  return (
    <article className="product-card">
      <Link 
        to={`/productos/${productId}`}
        className="product-image-link" 
      >
        <img src={imageSrc} alt={producto.nombre} loading="lazy" />
      </Link>
      <div className="product-card-body">
        <p className="product-category">{producto.categoria || 'Catálogo'}</p>
        <h2>
          <Link to={`/productos/${productId}`}>
            {producto.nombre}
          </Link>
        </h2>
        <div className="product-card-footer">
          <strong>{formatearPrecio(producto.precio)}</strong>
          <button 
            className="button button-secondary" 
            onClick={() => navigate(`/productos/${productId}`)}
          >
            VER DETALLE
          </button>
        </div>
      </div>
    </article>
  );
}
