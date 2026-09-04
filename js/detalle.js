function formatearPrecio(precio) {
  return precio == null
    ? "Precio a consultar"
    : new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(precio);
}
function actualizarContadorCarrito() {
  const carrito = JSON.parse(
    localStorage.getItem("hermanosJotaCarrito") || "[]",
  );
  document
    .querySelectorAll(".cart-count")
    .forEach((c) => (c.textContent = carrito.length));
}
function obtenerProducto() {
  const params = new URLSearchParams(window.location.search);
  return productos.find((p) => p.id === Number(params.get("id")));
}
function renderizarDetalle() {
  const contenedor = document.querySelector("#product-detail"),
    p = obtenerProducto();
  if (!p) {
    contenedor.innerHTML =
      '<div class="empty-state"><h1>Producto no encontrado</h1><p>El producto que buscás no está disponible.</p><a class="button button-primary" href="productos.html">VOLVER AL CATÁLOGO</a></div>';
    return;
  }
  contenedor.innerHTML = `<div class="detail-image"><img src="${p.imagen}" alt="${p.nombre}"></div><div class="detail-content"><p class="product-category">${p.categoria}</p><h1>${p.nombre}</h1><p class="detail-description">${p.descripcion}</p><div class="detail-price">${formatearPrecio(p.precio)}</div><div class="detail-specs"><h2>Detalles del producto</h2><dl>${Object.entries(
    p.detalles,
  )
    .map(
      ([clave, valor]) =>
        `<div><dt>${clave.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}</dt><dd>${valor}</dd></div>`,
    )
    .join(
      "",
    )}</dl></div><button id="add-to-cart" class="button button-primary" type="button">AÑADIR AL CARRITO</button><p id="cart-feedback" class="cart-feedback" role="status"></p><p class="detail-note">Los tiempos y dimensiones son referencias para esta demo académica; confirmar ficha técnica antes de una compra real.</p></div>`;
  document.querySelector("#add-to-cart").addEventListener("click", () => {
    const carrito = JSON.parse(
      localStorage.getItem("hermanosJotaCarrito") || "[]",
    );
    carrito.push(p.id);
    localStorage.setItem("hermanosJotaCarrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    document.querySelector("#cart-feedback").textContent =
      "¡Listo! La pieza fue añadida al carrito.";
  });
}
actualizarContadorCarrito();
renderizarDetalle();
