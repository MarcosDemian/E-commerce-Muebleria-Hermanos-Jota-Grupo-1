import { test, expect } from '@playwright/test';
import { API, irAlCatalogo, abrirDetalle } from './helpers';

test.describe('Home', () => {
  test('muestra las 4 piezas destacadas cargadas desde la API', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Piezas destacadas' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'VER DETALLE' })).toHaveCount(4);
  });

  test('"Ver colección" lleva al catálogo', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'VER COLECCIÓN' }).click();

    await expect(page.getByRole('heading', { name: 'El catálogo' })).toBeVisible();
  });
});

test.describe('Catálogo', () => {
  test('lista todos los productos que devuelve la API', async ({ page, request }) => {
    const productos = await (await request.get(API)).json();
    await irAlCatalogo(page);

    await expect(page.getByRole('button', { name: 'VER DETALLE' })).toHaveCount(productos.length);
    await expect(page.getByText(`${productos.length} piezas`)).toBeVisible();
  });

  test('filtra por categoría', async ({ page, request }) => {
    const productos = await (await request.get(API)).json();
    const enLiving = productos.filter(p => p.categoria === 'Living').length;

    await irAlCatalogo(page);
    await page.getByRole('button', { name: 'Living', exact: true }).click();

    await expect(page.getByRole('button', { name: 'VER DETALLE' })).toHaveCount(enLiving);

    // Volver a "Todas" restaura el listado completo
    await page.getByRole('button', { name: 'Todas', exact: true }).click();
    await expect(page.getByRole('button', { name: 'VER DETALLE' })).toHaveCount(productos.length);
  });

  test('el buscador filtra por nombre', async ({ page }) => {
    await irAlCatalogo(page);
    await page.getByRole('searchbox').fill('butaca');

    await expect(page.getByRole('button', { name: 'VER DETALLE' })).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Butaca Mendoza' })).toBeVisible();
    await expect(page.getByText('1 pieza', { exact: true })).toBeVisible();
  });

  test('muestra un mensaje si la búsqueda no tiene resultados', async ({ page }) => {
    await irAlCatalogo(page);
    await page.getByRole('searchbox').fill('xyzxyz');

    await expect(page.getByText('No encontramos piezas que coincidan con la búsqueda.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'VER DETALLE' })).toHaveCount(0);
  });

  test('categoría y búsqueda se combinan', async ({ page }) => {
    await irAlCatalogo(page);
    await page.getByRole('button', { name: 'Comedor', exact: true }).click();
    await page.getByRole('searchbox').fill('butaca'); // la butaca es de Living

    await expect(page.getByText('No encontramos piezas que coincidan con la búsqueda.')).toBeVisible();
  });
});

test.describe('Detalle de producto', () => {
  test('muestra la ficha técnica y el precio', async ({ page }) => {
    await abrirDetalle(page, 'Butaca Mendoza');

    await expect(page.getByRole('heading', { name: 'Ficha Técnica y Materiales' })).toBeVisible();
    await expect(page.getByText('Guatambú macizo, tela bouclé')).toBeVisible();
    await expect(page.getByText(/620\.000/)).toBeVisible();
    await expect(page.getByRole('img', { name: 'Butaca Mendoza' })).toBeVisible();
  });

  test('"Volver al catálogo" regresa al listado', async ({ page }) => {
    await abrirDetalle(page, 'Butaca Mendoza');
    await page.getByRole('button', { name: /Volver al catálogo/ }).click();

    await expect(page.getByRole('heading', { name: 'El catálogo' })).toBeVisible();
  });
});