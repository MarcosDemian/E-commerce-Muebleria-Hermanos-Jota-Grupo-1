import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ onSelectProduct }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:5000/api/productos')
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
        setError('No pudimos conectar con el servidor de Hermanos Jota (http://localhost:5000). Asegurate de que el backend esté corriendo.');
        setLoading(false);
      });
  }, []);

  const categorias = ['Todas', ...new Set(productos.map(p => p.categoria))];

  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = categoriaActiva === 'Todas' || p.categoria === categoriaActiva;
    const q = busqueda.trim().toLowerCase();
    const coincideBusqueda = !q || p.nombre.toLowerCase().includes(q) || (p.descripcion && p.descripcion.toLowerCase().includes(q));
    return coincideCategoria && coincideBusqueda;
  });

  return (
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
              key={producto.id} 
              producto={producto} 
              onSelectProduct={onSelectProduct} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
