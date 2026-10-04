# 🪑 Mueblería Hermanos Jota — E-commerce Full Stack

Aplicación de comercio electrónico con arquitectura cliente-servidor: una **API REST** en Node.js + Express que sirve el catálogo de muebles, y una **SPA en React (Vite)** que la consume.

**Curso:** Full Stack Developer — ITBA Educación Ejecutiva · **Comisión:** Aula General · **Entrega:** Fin del Sprint 4

## 👥 Integrantes (Grupo 1)

- Cristian Joel Soto
- Marcos Demian Garcia
- Catalina Schamberger

---

## 💻 Instalación y ejecución

Requisitos: [Node.js](https://nodejs.org/) (LTS) y Git.

```bash
git clone https://github.com/MarcosDemian/E-commerce-Muebleria-Hermanos-Jota-Grupo-1.git
cd E-commerce-Muebleria-Hermanos-Jota-Grupo-1
```

**1. Backend** (http://localhost:5000)

```bash
cd backend
npm install
npm run dev      # o `npm start`
```

**2. Frontend** (http://localhost:5173), en una segunda terminal

```bash
cd client
npm install
npm run dev
```

> El backend debe estar corriendo antes de abrir el frontend.
> En Windows, si `npm install` falla por la política de scripts de PowerShell, usá `npm.cmd install`.

## 🧪 Tests

**API (Jest + Supertest)**: no necesita el servidor corriendo.

```bash
cd backend
npm test
```

**Frontend (Playwright, extremo a extremo)**: levanta el backend y el frontend automáticamente.

```bash
cd client
npx playwright install chromium   # solo la primera vez
npm run test:e2e
```

Con `npm run test:e2e:ui` se abre una ventana para ver los tests paso a paso.

## 🏗️ Arquitectura

```
├── backend/                         # API REST (Node.js + Express)
│   ├── data/productos.js            # Catálogo: array de 11 productos
│   ├── middlewares/
│   │   ├── logger.js                # Registra método y URL de cada petición
│   │   └── errorHandler.js          # Manejo de 404 y errores 500
│   ├── routes/productos.routes.js   # express.Router
│   ├── test/productos.test.js       # Tests de la API (Jest + Supertest)
│   └── server.js                    # Punto de entrada
│
├── client/                          # SPA en React (Vite)
│   ├── e2e/                         # Tests extremo a extremo (Playwright)
│   ├── playwright.config.js
│   └── src/
│       ├── components/              # Navbar, Footer, ProductCard, ProductList,
│       │                            # ProductDetail, ContactForm, CartDrawer
│       └── App.jsx                  # Estado del carrito y vista activa
│
└── index.html, css/, js/ ...        # Versión estática de los Sprints 1 y 2
```

```
React (:5173)  ──fetch──▶  API Express (:5000)  ──lee──▶  data/productos.js
```

**Endpoints**

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api/productos` | `200` con la lista completa |
| `GET` | `/api/productos/:id` | `200` con el producto · `404` si no existe · `400` si el id no es numérico |

Los errores siempre responden en JSON: `{ "error": true, "codigo": 404, "mensaje": "..." }`.

## 🧭 Decisiones tomadas

- **Frontend y backend desacoplados**, cada uno con su `package.json`, para ejecutarlos y desplegarlos por separado.
- **Vite en lugar de `create-react-app`**: arranque más rápido y CRA está discontinuado.
- **Datos en un archivo `.js`** (sin base de datos, como pide la consigna). La API hace de capa de acceso, así que migrar a una base de datos solo cambiaría el backend.
- **Rutas con `express.Router`** en su propio módulo, para sumar recursos sin tocar `server.js`.
- **Logger primero y manejadores de error al final**, para registrar toda petición, incluso las que fallan.
- **Errores en JSON con formato uniforme**, para que el frontend los maneje igual siempre.
- **CORS habilitado**, porque React y la API corren en puertos distintos.
- **Navegación por estado en `App`** (sin React Router): alcanza para el tamaño del proyecto.
- **Carrito en el estado de `App`**, pasado por props a `Navbar` y `CartDrawer`, y persistido en `localStorage` para no perderlo al recargar.
- **Tests en dos niveles**: Jest + Supertest para la API (rápidos, sin servidor) y Playwright para los flujos de usuario (catálogo, carrito, contacto, errores de la API).