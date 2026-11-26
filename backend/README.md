# Backend — Mueblería Hermanos Jota (Sprints 5, 6, 7 y 8)

API REST con Node.js + Express + MongoDB (Mongoose), autenticación con **bcrypt** + **JWT** y gestión de pedidos vinculados al usuario.

---

## 1. Variables de Entorno (`backend/.env`)

Crear un archivo `backend/.env` tomando como plantilla [`backend/.env.example`](./.env.example):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.g3lxdtn.mongodb.net/muebleria_jota?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_jwt_muy_segura
JWT_EXPIRES_IN=7d
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor Express (por defecto `5000`). |
| `MONGODB_URI` | Cadena de conexión a MongoDB Atlas. |
| `JWT_SECRET` | Clave secreta para firmar y verificar los JSON Web Tokens (`JWT`). |
| `JWT_EXPIRES_IN` | Tiempo de validez del token (por defecto `7d`). |

---

## 2. Instalación, Seed y Tests

```bash
cd backend
npm install
npm run seed     # (Opcional) Recarga los 11 productos iniciales en MongoDB
npm start        # Inicia servidor en http://localhost:5000
npm run dev      # Inicia con nodemon
npm test         # Ejecuta suites de tests (Productos CRUD + Auth JWT + Pedidos)
```

---

## 3. Documentación de Endpoints (Guía para Integrantes Día 2 y Día 3)

### A. Autenticación (`/api/auth`)

#### 1. Registro de usuario
- **Ruta:** `POST /api/auth/registro` *(alias disponible: `POST /api/auth/register`)*
- **Body (JSON):**
  ```json
  {
    "nombre": "Ana Pérez",
    "email": "ana@ejemplo.com",
    "password": "miPassword123"
  }
  ```
- **Respuesta exitosa (`201 Created`):**
  ```json
  {
    "mensaje": "Usuario registrado exitosamente.",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "usuario": {
      "_id": "674...",
      "id": "674...",
      "nombre": "Ana Pérez",
      "email": "ana@ejemplo.com",
      "rol": "cliente"
    },
    "user": { ... }
  }
  ```

#### 2. Login de usuario
- **Ruta:** `POST /api/auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "ana@ejemplo.com",
    "password": "miPassword123"
  }
  ```
- **Respuesta exitosa (`200 OK`):** Devuelve `{ mensaje, token, usuario, user }`.

#### 3. Perfil del usuario autenticado (Ruta Protegida)
- **Ruta:** `GET /api/auth/perfil` *(alias disponible: `GET /api/auth/me`)*
- **Header requerido:**
  ```http
  Authorization: Bearer <token>
  ```
- **Respuesta exitosa (`200 OK`):** Datos del usuario logueado (`_id`, `nombre`, `email`, `rol`, `usuario`). Si no hay token o es inválido devuelve `401 Unauthorized`.

---

### B. Pedidos (`/api/pedidos`) — *Rutas Protegidas con JWT*

Todas las rutas de `/api/pedidos` (alias `/api/orders`) exigen el header:
```http
Authorization: Bearer <token>
```

#### 1. Crear Pedido ("Finalizar Compra")
- **Ruta:** `POST /api/pedidos`
- **Header:** `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "items": [
      {
        "id": "674...",
        "nombre": "Aparador Uspallata",
        "precio": 890000,
        "cantidad": 1,
        "imagen": "img/aparador-uspallata.png"
      }
    ],
    "total": 890000
  }
  ```
  *(Nota: `total` se calcula automáticamente en el backend si no se envía).*
- **Respuesta exitosa (`201 Created`):** Objeto del pedido creado en MongoDB vinculado a `usuario`.

#### 2. Listar Pedidos del Usuario Logueado (Para vista `/mis-pedidos`)
- **Ruta:** `GET /api/pedidos/mis-pedidos` *(o `GET /api/pedidos`)*
- **Header:** `Authorization: Bearer <token>`
- **Respuesta exitosa (`200 OK`):** Array con los pedidos del usuario autenticado ordenados del más reciente al más antiguo.

---

### C. Productos CRUD (`/api/productos`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Lista todos los productos de MongoDB (acepta `?categoria=` y `?busqueda=`) |
| `GET` | `/api/productos/:id` | Obtiene un producto por su `_id` |
| `POST` | `/api/productos` | Crea un producto (`201 Created`) |
| `PUT` | `/api/productos/:id` | Actualiza un producto existente por `_id` |
| `DELETE` | `/api/productos/:id` | Elimina un producto por `_id` |
