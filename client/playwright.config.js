// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de los tests E2E (extremo a extremo).
 * Se ejecutan con:  npm run test:e2e   (dentro de /client)
 *
 * Playwright levanta SOLO el backend (:5000) y el frontend (:5173) antes de
 * empezar, y los apaga al terminar. Si ya los tenés corriendo, los reutiliza.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',      // guarda el detalle paso a paso solo si falla
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: [
    {
      command: 'npm start',
      cwd: '../backend',
      url: 'http://localhost:5000/api/productos',
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});