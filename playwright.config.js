import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

/**
 * Configuración de Playwright para la demo front-end.
 * Sirve la app estática en el puerto 5511 y corre los tests contra ella.
 * @see https://playwright.dev/docs/test-configuration
 */

// Si hay un navegador persistente corriendo (npm run browser:open), la suite
// se conecta a esa instancia ya abierta en vez de lanzar un navegador nuevo.
const wsEndpoint = existsSync('.browser-ws')
  ? readFileSync('.browser-ws', 'utf8').trim()
  : undefined;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5511',
    trace: 'on-first-retry',
    // Reutiliza el navegador persistente si está disponible.
    ...(wsEndpoint ? { connectOptions: { wsEndpoint } } : {}),
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Descomenta para probar en más navegadores:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // Arranca la app automáticamente antes de correr los tests.
  // La app usa módulos ES, por lo que necesita servirse por HTTP (no file://).
  webServer: {
    command: 'npx serve -l 5511',
    url: 'http://localhost:5511',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
