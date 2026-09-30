# Backend — Mueblería Hermanos Jota

API REST con Node.js + Express que sirve el catálogo de productos al frontend React.

## Instalación y ejecución

```bash
cd backend
npm install
npm start        # http://localhost:5000
# o, con recarga automática:
npm run dev
```

El puerto se puede cambiar con la variable `PORT` (por defecto 5000).

## Endpoints

| Método | Ruta                | Respuesta                                              |
|--------|---------------------|--------------------------------------------------------|
| GET    | `/api/productos`    | 200 — array JSON con todos los productos               |
| GET    | `/api/productos/:id`| 200 — producto / 404 si no existe / 400 si el id no es numérico |

`GET /api/productos` acepta filtros opcionales: `?categoria=Living` y `?busqueda=mesa`.

## Estructura

```
backend/
├── server.js                   # Configuración de Express y middlewares globales
├── data/productos.js           # Array de objetos con los 11 productos
├── routes/productos.routes.js  # express.Router con las rutas de productos
└── middlewares/
    ├── logger.js               # Loguea método y URL de cada petición
    └── errorHandler.js         # Manejador de 404 y manejador de errores centralizado
```

## Decisiones tomadas

- **Orden de middlewares:** `logger` → `cors` → `express.json()` → rutas → 404 → errores. El logger va primero para registrar toda petición, incluso las que fallan.
- **Datos en `.js`:** el catálogo es un array exportado con `module.exports`, sin base de datos, como pide la consigna.
- **express.Router:** las rutas de productos viven en su propio módulo y se montan en `/api/productos`.
- **Errores en JSON:** todos los errores (404, 400, 500) responden con `{ error, codigo, mensaje }` para que el frontend pueda manejarlos de forma uniforme.
- **CORS:** habilitado porque React (puerto 3000) y la API (puerto 5000) corren en orígenes distintos.
- **Imágenes:** el campo `imagen` guarda una ruta relativa (`img/...`); las imágenes deberán copiarse a `client/public/img` cuando se arme el frontend.
