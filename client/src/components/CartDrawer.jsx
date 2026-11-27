import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_PEDIDOS } from '../config';

export default function CartDrawer({ onShowToast }) {
  const {
    cart: items,
    isCartOpen: isOpen,
    closeCart: onClose,
    updateQty,
    removeItem,
    clearCart,
    totalPrice
  } = useCart();

  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const handleRemove = (id) => {
    removeItem(id);
    if (onShowToast) {
      onShowToast('Producto eliminado del carrito');
    }
  };

  const handleCheckout = async () => {
    setCheckoutError('');

    if (items.length === 0) {
      if (onShowToast) {
        onShowToast('El carrito está vacío. Agregá productos antes de comprar.');
      }
      return;
    }

    if (!isAuthenticated || !token) {
      onClose();
      if (onShowToast) {
        onShowToast('Iniciá sesión para finalizar tu compra');
      }
      navigate('/login');
      return;
    }

    try {
      setSubmittingOrder(true);

      const res = await fetch(API_PEDIDOS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items,
          total: totalPrice
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || 'No pudimos registrar tu pedido. Intentá nuevamente.');
      }

      clearCart();
      onClose();

      if (onShowToast) {
        onShowToast('🎉 ¡Pedido confirmado! Podés verlo en Mis Pedidos.');
      }

      navigate('/mis-pedidos');
    } catch (err) {
      console.error('Error al finalizar compra:', err);
      setCheckoutError(err.message || 'Ocurrió un error al procesar el pedido.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleConfirmClearCart = () => {
    clearCart();
    setIsClearConfirmOpen(false);
  };

  const closeClearConfirmation = () => {
    setIsClearConfirmOpen(false);
  };

  return (
    <>
      <div
        className={`cart-drawer-backdrop ${isOpen ? 'active' : ''}`}
        onClick={(e) => {
          if (e.target.classList.contains('cart-drawer-backdrop')) {
            setIsClearConfirmOpen(false);
            setCheckoutError('');
            onClose();
          }
        }}
      >
        <div className="cart-drawer-container">
          <div className="cart-drawer-header">
            <h3>🛒 Carrito de Compras</h3>
            <button
              className="cart-drawer-close"
              onClick={() => {
                setIsClearConfirmOpen(false);
                setCheckoutError('');
                onClose();
              }}
              aria-label="Cerrar carrito"
            >
              &times;
            </button>
          </div>

          <div className="cart-drawer-body">
            {checkoutError && (
              <div className="error-state" style={{ padding: '1rem', fontSize: '0.85rem' }} role="alert">
                <p style={{ margin: 0 }}>⚠️ {checkoutError}</p>
              </div>
            )}

            {items.length === 0 ? (
              <div className="cart-empty-state">
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🧺</span>
                <p>Tu carrito está vacío</p>
                <button
                  className="button button-secondary"
                  style={{ marginTop: '1rem' }}
                  onClick={() => {
                    onClose();
                    navigate('/productos');
                  }}
                >
                  Ver Catálogo
                </button>
              </div>
            ) : (
              items.map(item => {
                const rawImg = item.imagen || 'img/aparador-uspallata.png';
                const imageSrc =
                  rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('/')
                    ? rawImg
                    : `/${rawImg}`;
                return (
                  <div className="cart-item-card" key={item.id}>
                    <img src={imageSrc} alt={item.nombre} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4 className="cart-item-title">{item.nombre}</h4>
                      <span className="cart-item-price">
                        ${((item.precio || 0) * item.cantidad).toLocaleString('es-AR')} ARS
                      </span>
                      <div className="cart-qty-controls">
                        <button className="btn-qty" onClick={() => updateQty(item.id, -1)}>-</button>
                        <span className="qty-val">{item.cantidad}</span>
                        <button className="btn-qty" onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                    </div>
                    <button
                      className="btn-remove-cart"
                      onClick={() => handleRemove(item.id)}
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
              <strong>${totalPrice.toLocaleString('es-AR')} ARS</strong>
            </div>

            {!isAuthenticated && items.length > 0 && (
              <p className="muted" style={{ fontSize: '0.78rem', margin: '0 0 0.75rem', textAlign: 'center' }}>
                Necesitás iniciar sesión para confirmar tu pedido.
              </p>
            )}

            <div className="cart-actions-row">
              <button
                className="button button-secondary"
                disabled={submittingOrder}
                onClick={() => {
                  if (items.length > 0) {
                    setIsClearConfirmOpen(true);
                  }
                }}
              >
                Vaciar
              </button>
              <button
                className="button button-primary"
                disabled={submittingOrder || items.length === 0}
                onClick={handleCheckout}
              >
                {submittingOrder
                  ? 'Procesando...'
                  : isAuthenticated
                    ? 'Finalizar Compra'
                    : 'Ingresar para Comprar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isClearConfirmOpen && (
        <div
          className="cart-confirm-overlay"
          onClick={(e) => {
            if (e.target.classList.contains('cart-confirm-overlay')) {
              closeClearConfirmation();
            }
          }}
        >
          <div className="cart-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="clear-cart-title">
            <h3 id="clear-cart-title">¿Vaciar carrito?</h3>
            <p>Se eliminarán todos los productos de tu compra.</p>
            <div className="cart-confirm-actions">
              <button className="button button-secondary" onClick={closeClearConfirmation}>
                Cancelar
              </button>
              <button className="button button-primary" onClick={handleConfirmClearCart}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
