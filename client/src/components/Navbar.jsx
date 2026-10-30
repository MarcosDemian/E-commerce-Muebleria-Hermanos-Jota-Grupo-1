import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar({ cartCount, onOpenCart }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link 
          to="/" 
          className="brand" 
          aria-label="Hermanos Jota - Inicio"
        >
          <img src="/img/logo-hj.png" alt="Hermanos Jota" className="brand-logo-img" />
          <span>HERMANOS JOTA</span>
        </Link>

        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/productos" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Productos
          </NavLink>
          <NavLink 
            to="/contacto" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Contacto
          </NavLink>
          <NavLink 
            to="/admin/crear-producto" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            + Crear Producto
          </NavLink>
        </nav>

        <button 
          className="cart" 
          onClick={onOpenCart} 
          aria-label="Carrito de compras"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L21 8H7" />
            <circle cx="10" cy="20" r="1.3" />
            <circle cx="18" cy="20" r="1.3" />
          </svg>
          <span className={`cart-count ${cartCount > 0 ? 'active' : ''}`}>
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
}
