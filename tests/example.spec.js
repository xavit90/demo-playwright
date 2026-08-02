import { test, expect } from '@playwright/test';

// Credenciales demo (ver README).
const USER = 'admin';
const PASS = 'playwright';

test('login y creación de usuario', async ({ page }) => {
  // Login
  await page.goto('/');
  await page.getByTestId('login-username').fill(USER);
  await page.getByTestId('login-password').fill(PASS);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('dashboard-page')).toBeVisible();

  // Ir a Usuarios y crear uno
  await page.goto('/#/users');
  await page.getByTestId('btn-new-user').click();
  await page.getByTestId('user-name-input').fill('Nuevo Tester');
  await page.getByTestId('user-email-input').fill('tester@demo.com');
  await page.getByTestId('user-save').click();
  // Puede haber varios toasts de éxito (p. ej. el de bienvenida del login);
  // verificamos el más reciente.
  await expect(page.getByTestId('toast-success').last()).toBeVisible();
});
