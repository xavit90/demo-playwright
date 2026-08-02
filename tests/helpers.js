import { expect } from '@playwright/test';

// Credenciales demo (ver README / store.js).
export const CREDENTIALS = { username: 'admin', password: 'playwright' };

/**
 * Inicia sesión y deja la app en el dashboard.
 * El estado vive en memoria y se reinicia con cada contexto nuevo,
 * por lo que cada test parte de datos limpios y deterministas.
 */
export async function login(page) {
  await page.goto('/');
  await page.getByTestId('login-username').fill(CREDENTIALS.username);
  await page.getByTestId('login-password').fill(CREDENTIALS.password);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('dashboard-page')).toBeVisible();
}
