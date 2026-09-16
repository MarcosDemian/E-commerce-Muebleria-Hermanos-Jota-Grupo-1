/* ==========================================================================
   MUEBLERÍA HERMANOS JOTA — VISTA DETALLE DE PRODUCTO
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

function obtenerProducto() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  if (typeof productos === "undefined") return null;
  return productos.find((p) => p.id === id);
}

function renderizarDetalle() {
  const contenedor = document.querySelector("#product-detail");
  if (!contenedor) return;

  const p = obtenerProducto();
  if (!p) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscás no está disponible en nuestro catálogo.</p>
        <a class="button button-primary" href="productos.html">VOLVER AL CATÁLOGO</a>
      </div>
    `;
    return;
  }

  // Especificaciones de fabricación
  const detallesHTML = p.detalles
    ? Object.entries(p.detalles)
        .map(
          ([clave, valor]) =>
            `<div><dt>${clave.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}</dt><dd>${valor}</dd></div>`
        )
        .join("")
    : "";

  contenedor.innerHTML = `
    <div class="detail-image">
      <img src="${p.imagen}" alt="${p.nombre}">
    </div>
    <div class="detail-content">
      <p class="product-category">${p.categoria}</p>
      <h1>${p.nombre}</h1>
      <p class="detail-description">${p.descripcion || "Pieza artesanal fabricada en maderas nativas seleccionadas."}</p>
      <div class="detail-price">${formatearPrecio(p.precio)}</div>
      
      <div class="product-qty-selector">
        <label for="detail-qty">Cantidad:</label>
        <select id="detail-qty">
          <option value="1">1 unidad</option>
          <option value="2">2 unidades</option>
          <option value="3">3 unidades</option>
          <option value="4">4 unidades</option>
          <option value="5">5 unidades</option>
        </select>
      </div>

      <button id="add-to-cart" class="button button-primary" type="button" style="width: 100%; margin-bottom: 1.5rem;">
        🛒 AÑADIR AL CARRITO
      </button>

      <div class="detail-specs">
        <h2>Ficha Técnica y Materiales</h2>
        <dl>${detallesHTML}</dl>
      </div>

      <p class="detail-note">Los tiempos y dimensiones son referencias para esta demo académica de Mueblería Hermanos Jota.</p>
    </div>
  `;

  document.querySelector("#add-to-cart").addEventListener("click", () => {
    const qtySelect = document.querySelector("#detail-qty");
    const cantidad = qtySelect ? parseInt(qtySelect.value, 10) : 1;
    
    if (window.carrito) {
      window.carrito.agregar(p, cantidad);
    }
  });
}

document.addEventListener("DOMContentLoaded", renderizarDetalle);
