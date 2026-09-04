const form = document.querySelector("#contact-form");
function mostrarError(campo, mensaje) {
  campo.classList.add("invalid");
  document.querySelector(`[data-error="${campo.name}"]`).textContent = mensaje;
}
function limpiarError(campo) {
  campo.classList.remove("invalid");
  document.querySelector(`[data-error="${campo.name}"]`).textContent = "";
}
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.querySelector("#nombre"),
    email = document.querySelector("#email"),
    mensaje = document.querySelector("#mensaje");
  let valido = true;
  [nombre, email, mensaje].forEach(limpiarError);
  if (!nombre.value.trim()) {
    mostrarError(nombre, "Ingresá tu nombre.");
    valido = false;
  }
  if (!email.value.trim()) {
    mostrarError(email, "Ingresá tu email.");
    valido = false;
  } else if (!emailValido(email.value.trim())) {
    mostrarError(email, "Ingresá un email válido.");
    valido = false;
  }
  if (!mensaje.value.trim()) {
    mostrarError(mensaje, "Escribí un mensaje.");
    valido = false;
  }
  if (!valido) return;
  form.hidden = true;
  const success = document.querySelector("#success-message");
  success.hidden = false;
  const title = document.createElement("h2");
  title.textContent = "Mensaje enviado";
  const text = document.createElement("p");
  text.textContent = `Gracias, ${nombre.value.trim()}. Recibimos tu consulta y pronto nos pondremos en contacto.`;
  success.append(title, text);
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
