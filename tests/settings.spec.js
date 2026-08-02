import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Configuración', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/#/settings');
    await expect(page.getByTestId('settings-page')).toBeVisible();
  });

  test('activar el modo oscuro cambia el tema del documento', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    // El checkbox real está oculto/fuera del viewport tras un switch estilizado;
    // se activa clicando su etiqueta visible, como haría un usuario.
    await page.getByText('Modo oscuro').click();
    await expect(page.getByTestId('setting-theme')).toBeChecked();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('guardar cambios muestra un toast de éxito', async ({ page }) => {
    await page.getByTestId('settings-save').click();
    await expect(page.getByTestId('toast-success').last()).toBeVisible();
    await expect(page.getByTestId('toast-message').last()).toHaveText('Configuración guardada.');
  });

  test('restablecer muestra un toast informativo', async ({ page }) => {
    await page.getByTestId('settings-reset').click();
    await expect(page.getByTestId('toast-info').last()).toBeVisible();
  });

  test('zona de peligro: eliminar cuenta requiere confirmación', async ({ page }) => {
    await page.getByTestId('delete-account').click();
    await expect(page.getByTestId('confirm-modal')).toBeVisible();
    await page.getByTestId('confirm-accept').click();
    await expect(page.getByTestId('toast-error').last()).toBeVisible();
  });
});
