import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mientras verificamos el JWT inicial en localStorage, mostramos estado de carga sin parpadeos
  if (loading) {
    return (
      <section className="section container">
        <div className="loading-state">
          <p>⏳ Verificando sesión...</p>
        </div>
      </section>
    );
  }

  // Si no hay sesión activa, redirigimos a /login guardando la ruta de origen
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
