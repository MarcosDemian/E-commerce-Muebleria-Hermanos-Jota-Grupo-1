import { test, expect } from '@playwright/test';

test.describe('Formulario de contacto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('button', { name: 'Contacto' })
      .click();
    await expect(page.getByRole('heading', { name: 'Contacto', level: 1 })).toBeVisible();
  });

  test('enviar vacío muestra un error en cada campo', async ({ page }) => {
    await page.getByRole('button', { name: 'ENVIAR MENSAJE' }).click();

    await expect(page.getByText('El nombre es obligatorio.')).toBeVisible();
    await expect(page.getByText('El email es obligatorio.')).toBeVisible();
    await expect(page.getByText('El mensaje es obligatorio.')).toBeVisible();
    await expect(page.getByText('¡Mensaje enviado con éxito!')).toHaveCount(0);
  });

  test('valida longitud mínima y formato de email', async ({ page }) => {
    await page.getByLabel('Nombre').fill('ab');
    await page.getByLabel('Email').fill('no-es-un-email');
    await page.getByLabel('Mensaje').fill('corto');
    await page.getByRole('button', { name: 'ENVIAR MENSAJE' }).click();

    await expect(page.getByText('El nombre debe tener al menos 3 caracteres.')).toBeVisible();
    await expect(page.getByText('Por favor, ingresá un email válido.')).toBeVisible();
    await expect(page.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeVisible();
  });

  test('el error desaparece cuando se corrige el campo', async ({ page }) => {
    await page.getByRole('button', { name: 'ENVIAR MENSAJE' }).click();
    await expect(page.getByText('El nombre es obligatorio.')).toBeVisible();

    await page.getByLabel('Nombre').fill('Santiago');

    await expect(page.getByText('El nombre es obligatorio.')).toHaveCount(0);
  });

  test('un envío válido muestra la confirmación con el nombre', async ({ page }) => {
    await page.getByLabel('Nombre').fill('Santiago');
    await page.getByLabel('Email').fill('santi@ejemplo.com');
    await page.getByLabel('Mensaje').fill('Quisiera consultar por la mesa de comedor.');
    await page.getByRole('button', { name: 'ENVIAR MENSAJE' }).click();

    await expect(page.getByRole('heading', { name: '¡Mensaje enviado con éxito!' })).toBeVisible();
    await expect(page.getByText('Santiago', { exact: false })).toBeVisible();
  });

  test('"Enviar otro mensaje" vuelve al formulario vacío', async ({ page }) => {
    await page.getByLabel('Nombre').fill('Santiago');
    await page.getByLabel('Email').fill('santi@ejemplo.com');
    await page.getByLabel('Mensaje').fill('Quisiera consultar por la mesa de comedor.');
    await page.getByRole('button', { name: 'ENVIAR MENSAJE' }).click();

    await page.getByRole('button', { name: 'Enviar otro mensaje' }).click();

    await expect(page.getByLabel('Nombre')).toHaveValue('');
    await expect(page.getByLabel('Email')).toHaveValue('');
    await expect(page.getByLabel('Mensaje')).toHaveValue('');
  });
});