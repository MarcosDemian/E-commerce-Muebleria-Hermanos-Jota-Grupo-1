function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
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
function crearTarjeta(producto) {
  const a = document.createElement("article");
  a.className = "product-card";
  a.innerHTML = `<a class="product-image-link" href="producto.html?id=${producto.id}"><img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy"></a><div class="product-card-body"><p class="product-category">${producto.categoria}</p><h3><a href="producto.html?id=${producto.id}">${producto.nombre}</a></h3><div class="product-card-footer"><strong>${formatearPrecio(producto.precio)}</strong><a class="small-link" href="producto.html?id=${producto.id}">Ver detalle</a></div></div>`;
  return a;
}
async function cargarProductosDestacados() {
  const contenedor = document.querySelector("#featured-products");
  await esperar(650);
  contenedor.innerHTML = "";
  productos.slice(0, 4).forEach((p) => contenedor.appendChild(crearTarjeta(p)));
}
actualizarContadorCarrito();
cargarProductosDestacados();
