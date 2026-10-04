import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import ContactForm from './components/ContactForm';
import CartDrawer from './components/CartDrawer';
import { API_PRODUCTOS } from './config';

const CART_STORAGE_KEY = 'hj_cart_items_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [destacados, setDestacados] = useState([]);
  const [loadingDestacados, setLoadingDestacados] = useState(true);
  const [errorDestacados, setErrorDestacados] = useState(null);

  // Persistir carrito en localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Cargar destacados para la Home desde la API REST
  useEffect(() => {
    fetch(API_PRODUCTOS)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error en el servidor: HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setDestacados(data.slice(0, 4));
        setLoadingDestacados(false);
      })
      .catch(err => {
        console.error('Error cargando destacados en Home:', err);
        setErrorDestacados('No pudimos cargar las piezas destacadas. Verificá que el backend esté corriendo.');
        setLoadingDestacados(false);
      });
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 3000);
  };

  const handleAddToCart = (producto, cantidad = 1) => {
    setCart(prevCart => {
      const idx = prevCart.findIndex(item => item.id === producto.id);
      if (idx > -1) {
        const nextCart = [...prevCart];
        nextCart[idx] = {
          ...nextCart[idx],
          cantidad: nextCart[idx].cantidad + cantidad
        };
        return nextCart;
      } else {
        return [
          ...prevCart,
          {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad
          }
        ];
      }
    });

    showToast(`"${producto.nombre}" agregado al carrito`);
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.cantidad + delta;
          return newQty > 0 ? { ...item, cantidad: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    showToast('Producto eliminado del carrito');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSelectProduct = (id) => {
    setSelectedProductId(id);
    setActiveTab('detalle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="app-layout">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalItemsCount} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      <main>
        {activeTab === 'home' && (
          <>
            <section className="hero">
              <div className="container hero-content">
                <p className="eyebrow">HERMANOS JOTA · CASA TALLER</p>
                <h1>Muebles con historia.<br /><em>Diseño para durar.</em></h1>
                <p>
                  Redescubrimos el oficio de crear piezas que acompañan tus rituales
                  cotidianos, combinando herencia, innovación y una mirada consciente
                  sobre los materiales.
                </p>
                <button 
                  className="button button-primary" 
                  onClick={() => setActiveTab('productos')}
                >
                  VER COLECCIÓN
                </button>
              </div>
            </section>

            <section className="section">
              <div className="container">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">SELECCIÓN HERMANOS JOTA</p>
                    <h2>Piezas destacadas</h2>
                  </div>
                  <button 
                    className="text-link" 
                    onClick={() => setActiveTab('productos')}
                  >
                    Ver catálogo completo →
                  </button>
                </div>

                <div className="product-grid product-grid-featured">
                  {loadingDestacados ? (
                    <div className="loading-state">
                      <p>⏳ Cargando nuestra selección...</p>
                    </div>
                  ) : errorDestacados ? (
                    <div className="error-state">
                      <h3>⚠️ No pudimos cargar la selección</h3>
                      <p>{errorDestacados}</p>
                    </div>
                  ) : (
                    destacados.map(p => (
                      <ProductCard 
                        key={p.id} 
                        producto={p} 
                        onSelectProduct={handleSelectProduct} 
                      />
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="section story-section">
              <div className="container story-grid">
                <div>
                  <p className="eyebrow">NUESTRA ESENCIA</p>
                  <h2>Herencia e innovación en cada pieza.</h2>
                </div>
                <div>
                  <p>
                    Hermanos Jota nace en la intersección entre la calidez del
                    optimismo de los años 60 y la conciencia de la sustentabilidad del
                    2026. Cada pieza honra el pasado mientras abraza el futuro.
                  </p>
                  <p className="muted">
                    No es solo mobiliario: es una filosofía de vida pensada para
                    envejecer con gracia y desarrollar carácter.
                  </p>
                </div>
              </div>
            </section>

            <section className="section sustainability-section">
              <div className="container">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">MATERIALES Y OFICIO</p>
                    <h2>Elegimos pensando en el futuro.</h2>
                  </div>
                </div>
                <div className="sustainability-grid">
                  <article>
                    <span>01</span>
                    <h3>Maderas responsables</h3>
                    <p>
                      Madera certificada FSC y prioridad a especies nativas como
                      algarrobo, quebracho y caldén.
                    </p>
                  </article>
                  <article>
                    <span>02</span>
                    <h3>Acabados naturales</h3>
                    <p>
                      Aceite de lino, cera de abejas y tintes vegetales para acompañar
                      la belleza de la madera.
                    </p>
                  </article>
                  <article>
                    <span>03</span>
                    <h3>Herencia Viva</h3>
                    <p>
                      Restauración, trazabilidad, cuidados y recompra para extender la
                      vida de cada pieza.
                    </p>
                  </article>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'productos' && (
          <>
            <section className="page-intro">
              <div className="container">
                <p className="eyebrow">COLECCIÓN HERMANOS JOTA</p>
                <h1>El catálogo</h1>
                <p>Descubrí piezas pensadas para acompañarte durante años.</p>
              </div>
            </section>
            <ProductList onSelectProduct={handleSelectProduct} />
          </>
        )}

        {activeTab === 'detalle' && (
          <ProductDetail 
            productId={selectedProductId} 
            onBack={() => setActiveTab('productos')}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'contacto' && (
          <ContactForm />
        )}
      </main>

      <Footer />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onGoToCatalog={() => setActiveTab('productos')}
      />

      <div className={`toast-notification ${toastMsg ? 'show' : ''}`}>
        {toastMsg}
      </div>
    </div>
  );
}
