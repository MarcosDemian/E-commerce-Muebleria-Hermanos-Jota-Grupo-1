// URL base de la API (backend Express).
// Se puede cambiar con la variable VITE_API_URL (ver client/.env.example).
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_PRODUCTOS = `${API_URL}/api/productos`;
