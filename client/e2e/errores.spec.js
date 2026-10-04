import { test, expect } from '@playwright/test';

// Estos tests simulan fallos de la API interceptando las peticiones con page.route(),
// así no hace falta apagar el backend de verdad.

const irAProductos = async (page) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Navegación principal' })
    .getByRole('button', { name: 'Productos' })
    .click();
};

test.describe('Estados de carga y error', () => {
  test('muestra "cargando" mientras la API responde', async ({ page }) => {
    // Demoramos la respuesta de la lista para poder ver el estado de carga
    await page.route('**/api/productos', async (route) => {
      await new Promise((r) => setTimeout(r, 1000));
      await route.continue();
    });

    await irAProductos(page);

    await expect(page.getByText(/Cargando piezas del catálogo/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'VER DETALLE' }).first()).toBeVisible();
    await expect(page.getByText(/Cargando piezas del catálogo/)).toHaveCount(0);
  });

  test('si el backend no responde, el catálogo muestra el error de conexión', async ({ page }) => {
    await page.route('**/api/productos', (route) => route.abort('connectionrefused'));

    await irAProductos(page);

    await expect(page.getByRole('heading', { name: /Error de Conexión/ })).toBeVisible();
    await expect(page.getByText(/Asegurate de que el backend esté corriendo/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'VER DETALLE' })).toHaveCount(0);
  });

  test('si la API responde 500, el catálogo muestra el error', async ({ page }) => {
    await page.route('**/api/productos', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: true, codigo: 500, mensaje: 'Error interno' }),
      })
    );

    await irAProductos(page);

    await expect(page.getByRole('heading', { name: /Error de Conexión/ })).toBeVisible();
  });

  test('si el producto no existe, el detalle ofrece volver al catálogo', async ({ page }) => {
    await page.route('**/api/productos/*', (route) =>
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: true, codigo: 404, mensaje: 'No se encontró el producto' }),
      })
    );

    await irAProductos(page);
    await page.getByRole('button', { name: 'VER DETALLE' }).first().click();

    await expect(page.getByRole('heading', { name: 'Producto no encontrado' })).toBeVisible();

    await page.getByRole('button', { name: 'VOLVER AL CATÁLOGO' }).click();
    await expect(page.getByRole('heading', { name: 'El catálogo' })).toBeVisible();
  });
});