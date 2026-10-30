import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { API_URL, API_PRODUCTOS } from '../config';

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(API_PRODUCTOS)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error en el servidor: HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching productos:', err);
        setError(`No pudimos conectar con el servidor de Hermanos Jota (${API_URL}). Asegurate de que el backend esté corriendo.`);
        setLoading(false);
      });
  }, []);

  const categorias = ['Todas', ...new Set(productos.map(p => p.categoria || 'General'))];

  const productosFiltrados = productos.filter(p => {
    const catProd = p.categoria || 'General';
    const coincideCategoria = categoriaActiva === 'Todas' || catProd === categoriaActiva;
    const q = busqueda.trim().toLowerCase();
    const coincideBusqueda = !q || p.nombre.toLowerCase().includes(q) || (p.descripcion && p.descripcion.toLowerCase().includes(q));
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <>
      <section className="page-intro">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="eyebrow">COLECCIÓN HERMANOS JOTA</p>
            <h1>El catálogo</h1>
            <p>Descubrí piezas pensadas para acompañarte durante años.</p>
          </div>
          <Link to="/admin/crear-producto" className="button button-primary">
            + NUEVO PRODUCTO
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="catalog-toolbar">
            <label className="search-box">
              <span>Buscar</span>
              <input
                type="search"
                placeholder="Buscá por nombre o material..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                autoComplete="off"
              />
            </label>
            <p className="result-count">
              {productosFiltrados.length} {productosFiltrados.length === 1 ? 'pieza' : 'piezas'}
            </p>
          </div>

          {categorias.length > 1 && (
            <div className="category-filters" aria-label="Filtro por categorías">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${cat === categoriaActiva ? 'active' : ''}`}
                  onClick={() => setCategoriaActiva(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="product-grid" style={{ marginTop: '1.5rem' }}>
            {loading && (
              <div className="loading-state">
                <p>⏳ Cargando piezas del catálogo desde la API REST...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <h3>⚠️ Error de Conexión</h3>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && productosFiltrados.length === 0 && (
              <div className="empty-state">
                <p>No encontramos piezas que coincidan con la búsqueda.</p>
              </div>
            )}

            {!loading && !error && productosFiltrados.map(producto => (
              <ProductCard 
                key={producto._id || producto.id} 
                producto={producto} 
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
