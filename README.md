# 🪑 Mueblería Hermanos Jota — E-commerce Full Stack

Aplicación de comercio electrónico con arquitectura cliente-servidor: una **API REST** en Node.js + Express conectada a **MongoDB Atlas** mediante Mongoose que sirve y gestiona el catálogo de muebles, y una **SPA en React (Vite)** con ruteo profesional y formularios controlados que la consume.

**Curso:** Full Stack Developer — ITBA Educación Ejecutiva · **Comisión:** Aula General · **Entrega:** Fin del Sprint 5 y 6 (Persistencia de Datos y CRUD Completo)

## 👥 Integrantes (Grupo 1)

- Cristian Joel Soto
- Marcos Demian Garcia
- Catalina Schamberger

---

## 🚀 Despliegue (Deploy)

- 🌐 **Frontend (Vercel):** [https://e-commerce-muebleria-hermanos-jota-five.vercel.app/](https://e-commerce-muebleria-hermanos-jota-five.vercel.app/)
- ⚙️ **Backend API (Render):** [https://tu-backend-en-render.onrender.com/api/productos](https://tu-backend-en-render.onrender.com/api/productos) *(Reemplazar con tu URL de Render)*

---

## 💻 Instalación y ejecución local

Requisitos: [Node.js](https://nodejs.org/) (LTS), Git y una cuenta/cluster en [MongoDB Atlas](https://www.mongodb.com/atlas).

```bash
git clone https://github.com/MarcosDemian/E-commerce-Muebleria-Hermanos-Jota-Grupo-1.git
cd E-commerce-Muebleria-Hermanos-Jota-Grupo-1
```

**1. Backend** (http://localhost:5000)

Creá un archivo `.env` dentro de la carpeta `backend` (podés guiarte con `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/hermanos_jota?retryWrites=true&w=majority
```

Instalá las dependencias e iniciá el servidor:

```bash
cd backend
npm install
npm run dev      # o `npm start`
```

> Si la colección en MongoDB está vacía al iniciar, el servidor ejecutará automáticamente un *seed* inicial con los 11 productos del catálogo. También podés poblarla manualmente con `npm run seed`.

**2. Frontend** (http://localhost:5173), en una segunda terminal

```bash
cd client
npm install
npm run dev
```

> El backend debe estar corriendo antes de abrir el frontend. Por defecto apunta a `http://localhost:5000` (configurable mediante la variable `VITE_API_URL`).
> En Windows, si `npm install` falla por la política de scripts de PowerShell, usá `npm.cmd install`.

---

## 🧪 Tests

**API (Jest + Supertest)**: prueba el CRUD completo contra MongoDB sin necesidad de tener el servidor levantado manualmente.

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

Con `npm run test:e2e:ui` se abre una ventana interactiva para ver los tests paso a paso.

---

## 🏗️ Arquitectura

```text
├── backend/                         # API REST (Node.js + Express + Mongoose)
│   ├── data/productos.js            # Catálogo inicial (seed de 11 productos)
│   ├── models/Product.js            # Esquema y Modelo Mongoose (Product)
│   ├── middlewares/
│   │   ├── logger.js                # Registra método y URL de cada petición
│   │   └── errorHandler.js          # Manejo centralizado de 404 y errores 500
│   ├── routes/productos.routes.js   # Rutas CRUD con express.Router
│   ├── test/productos.test.js       # Tests de integración CRUD (Jest + Supertest)
│   ├── seed.js                      # Script para poblar la base de datos
│   └── server.js                    # Punto de entrada y conexión a MongoDB
│
└── client/                          # SPA en React (Vite + React Router DOM)
    ├── e2e/                         # Tests extremo a extremo (Playwright)
    ├── playwright.config.js
    └── src/
        ├── components/              # Navbar, Footer, ProductCard, ProductList,
        │                            # ProductDetail, ProductForm, ContactForm, CartDrawer
        ├── config.js                # Configuración centralizada de VITE_API_URL
        └── App.jsx                  # Definición de rutas (Routes/Route) y estado del carrito
```

```text
React (:5173)  ──fetch (CRUD)──▶  API Express (:5000)  ──Mongoose──▶  MongoDB Atlas
```

### Endpoints del Backend (API)

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api/productos` | `200` con la lista completa de productos (soporta `?categoria=` y `?busqueda=`) |
| `GET` | `/api/productos/:id` | `200` con el producto por `_id` · `404` si no existe · `400` si el ObjectId es inválido |
| `POST` | `/api/productos` | `201` con el producto creado en MongoDB · `400` si fallan las validaciones |
| `PUT` | `/api/productos/:id` | `200` con el producto actualizado · `404` si no existe · `400` si los datos son inválidos |
| `DELETE` | `/api/productos/:id` | `200` confirmando la eliminación del producto · `404` si no existe |

Los errores siempre responden en JSON con formato uniforme: `{ "error": true, "codigo": 404, "mensaje": "..." }`.

### Rutas del Frontend (React Router DOM)

| Ruta | Vista / Componente | Descripción |
|---|---|---|
| `/` | `HomeView` | Página de inicio con presentación y piezas destacadas |
| `/productos` | `ProductList` | Catálogo completo con buscador, filtros por categoría y acceso a crear producto |
| `/productos/:id` | `ProductDetail` | Vista de detalle del producto (`useParams`) con opciones para añadir al carrito, editar o eliminar |
| `/contacto` | `ContactForm` | Formulario de contacto controlado con validaciones |
| `/admin/crear-producto` | `ProductForm` | Formulario controlado para dar de alta un nuevo producto (`POST`) |
| `/admin/editar-producto/:id` | `ProductForm` | Formulario controlado para editar un producto existente (`PUT`) |

---

## 🧭 Decisiones tomadas

- **Frontend y backend desacoplados**, cada uno con su `package.json`, para ejecutarlos y desplegarlos por separado en Vercel y Render.
- **Persistencia real con MongoDB Atlas y Mongoose**: se definió el modelo `Product` con validaciones de esquema (`nombre` y `precio` obligatorios, `descripcion`, `stock`, `imagenUrl`, `categoria` y `detalles`).
- **Auto-seed inteligente**: al iniciar el servidor, si la colección `products` está vacía, se inserta automáticamente el catálogo base para garantizar que la aplicación siempre tenga datos de prueba.
- **Gestión segura de configuración**: uso de `dotenv` y variables de entorno (`MONGODB_URI`, `PORT`, `VITE_API_URL`) manteniendo las credenciales fuera del repositorio mediante `.gitignore`.
- **Ruteo declarativo y programático en React**: uso de `react-router-dom` (`Routes`, `Route`, `Link`, `NavLink`, `useParams` y `useNavigate`) para navegar entre vistas y redirigir automáticamente luego de crear, editar o eliminar un producto.
- **Formularios controlados en React**: tanto para el alta y edición de productos como para la página de contacto, manejando estados de carga, validación de campos y retroalimentación visual (notificaciones *toast* y modales de confirmación).
- **Carrito persistente**: administrado en el estado de `App` y sincronizado en `localStorage` para conservar la compra al recargar el navegador.
- **Tests en dos niveles**: Jest + Supertest para validar el ciclo CRUD en la API y Playwright para los flujos de usuario extremo a extremo.