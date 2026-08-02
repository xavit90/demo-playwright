import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Componentes e interacciones', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/#/components');
    await expect(page.getByTestId('components-page')).toBeVisible();
  });

  test('el contador incrementa con cada clic', async ({ page }) => {
    const counter = page.getByTestId('btn-counter');
    await counter.click();
    await counter.click();
    await counter.click();
    await expect(page.getByTestId('counter-value')).toHaveText('3');
  });

  test('detecta el doble clic', async ({ page }) => {
    await page.getByTestId('btn-double').dblclick();
    await expect(page.getByTestId('double-status')).toHaveText('¡Doble clic detectado! ✅');
  });

  test('las pestañas cambian el panel visible', async ({ page }) => {
    await expect(page.getByTestId('panel-0')).toBeVisible();
    await page.getByTestId('tab-1').click();
    await expect(page.getByTestId('panel-1')).toBeVisible();
    await expect(page.getByTestId('panel-0')).toBeHidden();
  });

  test('el acordeón abre una sección', async ({ page }) => {
    const item = page.getByTestId('accordion-item-1');
    await expect(item).not.toHaveClass(/open/);
    await page.getByTestId('accordion-head-1').click();
    await expect(item).toHaveClass(/open/);
  });

  test('la barra de progreso sube en incrementos de 10%', async ({ page }) => {
    await expect(page.getByTestId('progress-label')).toHaveText('35%');
    await page.getByTestId('progress-inc').click();
    await page.getByTestId('progress-inc').click();
    await expect(page.getByTestId('progress-label')).toHaveText('55%');
  });

  test('el modal de ejemplo se abre y se cierra al aceptar', async ({ page }) => {
    await page.getByTestId('open-modal-btn').click();
    await expect(page.getByTestId('demo-modal')).toBeVisible();
    await page.getByTestId('demo-modal-input').fill('texto de prueba');
    await page.getByTestId('demo-modal-ok').click();

    await expect(page.getByTestId('demo-modal')).toHaveCount(0);
    await expect(page.getByTestId('toast-success').last()).toBeVisible();
  });

  test('el diálogo de confirmación se cierra con Escape', async ({ page }) => {
    await page.getByTestId('open-confirm-btn').click();
    await expect(page.getByTestId('confirm-modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('confirm-modal')).toHaveCount(0);
  });

  test('el botón de toast de éxito muestra una notificación', async ({ page }) => {
    await page.getByTestId('toast-success-btn').click();
    await expect(page.getByTestId('toast-success').last()).toBeVisible();
  });
});
