/* ==========================================================================
   MUEBLERÍA HERMANOS JOTA — CATÁLOGO DE PRODUCTOS CON FILTROS Y BÚSQUEDA
   ========================================================================== */

function formatearPrecio(precio) {
  return precio == null
    ? "Precio a consultar"
    : new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(precio);
}

function crearTarjeta(producto) {
  const a = document.createElement("article");
  a.className = "product-card";
  a.innerHTML = `
    <a class="product-image-link" href="producto.html?id=${producto.id}">
      <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
    </a>
    <div class="product-card-body">
      <p class="product-category">${producto.categoria}</p>
      <h2><a href="producto.html?id=${producto.id}">${producto.nombre}</a></h2>
      <div class="product-card-footer">
        <strong>${formatearPrecio(producto.precio)}</strong>
        <a class="button button-secondary" href="producto.html?id=${producto.id}">VER DETALLE</a>
      </div>
    </div>
  `;
  return a;
}

let categoriaActiva = "Todas";

function renderizarCategorias() {
  const container = document.querySelector("#category-filters");
  if (!container || typeof productos === "undefined") return;

  const categorias = ["Todas", ...new Set(productos.map(p => p.categoria))];

  container.innerHTML = categorias.map(cat => `
    <button class="filter-btn ${cat === categoriaActiva ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      categoriaActiva = btn.getAttribute('data-category');
      renderizarCategorias();
      filtrarYRenderizar();
    });
  });
}

function filtrarYRenderizar() {
  const grid = document.querySelector("#catalog-grid");
  const count = document.querySelector("#result-count");
  const searchInput = document.querySelector("#search-input");
  
  if (!grid || typeof productos === "undefined") return;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filtrados = productos.filter(p => {
    const coincideCategoria = (categoriaActiva === "Todas" || p.categoria === categoriaActiva);
    const coincideBusqueda = p.nombre.toLowerCase().includes(query) || (p.descripcion && p.descripcion.toLowerCase().includes(query));
    return coincideCategoria && coincideBusqueda;
  });

  grid.innerHTML = "";
  if (count) {
    count.textContent = `${filtrados.length} ${filtrados.length === 1 ? "pieza" : "piezas"}`;
  }

  if (filtrados.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>No encontramos productos con los criterios seleccionados.</p>
      </div>
    `;
    return;
  }

  filtrados.forEach((p) => grid.appendChild(crearTarjeta(p)));
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#search-input");
  if (searchInput) {
    searchInput.addEventListener("input", filtrarYRenderizar);
  }
  renderizarCategorias();
  filtrarYRenderizar();
});
