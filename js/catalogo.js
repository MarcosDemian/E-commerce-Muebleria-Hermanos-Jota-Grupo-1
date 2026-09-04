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
  a.innerHTML = `<a class="product-image-link" href="producto.html?id=${producto.id}"><img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy"></a><div class="product-card-body"><p class="product-category">${producto.categoria}</p><h2><a href="producto.html?id=${producto.id}">${producto.nombre}</a></h2><div class="product-card-footer"><strong>${formatearPrecio(producto.precio)}</strong><a class="button button-secondary" href="producto.html?id=${producto.id}">VER DETALLE</a></div></div>`;
  return a;
}
function renderizarCatalogo(lista) {
  const grid = document.querySelector("#catalog-grid"),
    count = document.querySelector("#result-count");
  grid.innerHTML = "";
  count.textContent = `${lista.length} ${lista.length === 1 ? "pieza" : "piezas"}`;
  if (!lista.length) {
    const e = document.createElement("p");
    e.className = "empty-state";
    e.textContent = "No encontramos productos con esa búsqueda.";
    grid.appendChild(e);
    return;
  }
  lista.forEach((p) => grid.appendChild(crearTarjeta(p)));
}
document.querySelector("#search-input").addEventListener("input", (e) => {
  const t = e.target.value.trim().toLowerCase();
  renderizarCatalogo(
    productos.filter((p) => p.nombre.toLowerCase().includes(t)),
  );
});
function actualizarContadorCarrito() {
  const carrito = JSON.parse(
    localStorage.getItem("hermanosJotaCarrito") || "[]",
  );
  document
    .querySelectorAll(".cart-count")
    .forEach((c) => (c.textContent = carrito.length));
}
actualizarContadorCarrito();
renderizarCatalogo(productos);
