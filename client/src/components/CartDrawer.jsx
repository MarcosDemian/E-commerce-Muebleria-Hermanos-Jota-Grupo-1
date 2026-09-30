import React from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onGoToCatalog
}) {
  const calcularTotal = () => {
    return items.reduce((total, item) => total + ((item.precio || 0) * item.cantidad), 0);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('El carrito está vacío. ¡Agregá productos antes de finalizar la compra!');
      return;
    }
    alert('🎉 ¡Gracias por tu pedido en Mueblería Hermanos Jota! Nos pondremos en contacto desde Casa Taller para coordinar el envío.');
    onClearCart();
    onClose();
  };

  return (
    <div className={`cart-drawer-backdrop ${isOpen ? 'active' : ''}`} onClick={(e) => {
      if (e.target.classList.contains('cart-drawer-backdrop')) {
        onClose();
      }
    }}>
      <div className="cart-drawer-container">
        <div className="cart-drawer-header">
          <h3>🛒 Carrito de Compras</h3>
          <button className="cart-drawer-close" onClick={onClose} aria-label="Cerrar carrito">
            &times;
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🧺</span>
              <p>Tu carrito está vacío</p>
              <button 
                className="button button-secondary" 
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  onClose();
                  if (onGoToCatalog) onGoToCatalog();
                }}
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            items.map(item => {
              const imageSrc = item.imagen.startsWith('/') ? item.imagen : `/${item.imagen}`;
              return (
                <div className="cart-item-card" key={item.id}>
                  <img src={imageSrc} alt={item.nombre} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.nombre}</h4>
                    <span className="cart-item-price">
                      ${((item.precio || 0) * item.cantidad).toLocaleString('es-AR')} ARS
                    </span>
                    <div className="cart-qty-controls">
                      <button className="btn-qty" onClick={() => onUpdateQty(item.id, -1)}>-</button>
                      <span className="qty-val">{item.cantidad}</span>
                      <button className="btn-qty" onClick={() => onUpdateQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <button 
                    className="btn-remove-cart" 
                    onClick={() => onRemoveItem(item.id)} 
                    title="Eliminar"
                  >
                    &times;
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-total-row">
            <span>Total estimado:</span>
            <strong>${calcularTotal().toLocaleString('es-AR')} ARS</strong>
          </div>
          <div className="cart-actions-row">
            <button 
              className="button button-secondary" 
              onClick={() => {
                if (items.length > 0 && confirm('¿Vaciar todos los productos del carrito?')) {
                  onClearCart();
                }
              }}
            >
              Vaciar
            </button>
            <button className="button button-primary" onClick={handleCheckout}>
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
