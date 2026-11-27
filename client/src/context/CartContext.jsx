import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext(null);

const CART_STORAGE_KEY = 'hj_cart_items_v2';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('No se pudo guardar el carrito en localStorage:', e);
    }
  }, [cart]);

  const addToCart = (producto, cantidad = 1) => {
    const prodId = producto._id || producto.id;
    setCart(prevCart => {
      const idx = prevCart.findIndex(item => item.id === prodId);
      if (idx > -1) {
        const nextCart = [...prevCart];
        nextCart[idx] = {
          ...nextCart[idx],
          cantidad: nextCart[idx].cantidad + cantidad
        };
        return nextCart;
      }
      return [
        ...prevCart,
        {
          id: prodId,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagenUrl || producto.imagen || 'img/aparador-uspallata.png',
          cantidad
        }
      ];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prevCart =>
      prevCart
        .map(item => {
          if (item.id === id) {
            const newQty = item.cantidad + delta;
            return newQty > 0 ? { ...item, cantidad: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItemsCount = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + (Number(item.precio) || 0) * item.cantidad,
    0
  );

  const value = {
    cart,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    totalItemsCount,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe utilizarse dentro de un <CartProvider>');
  }
  return context;
}
