# Mueblería Hermanos Jota — E-commerce Académico (Sprint 1 y 2)

**Curso**: Full Stack Developer — ITBA Educación Ejecutiva  
**Comisión**: Aula General  
**Equipo — Grupo 1**:
- **Cristian Joel Soto**
- **Marcos Demian Garcia**
- **Joaquin Esteban Monzón Fernández**

---

##  Resumen del Proyecto

Desarrollo e implementación del sitio E-commerce interactivo para **Mueblería Hermanos Jota**, construido **únicamente con tecnologías del lado del cliente: HTML5 semántico, CSS3 responsivo y JavaScript Vanilla**.

El proyecto simula una experiencia de compra completa sin backend, gestionando el catálogo, el estado del carrito (`localStorage`), la carga asíncrona y la interactividad vía eventos del DOM.

---

##  Requerimientos Funcionales y Técnicos Cumplidos

### 1. Páginas e Interfaz de Usuario
- **Inicio (`index.html`)**: Header con Isotipo Oficial `hj` (Siena Tostado `#A0522D`, dimensiones mínimas de 120px y padding de seguridad según Manual de Marca), Hero Banner principal, selección de 4 productos destacados cargados dinámicamente mediante simulación asíncrona (`setTimeout` + `Promise`) y Footer informativo.
- **Catálogo (`productos.html`)**: Grilla responsiva de productos obtenida desde `js/productos.js`, campo de búsqueda dinámica en tiempo real por texto, filtros interactivos por categoría (*Living*, *Comedor*, *Guardado*, *Dormitorio*, *Trabajo*), contador de resultados y enlaces a la vista de detalle.
- **Detalle de Producto (`producto.html`)**: Parseo dinámico del ID desde la URL (`?id=X`), imagen en alta resolución, ficha técnica detallada (madera nativa, acabado, medidas, origen, garantía), selector interactivo de cantidad pre-compra y botón "Añadir al Carrito".
- **Contacto (`contacto.html`)**: Formulario con campos Nombre, Email y Mensaje. Validación client-side en tiempo real con JavaScript, prevención de envío si hay errores e interacción mediante el DOM mostrando la confirmación de éxito sin recargar la página.

###  Estado Global de Carrito
- **Módulo `js/carrito.js`**: Implementación con `localStorage` (`hj_cart_items_v2`).
- **Header Badge**: Contador de items en la barra de navegación activo en todas las páginas.
- **Drawer Modal**: Carrito lateral desplegable con modificación de cantidades (`+` / `-`), eliminación individual de productos, botón de vaciar carrito, cálculo del total acumulado y simulación de Checkout.
- **Toasts**: Mensajes emergentes temporales al agregar o quitar productos.

###  Código Semántico y Estilos
- **HTML5**: Etiquetas semánticas obligatorias (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<dl>`, `<footer>`).
- **CSS3**: Archivo externo `css/styles.css` 100% responsivo (Mobile First), utilizando Flexbox y CSS Grid. Paleta de colores oficial: Siena Tostado (`#A0522D`), Verde Olivo (`#87A968`), Crema (`#F5E5D3`), Dorado (`#D4A437`) y Nogal (`#2C2623`).

---

##  Estructura de Archivos del Proyecto

```
E-commerce-Muebleria-Hermanos-Jota-Grupo-1-main/
├── index.html            # Página de Inicio / Hero / Destacados
├── productos.html        # Catálogo interactivo con filtros y búsqueda
├── producto.html         # Ficha técnica detallada de producto
├── contacto.html         # Formulario de contacto y validación DOM
├── README.md             # Documentación académica del entregable
├── css/
│   └── styles.css        # Sistema de diseño responsivo y componentes
├── js/
│   ├── productos.js      # Array de objetos con el catálogo completo (11 productos)
│   ├── carrito.js        # CarritoService, Drawer Modal, Toast y localStorage
│   ├── main.js           # Lógica de Inicio y carga asíncrona (setTimeout)
│   ├── catalogo.js       # Filtros por categoría y buscador dinámico
│   ├── detalle.js        # Parseo de URL y renderizado de especificaciones
│   └── contacto.js       # Validación client-side del formulario
└── img/                  # Identidad visual (logo-hj.png) y fotografías de piezas
```

---

## Fuente de Datos del Catálogo

El archivo `js/productos.js` cuenta con **11 productos**, superando el mínimo de 8 exigido por la consigna. 
- Los 6 productos principales cuentan con ficha técnica detallada proveniente de los textos del catálogo: *Mesa de Noche Aconcagua*, *Sofá Patagonia*, *Mesa Comedor Pampa*, *Sillas Córdoba*, *Escritorio Costa* y *Silla de Trabajo Belgrano*.
- Los 5 productos adicionales provienen del kit fotográfico (*Aparador Uspallata*, *Biblioteca Recoleta*, *Butaca Mendoza*, *Mesa de Centro Araucaria* y *Sillón Copacabana*).

---

##  Ejecución Local

No requiere la instalación de Node.js ni servidor backend. Para ejecutar el proyecto:
1. Clonar o descargar el repositorio.
2. Abrir `index.html` directamente en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).
3. O bien, utilizar la extensión **Live Server** de VS Code.
