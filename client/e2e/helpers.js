// Funciones de apoyo compartidas por los tests E2E.

export const API = 'http://localhost:5000/api/productos';

// Abre la app y espera a que el catálogo termine de cargar
export async function irAlCatalogo(page) {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Navegación principal' })
    .getByRole('button', { name: 'Productos' })
    .click();
  await page.getByRole('button', { name: 'VER DETALLE' }).first().waitFor();
}

// Hace click en "VER DETALLE" de la tarjeta de un producto (la identifica por su nombre)
export async function verDetalleDe(page, nombre) {
  await page
    .locator('article.product-card')
    .filter({ has: page.getByRole('heading', { name: nombre }) })
    .getByRole('button', { name: 'VER DETALLE' })
    .click();
}

// Abre el detalle de un producto por su nombre (desde el catálogo)
export async function abrirDetalle(page, nombre) {
  await irAlCatalogo(page);
  await verDetalleDe(page, nombre);
  await page.getByRole('heading', { level: 1, name: nombre }).waitFor();
}

// Agrega un producto al carrito desde su ficha de detalle
export async function agregarAlCarrito(page, nombre, cantidad = 1) {
  await abrirDetalle(page, nombre);
  if (cantidad > 1) {
    await page.getByLabel('Cantidad:').selectOption(String(cantidad));
  }
  await page.getByRole('button', { name: /AÑADIR AL CARRITO/ }).click();
}

// Número tal como lo muestra el carrito en es-AR (ej: 1250000 -> "1.250.000")
export function formatoAR(numero) {
  return numero.toLocaleString('es-AR');
}