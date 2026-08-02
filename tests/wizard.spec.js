import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Asistente multi-paso', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/#/wizard');
    await expect(page.getByTestId('wizard-page')).toBeVisible();
  });

  test('inicia en el paso 0 con "Atrás" deshabilitado', async ({ page }) => {
    await expect(page.getByTestId('wizard-step-0')).toBeVisible();
    await expect(page.getByTestId('wizard-step-1')).toBeHidden();
    await expect(page.getByTestId('wizard-back')).toBeDisabled();
  });

  test('avanzar con campos vacíos muestra advertencia y no avanza', async ({ page }) => {
    await page.getByTestId('wizard-next').click();
    await expect(page.getByTestId('toast-warning')).toBeVisible();
    await expect(page.getByTestId('wizard-step-0')).toBeVisible();
  });

  test('flujo completo de los 3 pasos y finalización', async ({ page }) => {
    // Paso 0
    await page.getByTestId('wizard-username').fill('usuario123');
    await page.getByTestId('wizard-email').fill('usuario@demo.com');
    await page.getByTestId('wizard-next').click();

    // Paso 1
    await expect(page.getByTestId('wizard-step-1')).toBeVisible();
    await page.getByTestId('wizard-display').fill('Usuario Demo');
    await page.getByTestId('wizard-role').selectOption('Editor');
    await page.getByTestId('wizard-next').click();

    // Paso 2: resumen
    await expect(page.getByTestId('wizard-step-2')).toBeVisible();
    await expect(page.getByTestId('wizard-summary')).toContainText('usuario123');
    await expect(page.getByTestId('wizard-finish')).toBeVisible();

    await page.getByTestId('wizard-finish').click();
    await expect(page.getByTestId('toast-success').last()).toBeVisible();
    // Tras finalizar, el asistente se reinicia al paso 0.
    await expect(page.getByTestId('wizard-step-0')).toBeVisible();
  });

  test('el botón "Atrás" regresa al paso anterior', async ({ page }) => {
    await page.getByTestId('wizard-username').fill('usuario123');
    await page.getByTestId('wizard-email').fill('usuario@demo.com');
    await page.getByTestId('wizard-next').click();
    await expect(page.getByTestId('wizard-step-1')).toBeVisible();

    await page.getByTestId('wizard-back').click();
    await expect(page.getByTestId('wizard-step-0')).toBeVisible();
  });
});
