import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_AUTH } from '../config';

export const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || null);
  const [loading, setLoading] = useState(true);

  // Al iniciar o recargar la página, verificamos si existe un JWT guardado y validamos la sesión
  useEffect(() => {
    const verifyInitialSession = async () => {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (!savedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      // Hidratación inicial preventiva si existe usuario serializado
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }

      try {
        const res = await fetch(`${API_AUTH}/perfil`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${savedToken}`
          }
        });

        if (!res.ok) {
          throw new Error('Sesión expirada o token inválido.');
        }

        const data = await res.json();
        const verifiedUser = data.usuario || data.user || data;

        setToken(savedToken);
        setUser(verifiedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(verifiedUser));
      } catch (err) {
        console.warn('No se pudo validar la sesión almacenada:', err.message);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyInitialSession();
  }, []);

  // Iniciar sesión: POST /api/auth/login
  const login = async (credenciales) => {
    const res = await fetch(`${API_AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciales)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.mensaje || 'Credenciales inválidas. Revisá tu email y contraseña.');
    }

    const authToken = data.token;
    const authUser = data.usuario || data.user;

    localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));

    setToken(authToken);
    setUser(authUser);

    return data;
  };

  // Registrar nuevo usuario: POST /api/auth/register
  const register = async (datosUsuario) => {
    const res = await fetch(`${API_AUTH}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosUsuario)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.mensaje || 'No se pudo completar el registro.');
    }

    const authToken = data.token;
    const authUser = data.usuario || data.user;

    if (authToken && authUser) {
      localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
      setToken(authToken);
      setUser(authUser);
    }

    return data;
  };

  // Cerrar sesión: limpia estado y storage
  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    isAdmin: Boolean(token && user && user.rol === 'admin'),
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un <AuthProvider>');
  }
  return context;
}
