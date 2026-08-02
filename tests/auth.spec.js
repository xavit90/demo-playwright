import { test, expect } from '@playwright/test';
import { login, CREDENTIALS } from './helpers.js';

test.describe('Autenticación', () => {
  test('login exitoso lleva al dashboard', async ({ page }) => {
    await login(page);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('toast-success').last()).toBeVisible();
  });

  test('login con credenciales inválidas muestra error', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-username').fill('admin');
    await page.getByTestId('login-password').fill('incorrecta');
    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('error-password')).toHaveText('Usuario o contraseña incorrectos.');
    await expect(page.getByTestId('toast-error')).toBeVisible();
    await expect(page.getByTestId('login-page')).toBeVisible();
  });

  test('campos vacíos marcan los campos como inválidos y no navega', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('field-username')).toHaveClass(/invalid/);
    await expect(page.getByTestId('field-password')).toHaveClass(/invalid/);
    await expect(page.getByTestId('login-page')).toBeVisible();
  });

  test('mostrar/ocultar contraseña alterna el tipo del input', async ({ page }) => {
    await page.goto('/');
    const pass = page.getByTestId('login-password');
    await pass.fill(CREDENTIALS.password);
    await expect(pass).toHaveAttribute('type', 'password');

    await page.getByTestId('toggle-password').click();
    await expect(pass).toHaveAttribute('type', 'text');
  });

  test('guarda de rutas: sin sesión redirige a login', async ({ page }) => {
    await page.goto('/#/users');
    await expect(page.getByTestId('login-page')).toBeVisible();
  });

  test('con sesión, visitar /login redirige al dashboard', async ({ page }) => {
    await login(page);
    await page.goto('/#/login');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('cerrar sesión vuelve al login', async ({ page }) => {
    await login(page);
    await page.getByTestId('nav-logout').click();
    await expect(page.getByTestId('login-page')).toBeVisible();
  });
});
