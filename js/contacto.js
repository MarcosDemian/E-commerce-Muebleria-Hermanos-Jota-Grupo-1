/* ==========================================================================
   MUEBLERÍA HERMANOS JOTA — VALIDACIÓN Y MANEJO DE CONTACTO (DOM)
   Consigna Final Sprint 1 y 2
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  const successMsg = document.querySelector("#success-message");

  if (!form) return;

  const inputs = {
    nombre: document.querySelector("#nombre"),
    email: document.querySelector("#email"),
    mensaje: document.querySelector("#mensaje"),
  };

  const errors = {
    nombre: document.querySelector('[data-error="nombre"]'),
    email: document.querySelector('[data-error="email"]'),
    mensaje: document.querySelector('[data-error="mensaje"]'),
  };

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validarCampo(nombreCampo) {
    const input = inputs[nombreCampo];
    const errorEl = errors[nombreCampo];
    if (!input || !errorEl) return true;

    const valor = input.value.trim();
    let errorTexto = "";

    if (nombreCampo === "nombre") {
      if (!valor) {
        errorTexto = "El nombre es obligatorio.";
      } else if (valor.length < 3) {
        errorTexto = "El nombre debe tener al menos 3 caracteres.";
      }
    } else if (nombreCampo === "email") {
      if (!valor) {
        errorTexto = "El email es obligatorio.";
      } else if (!validarEmail(valor)) {
        errorTexto = "Por favor, ingresá un email válido.";
      }
    } else if (nombreCampo === "mensaje") {
      if (!valor) {
        errorTexto = "El mensaje es obligatorio.";
      } else if (valor.length < 10) {
        errorTexto = "El mensaje debe tener al menos 10 caracteres.";
      }
    }

    if (errorTexto) {
      input.classList.add("invalid");
      errorEl.textContent = errorTexto;
      return false;
    } else {
      input.classList.remove("invalid");
      errorEl.textContent = "";
      return true;
    }
  }

  // Validación en tiempo real (blur e input)
  Object.keys(inputs).forEach((key) => {
    if (inputs[key]) {
      inputs[key].addEventListener("blur", () => validarCampo(key));
      inputs[key].addEventListener("input", () => {
        if (inputs[key].classList.contains("invalid")) {
          validarCampo(key);
        }
      });
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const esNombreValido = validarCampo("nombre");
    const esEmailValido = validarCampo("email");
    const esMensajeValido = validarCampo("mensaje");

    if (esNombreValido && esEmailValido && esMensajeValido) {
      const nombreUsuario = inputs.nombre.value.trim();
      
      form.style.display = "none";
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.innerHTML = `
          <h2>¡Mensaje enviado con éxito!</h2>
          <p>Gracias <strong>${nombreUsuario}</strong> por comunicarte con Hermanos Jota. Nos pondremos en contacto desde Casa Taller a la brevedad.</p>
          <button class="button button-secondary" style="margin-top: 1rem;" onclick="location.reload()">Enviar otro mensaje</button>
        `;
      }
    }
  });
});
