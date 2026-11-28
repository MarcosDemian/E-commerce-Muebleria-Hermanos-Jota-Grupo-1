import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';
import ContactForm from './components/ContactForm';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import { API_PRODUCTOS } from './config';

function HomeView() {
  const navigate = useNavigate();
  const [destacados, setDestacados] = useState([]);
  const [loadingDestacados, setLoadingDestacados] = useState(true);
  const [errorDestacados, setErrorDestacados] = useState(null);

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

  return (
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
            onClick={() => navigate('/productos')}
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
              onClick={() => navigate('/productos')}
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
                  key={p._id || p.id}
                  producto={p}
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
  );
}

export default function App() {
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 3000);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-layout">
          <Navbar onShowToast={showToast} />

          <main>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/productos" element={<ProductList />} />
              <Route
                path="/productos/:id"
                element={<ProductDetail onShowToast={showToast} />}
              />
              <Route path="/contacto" element={<ContactForm />} />

              {/* Rutas Protegidas solo para Admin */}
              <Route
                path="/admin/crear-producto"
                element={
                  <ProtectedRoute requireAdmin>
                    <ProductForm mode="create" onShowToast={showToast} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/editar-producto/:id"
                element={
                  <ProtectedRoute requireAdmin>
                    <ProductForm mode="edit" onShowToast={showToast} />
                  </ProtectedRoute>
                }
              />

              {/* Rutas Públicas de Autenticación */}
              <Route path="/login" element={<Login onShowToast={showToast} />} />
              <Route path="/registro" element={<Register onShowToast={showToast} />} />

              {/* Rutas Protegidas (requieren JWT activo) */}
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Profile onShowToast={showToast} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mis-pedidos"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />

          <CartDrawer onShowToast={showToast} />

          <div className={`toast-notification ${toastMsg ? 'show' : ''}`}>
            {toastMsg}
          </div>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
