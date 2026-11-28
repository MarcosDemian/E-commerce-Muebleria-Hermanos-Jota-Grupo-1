# 🪑 Mueblería Hermanos Jota — E-commerce Full Stack

Aplicación de comercio electrónico completa con arquitectura **MERN** (MongoDB, Express, React y Node.js): una **API REST** conectada a **MongoDB Atlas** con autenticación mediante **bcrypt** y **JWT**, gestión CRUD de productos y registro de pedidos; y una **SPA en React (Vite)** con estado global mediante **Context API**, ruteo profesional y rutas protegidas.

**Curso:** Full Stack Developer — ITBA Educación Ejecutiva · **Comisión:** Aula General · **Entrega Final:** Sprints 7 y 8 (Lanzamiento del E-commerce)

## 👥 Integrantes (Grupo 1)

- Cristian Joel Soto
- Marcos Demian Garcia
- Catalina Schamberger

---

## 🚀 Despliegue (Deploy)

- 🌐 **Frontend (Vercel):** <https://e-commerce-muebleria-hermanos-jota-five.vercel.app/>
- ⚙️ **Backend API (Render):** <https://e-commerce-muebleria-hermanos-jota-grupo.onrender.com/>
- 🗄️ **Base de Datos:** MongoDB Atlas

---

## 💻 Instalación y ejecución local

Requisitos: [Node.js](https://nodejs.org/) (LTS), Git y un cluster en [MongoDB Atlas](https://www.mongodb.com/atlas).

```bash
git clone https://github.com/MarcosDemian/E-commerce-Muebleria-Hermanos-Jota-Grupo-1.git
cd E-commerce-Muebleria-Hermanos-Jota-Grupo-1
```

### 1. Backend (`http://localhost:5000`)

Creá un archivo `.env` dentro de la carpeta `backend` (podés guiarte con `backend/.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/muebleria_jota?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_jwt_muy_segura
JWT_EXPIRES_IN=7d

# Opcional: crea automáticamente un usuario administrador al iniciar si no existe
ADMIN_EMAIL=admin@hermanosjota.com.ar
ADMIN_PASSWORD=tu_password_admin
```

Instalá las dependencias e iniciá el servidor:

```bash
cd backend
npm install
npm run dev      # o `npm start`
```

> - Si la colección `products` está vacía al iniciar, el servidor ejecutará automáticamente un *seed* inicial con los 11 productos del catálogo (también podés correrlo manualmente con `npm run seed`).
> - Si definís `ADMIN_EMAIL` y `ADMIN_PASSWORD` en las variables de entorno, el servidor creará automáticamente el usuario con rol `admin` (con su contraseña hasheada) si aún no existe en la base de datos.

### 2. Frontend (`http://localhost:5173`)

En una segunda terminal:

```bash
cd client
npm install
npm run dev
```

> El backend debe estar corriendo antes de abrir el frontend. Por defecto apunta a `http://localhost:5000` (configurable mediante la variable de entorno `VITE_API_URL` en producción o en un `.env` local).
> En Windows, si `npm install` falla por la política de scripts de PowerShell, usá `npm.cmd install`.

---

## 🧪 Tests

**Backend — API (Jest + Supertest):** prueba el CRUD de productos, registro/login con bcrypt + JWT, rutas protegidas y creación/consulta de pedidos contra MongoDB.

```bash
cd backend
npm test
```

**Frontend — E2E (Playwright):** levanta el backend y el frontend automáticamente para probar los flujos de usuario.

```bash
cd client
npx playwright install chromium   # solo la primera vez
npm run test:e2e
```

Con `npm run test:e2e:ui` se abre una ventana interactiva para ver los tests paso a paso.

---

## 🏗️ Arquitectura

```text
├── backend/                          # API REST (Node.js + Express + Mongoose)
│   ├── data/productos.js             # Catálogo inicial (seed de 11 productos)
│   ├── models/
│   │   ├── Product.js                # Esquema de Producto
│   │   ├── User.js                   # Esquema de Usuario (hash bcrypt + roles cliente/admin)
│   │   └── Order.js                  # Esquema de Pedido vinculado al Usuario
│   ├── middlewares/
│   │   ├── auth.js                   # Middleware de verificación de JWT (Bearer token)
│   │   ├── logger.js                 # Registra método y URL de cada petición
│   │   └── errorHandler.js           # Manejo centralizado de 404 y errores 500
│   ├── routes/
│   │   ├── productos.routes.js       # CRUD de productos (/api/productos)
│   │   ├── auth.routes.js            # Registro, login y perfil (/api/auth)
│   │   └── pedidos.routes.js         # Pedidos protegidos con JWT (/api/pedidos)
│   ├── test/
│   │   ├── productos.test.js         # Tests CRUD de productos
│   │   └── auth_pedidos.test.js      # Tests de autenticación y pedidos
│   ├── seed.js                       # Script para poblar la base de datos
│   └── server.js                     # Punto de entrada, conexión a MongoDB y auto-seed
│
└── client/                           # SPA en React (Vite + React Router DOM)
    ├── e2e/                          # Tests extremo a extremo (Playwright)
    ├── playwright.config.js
    └── src/
        ├── context/
        │   ├── AuthContext.jsx       # Estado global de sesión, JWT, persistencia y rol admin
        │   └── CartContext.jsx       # Estado global del carrito y persistencia en localStorage
        ├── components/               # Navbar, Footer, ProductCard, ProductList,
        │                             # ProductDetail, ProductForm, ContactForm,
        │                             # CartDrawer (checkout con JWT), ProtectedRoute
        ├── pages/                    # Login, Register, Profile, MyOrders
        ├── config.js                 # Configuración centralizada de VITE_API_URL
        └── App.jsx                   # Providers (Auth + Cart) y definición de rutas
```

```text
React (Vercel)  ──fetch + JWT──▶  API Express (Render)  ──Mongoose──▶  MongoDB Atlas
```

---

## 🔌 Endpoints del Backend (API)

### Productos (`/api/productos`)

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api/productos` | `200` con la lista completa (soporta `?categoria=` y `?busqueda=`) |
| `GET` | `/api/productos/:id` | `200` con el producto por `_id` · `404` si no existe · `400` si el ObjectId es inválido |
| `POST` | `/api/productos` | `201` con el producto creado en MongoDB · `400` si fallan las validaciones |
| `PUT` | `/api/productos/:id` | `200` con el producto actualizado · `404` si no existe · `400` si los datos son inválidos |
| `DELETE` | `/api/productos/:id` | `200` confirmando la eliminación del producto · `404` si no existe |

### Autenticación (`/api/auth`)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/registro` *(alias `/register`)* | Público | Registra un usuario (contraseña hasheada con `bcryptjs`) y devuelve un JWT (`201`) |
| `POST` | `/api/auth/login` | Público | Valida credenciales contra MongoDB y devuelve un JWT (`200`) |
| `GET` | `/api/auth/perfil` *(alias `/me`)* | Protegido (JWT) | Devuelve los datos del usuario autenticado (`401` si no hay token válido) |

### Pedidos (`/api/pedidos`)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/pedidos` | Protegido (JWT) | Crea un pedido asociado al usuario del token y devuelve `201` |
| `GET` | `/api/pedidos/mis-pedidos` | Protegido (JWT) | Devuelve el historial de pedidos del usuario autenticado ordenados por fecha |
| `GET` | `/api/pedidos/:id` | Protegido (JWT) | Devuelve el detalle de un pedido específico del usuario |

> Los errores responden siempre en JSON con formato uniforme: `{ "error": true, "codigo": 400/401/404/500, "mensaje": "..." }`.

---

## 🧭 Rutas del Frontend (React Router DOM)

| Ruta | Vista / Componente | Acceso | Descripción |
|---|---|---|---|
| `/` | `HomeView` | Público | Página de inicio con presentación y piezas destacadas |
| `/productos` | `ProductList` | Público | Catálogo completo con buscador y filtros por categoría |
| `/productos/:id` | `ProductDetail` | Público | Ficha técnica del producto (`useParams`), selector de cantidad y agregado al carrito |
| `/contacto` | `ContactForm` | Público | Formulario de contacto controlado con validaciones |
| `/login` | `Login` | Público | Inicio de sesión con enlace a registro |
| `/registro` | `Register` | Público | Creación de cuenta nueva (rol `cliente`) |
| `/perfil` | `Profile` | Protegido | Datos de la cuenta del usuario logueado y cierre de sesión |
| `/mis-pedidos` | `MyOrders` | Protegido | Historial real de pedidos confirmados consultado a la API con JWT |
| `/admin/crear-producto` | `ProductForm` | Protegido (Admin) | Alta de nuevos productos en MongoDB (`POST`) |
| `/admin/editar-producto/:id` | `ProductForm` | Protegido (Admin) | Edición de productos existentes (`PUT`) |

---

## 🛠️ Decisiones técnicas tomadas

- **Autenticación segura con `bcryptjs` y `jsonwebtoken`**: las contraseñas nunca se guardan en texto plano ni se exponen en las respuestas JSON; el middleware `auth.js` verifica el header `Authorization: Bearer <token>` en cada ruta privada.
- **Estado global desacoplado con Context API**: `AuthContext` gestiona la sesión, revalida el JWT contra `/api/auth/perfil` al recargar la página y expone `isAuthenticated` e `isAdmin`; `CartContext` administra los productos del carrito y su persistencia en `localStorage`.
- **UI condicional y control de acceso por roles**: el menú de navegación adapta sus opciones según el estado de sesión (`Ingresar` vs. `Mi Perfil`, `Mis Pedidos`, `Cerrar Sesión`), y las acciones de gestión del catálogo (`+ Crear Producto`, editar y eliminar) son visibles y accesibles exclusivamente para usuarios con rol `admin` mediante `<ProtectedRoute requireAdmin>`.
- **Checkout conectado al backend**: al pulsar *Finalizar Compra*, el carrito exige sesión iniciada (redirigiendo a `/login` si es visitante), envía el `POST /api/pedidos` con el JWT, vacía el carrito automáticamente al confirmarse y redirige a `/mis-pedidos`.
- **Despliegue MERN desacoplado y seguro**: frontend en Vercel (con `vercel.json` para rewrites de SPA), backend en Render y base de datos en MongoDB Atlas, gestionando todos los secretos (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `VITE_API_URL`) mediante variables de entorno.
