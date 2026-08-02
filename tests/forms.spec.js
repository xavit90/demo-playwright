import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Formularios y validaciones', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/#/forms');
    await expect(page.getByTestId('forms-page')).toBeVisible();
  });

  test('enviar el formulario vacío falla la validación', async ({ page }) => {
    await page.getByTestId('form-submit').click();
    await expect(page.getByTestId('toast-error')).toBeVisible();
    await expect(page.getByTestId('field-fullname')).toHaveClass(/invalid/);
    await expect(page.getByTestId('form-success')).toBeHidden();
  });

  test('validación en vivo: email inválido al perder el foco', async ({ page }) => {
    await page.getByTestId('input-email').fill('no-es-email');
    await page.getByTestId('input-email').blur();
    await expect(page.getByTestId('field-email')).toHaveClass(/invalid/);
  });

  test('envío exitoso con todos los campos obligatorios', async ({ page }) => {
    await page.getByTestId('input-fullname').fill('Ana García');
    await page.getByTestId('input-email').fill('ana@demo.com');
    await page.getByTestId('input-password').fill('Password1!');
    await page.getByTestId('radio-plan-pro').check();
    await page.getByTestId('checkbox-terms').check();

    await page.getByTestId('form-submit').click();

    await expect(page.getByTestId('form-success')).toBeVisible();
    await expect(page.getByTestId('form-output')).toBeVisible();
    await expect(page.getByTestId('toast-success').last()).toBeVisible();
  });

  test('el contador de la biografía refleja la longitud', async ({ page }) => {
    await page.getByTestId('input-bio').fill('Hola mundo');
    await expect(page.getByTestId('bio-count')).toHaveText('10');
  });

  test('el slider actualiza su valor mostrado', async ({ page }) => {
    await page.getByTestId('input-range').fill('12');
    await expect(page.getByTestId('range-value')).toHaveText('12');
  });
});
