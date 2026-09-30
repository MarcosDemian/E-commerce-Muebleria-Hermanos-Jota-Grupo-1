# Mueblería Hermanos Jota — E-commerce Full Stack (Sprint 3 y 4)

**Curso**: Full Stack Developer — ITBA Educación Ejecutiva  
**Comisión**: Aula General  
**Equipo — Grupo 1**:
- **Cristian Joel Soto**
- **Marcos Demian Garcia**
- **Joaquin Esteban Monzón Fernández**

---

## 📌 Resumen del Proyecto

Transformación completa de la plataforma **Mueblería Hermanos Jota** a una arquitectura **Full Stack Decoupled (Cliente-Servidor)**:
1. **`backend/`**: Servidor API REST desarrollado en Node.js y Express que expone el catálogo de muebles y maneja middlewares de registro y errores.
2. **`client/`**: Aplicación de Single Page Application (SPA) construida en React con Vite, modularizada en componentes con `useState`, `useEffect` y consumo de API con `fetch()`.

---

## 🚀 Arquitectura y Tecnologías Utilizadas

```
E-commerce-Muebleria-Hermanos-Jota-Grupo-1/
├── backend/                    # Servidor API REST (Node.js + Express)
│   ├── data/
│   │   └── productos.json      # Catálogo de datos en formato JSON
│   ├── middlewares/
│   │   ├── logger.js           # Middleware de registro de peticiones
│   │   └── errorHandler.js     # Manejador de rutas 404 y errores 500
│   ├── routes/
│   │   └── productos.routes.js # express.Router (/api/productos y /api/productos/:id)
│   ├── package.json
│   └── server.js               # Servidor principal (Puerto 5000)
│
├── client/                     # Frontend SPA en React (Vite)
│   ├── public/
│   │   └── img/                # Isotipo oficial hj y fotos del catálogo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Header con isotipo hj y badge del carrito
│   │   │   ├── Footer.jsx      # Pie de página informativo
│   │   │   ├── ProductCard.jsx # Tarjetas de productos
│   │   │   ├── ProductList.jsx # Grilla con fetch, filtros y buscador
│   │   │   ├── ProductDetail.jsx# Ficha técnica detallada
│   │   │   ├── ContactForm.jsx # Formulario controlado con useState
│   │   │   └── CartDrawer.jsx  # Modal desplegable del carrito
│   │   ├── App.jsx             # Estado global del carrito y navegación
│   │   ├── main.jsx            # Punto de entrada de React
│   │   └── styles.css          # Sistema de diseño e identidad visual
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 💻 Instrucciones de Instalación y Ejecución

### 1. Iniciar el Backend (API REST en Node.js)
```bash
cd backend
npm install
npm run dev   # O `npm start`
```
El servidor backend quedará escuchando en `http://localhost:5000`.

### 2. Iniciar el Frontend (React en Vite)
En una segunda terminal:
```bash
cd client
npm install
npm run dev
```
La aplicación React se abrirá en `http://localhost:5173`.

---

## 🧪 Endpoints del Backend

- `GET http://localhost:5000/api/productos`: Retorna la lista completa de muebles.
- `GET http://localhost:5000/api/productos/:id`: Retorna la ficha técnica de un mueble específico (o 404 con respuesta JSON controlada).

---

## ✨ Requerimientos de Consigna Cumplidos (Sprint 3 y 4)

- ✅ **Servidor Express y Router**: Rutas modulares organizadas con `express.Router` y middleware de logging.
- ✅ **Componentización en React**: `Navbar`, `Footer`, `ProductCard`, `ProductList`, `ProductDetail`, `ContactForm` y `CartDrawer`.
- ✅ **Ciclo de vida y Fetch**: Manejo de peticiones asíncronas con `useState` y `useEffect` (estados `loading`, `error`, `data`).
- ✅ **Formulario Controlado**: Manejo del estado del formulario de contacto con `useState` y mensajes dinámicos.
- ✅ **Persistencia de Carrito**: Carrito interactivo con `localStorage`, badge contador en `Navbar` y actualización de cantidades.
