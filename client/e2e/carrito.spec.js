import { test, expect } from '@playwright/test';
import { agregarAlCarrito, irAlCatalogo, verDetalleDe, formatoAR } from './helpers';

// Precios del catálogo usados en las cuentas (backend/data/productos.js)
const BUTACA = { nombre: 'Butaca Mendoza', precio: 620000 };
const APARADOR = { nombre: 'Aparador Uspallata', precio: 890000 };

// Cada test arranca con un navegador limpio, así que el carrito siempre empieza vacío
const drawer = (page) => page.locator('.cart-drawer-container');
const contador = (page) => page.locator('.cart-count');
const total = (page) => page.locator('.cart-total-row strong');

test.describe('Carrito de compras', () => {
  test('arranca vacío', async ({ page }) => {
    await page.goto('/');
    await expect(contador(page)).toHaveText('0');

    await page.getByRole('button', { name: 'Carrito de compras' }).click();
    await expect(drawer(page).getByText('Tu carrito está vacío')).toBeVisible();
  });

  test('agregar un producto abre el carrito y actualiza contador y total', async ({ page }) => {
    await agregarAlCarrito(page, BUTACA.nombre);

    await expect(drawer(page)).toBeVisible();
    await expect(drawer(page).getByText(BUTACA.nombre)).toBeVisible();
    await expect(contador(page)).toHaveText('1');
    await expect(total(page)).toContainText(formatoAR(BUTACA.precio));
    await expect(page.getByText(`"${BUTACA.nombre}" agregado al carrito`)).toBeVisible();
  });

  test('el selector de cantidad del detalle suma varias unidades', async ({ page }) => {
    await agregarAlCarrito(page, BUTACA.nombre, 3);

    await expect(contador(page)).toHaveText('3');
    await expect(total(page)).toContainText(formatoAR(BUTACA.precio * 3));
  });

  test('los botones + y - cambian la cantidad y recalculan el total', async ({ page }) => {
    await agregarAlCarrito(page, BUTACA.nombre);

    await drawer(page).getByRole('button', { name: '+', exact: true }).click();
    await expect(contador(page)).toHaveText('2');
    await expect(total(page)).toContainText(formatoAR(BUTACA.precio * 2));

    await drawer(page).getByRole('button', { name: '-', exact: true }).click();
    await expect(contador(page)).toHaveText('1');
    await expect(total(page)).toContainText(formatoAR(BUTACA.precio));
  });

  test('bajar la cantidad a 0 elimina el producto', async ({ page }) => {
    await agregarAlCarrito(page, BUTACA.nombre);

    await drawer(page).getByRole('button', { name: '-', exact: true }).click();

    await expect(drawer(page).getByText('Tu carrito está vacío')).toBeVisible();
    await expect(contador(page)).toHaveText('0');
  });

  test('el total suma productos distintos', async ({ page }) => {
    await agregarAlCarrito(page, BUTACA.nombre);
    await page.getByRole('button', { name: 'Cerrar carrito' }).click();
    await agregarAlCarrito(page, APARADOR.nombre);

    await expect(contador(page)).toHaveText('2');
    await expect(drawer(page).getByText(BUTACA.nombre)).toBeVisible();
    await expect(drawer(page).getByText(APARADOR.nombre)).toBeVisible();
    await expect(total(page)).toContainText(formatoAR(BUTACA.precio + APARADOR.precio));
  });

  test('el botón × elimina un producto', async ({ page }) => {
    await agregarAlCarrito(page, BUTACA.nombre);

    await drawer(page).getByTitle('Eliminar').click();

    await expect(drawer(page).getByText('Tu carrito está vacío')).toBeVisible();
    await expect(page.getByText('Producto eliminado del carrito')).toBeVisible();
  });

  test('el carrito persiste al recargar la página (localStorage)', async ({ page }) => {
    await agregarAlCarrito(page, BUTACA.nombre, 2);

    await page.reload();

    await expect(contador(page)).toHaveText('2');
    await page.getByRole('button', { name: 'Carrito de compras' }).click();
    await expect(drawer(page).getByText(BUTACA.nombre)).toBeVisible();
    await expect(total(page)).toContainText(formatoAR(BUTACA.precio * 2));
  });

  test('si el localStorage está corrupto, la app igual carga con el carrito vacío', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('hj_cart_items_v2', 'esto no es json');
    });

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Piezas destacadas' })).toBeVisible();
    await expect(contador(page)).toHaveText('0');
  });

  test('"Vaciar" pide confirmación: Cancelar conserva y Aceptar vacía', async ({ page }) => {
    await agregarAlCarrito(page, BUTACA.nombre);

    await drawer(page).getByRole('button', { name: 'Vaciar' }).click();
    await expect(page.getByRole('heading', { name: '¿Vaciar carrito?' })).toBeVisible();

    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(contador(page)).toHaveText('1');

    await drawer(page).getByRole('button', { name: 'Vaciar' }).click();
    await page.getByRole('button', { name: 'Aceptar' }).click();
    await expect(contador(page)).toHaveText('0');
    await expect(drawer(page).getByText('Tu carrito está vacío')).toBeVisible();
  });

  test('"Finalizar compra" muestra el aviso, vacía el carrito y cierra el panel', async ({ page }) => {
    await agregarAlCarrito(page, BUTACA.nombre);

    // La app usa alert(): hay que escucharlo ANTES de hacer el click
    let mensaje = '';
    page.once('dialog', async (dialog) => {
      mensaje = dialog.message();
      await dialog.accept();
    });

    await drawer(page).getByRole('button', { name: 'Finalizar Compra' }).click();

    await expect.poll(() => mensaje).toContain('Gracias por tu pedido');
    await expect(contador(page)).toHaveText('0');
    await expect(drawer(page)).toBeHidden();
  });

  test('"Ver Catálogo" desde el carrito vacío lleva al listado', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Carrito de compras' }).click();
    await drawer(page).getByRole('button', { name: 'Ver Catálogo' }).click();

    await expect(page.getByRole('heading', { name: 'El catálogo' })).toBeVisible();
  });

  test('se puede agregar desde el catálogo y seguir comprando', async ({ page }) => {
    // Flujo completo: catálogo -> detalle -> carrito -> cerrar -> otro producto
    await irAlCatalogo(page);
    await verDetalleDe(page, BUTACA.nombre);
    await page.getByRole('button', { name: /AÑADIR AL CARRITO/ }).click();
    await page.getByRole('button', { name: 'Cerrar carrito' }).click();
    await expect(drawer(page)).toBeHidden();

    await page.getByRole('button', { name: /Volver al catálogo/ }).click();
    await expect(page.getByRole('heading', { name: 'El catálogo' })).toBeVisible();
    await expect(contador(page)).toHaveText('1');
  });
});