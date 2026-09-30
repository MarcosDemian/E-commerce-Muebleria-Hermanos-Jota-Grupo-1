import React from 'react';

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div 
          className="brand" 
          onClick={() => setActiveTab('home')} 
          aria-label="Hermanos Jota - Inicio"
        >
          <img src="/img/logo-hj.png" alt="Hermanos Jota" className="brand-logo-img" />
          <span>HERMANOS JOTA</span>
        </div>

        <nav className="main-nav" aria-label="Navegación principal">
          <button 
            className={activeTab === 'home' ? 'active' : ''} 
            onClick={() => setActiveTab('home')}
          >
            Inicio
          </button>
          <button 
            className={activeTab === 'productos' ? 'active' : ''} 
            onClick={() => setActiveTab('productos')}
          >
            Productos
          </button>
          <button 
            className={activeTab === 'contacto' ? 'active' : ''} 
            onClick={() => setActiveTab('contacto')}
          >
            Contacto
          </button>
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
