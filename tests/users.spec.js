import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('CRUD de usuarios', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/#/users');
    await expect(page.getByTestId('users-page')).toBeVisible();
  });

  test('carga la lista seed con 23 usuarios y 4 páginas', async ({ page }) => {
    await expect(page.getByTestId('users-count')).toHaveText('23 usuarios');
    await expect(page.getByTestId('page-1')).toBeVisible();
    await expect(page.getByTestId('page-4')).toBeVisible();
  });

  test('paginación navega entre páginas', async ({ page }) => {
    await page.getByTestId('page-2').click();
    await expect(page.getByTestId('page-2')).toHaveClass(/active/);
    await page.getByTestId('page-next').click();
    await expect(page.getByTestId('page-3')).toHaveClass(/active/);
    await page.getByTestId('page-prev').click();
    await expect(page.getByTestId('page-2')).toHaveClass(/active/);
  });

  test('crear un usuario lo agrega al inicio de la lista', async ({ page }) => {
    await page.getByTestId('btn-new-user').click();
    await expect(page.getByTestId('user-modal')).toBeVisible();

    await page.getByTestId('user-name-input').fill('Nuevo Tester');
    await page.getByTestId('user-email-input').fill('tester@demo.com');
    await page.getByTestId('user-save').click();

    await expect(page.getByTestId('toast-success').last()).toBeVisible();
    await expect(page.getByTestId('users-count')).toHaveText('24 usuarios');
    // El nuevo usuario recibe id 24 y se inserta al frente (visible en la página 1).
    const newRow = page.getByTestId('user-row-24');
    await expect(newRow).toBeVisible();
    await expect(newRow.getByTestId('user-name')).toHaveText('Nuevo Tester');
  });

  test('crear usuario con datos inválidos muestra errores', async ({ page }) => {
    await page.getByTestId('btn-new-user').click();
    await page.getByTestId('user-name-input').fill('ab'); // < 3 caracteres
    await page.getByTestId('user-email-input').fill('correo-malo');
    await page.getByTestId('user-save').click();

    await expect(page.getByTestId('uf-name')).toHaveClass(/invalid/);
    await expect(page.getByTestId('uf-email')).toHaveClass(/invalid/);
    await expect(page.getByTestId('toast-warning')).toBeVisible();
    await expect(page.getByTestId('user-modal')).toBeVisible(); // sigue abierto
  });

  test('editar un usuario actualiza su nombre', async ({ page }) => {
    await page.getByTestId('btn-edit-1').click();
    await expect(page.getByTestId('user-modal')).toBeVisible();

    const nameInput = page.getByTestId('user-name-input');
    await nameInput.fill('Ana Editada');
    await page.getByTestId('user-save').click();

    await expect(page.getByTestId('toast-success').last()).toBeVisible();
    await expect(page.getByTestId('user-row-1').getByTestId('user-name')).toHaveText('Ana Editada');
  });

  test('eliminar un usuario lo quita de la tabla', async ({ page }) => {
    await page.getByTestId('btn-delete-1').click();
    await expect(page.getByTestId('confirm-modal')).toBeVisible();
    await page.getByTestId('confirm-accept').click();

    await expect(page.getByTestId('toast-success').last()).toBeVisible();
    await expect(page.getByTestId('users-count')).toHaveText('22 usuarios');
    await expect(page.getByTestId('user-row-1')).toHaveCount(0);
  });

  test('cancelar la eliminación no borra al usuario', async ({ page }) => {
    await page.getByTestId('btn-delete-1').click();
    await page.getByTestId('confirm-cancel').click();
    await expect(page.getByTestId('users-count')).toHaveText('23 usuarios');
    await expect(page.getByTestId('user-row-1')).toBeVisible();
  });

  test('buscar por correo filtra a un solo usuario', async ({ page }) => {
    await page.getByTestId('users-search').fill('ana.garcia@demo.com');
    await expect(page.getByTestId('users-count')).toHaveText('1 usuario');
    await expect(page.getByTestId('user-row-1')).toBeVisible();
  });

  test('filtrar por rol Administrador deja 6 usuarios', async ({ page }) => {
    await page.getByTestId('filter-role').selectOption('Administrador');
    await expect(page.getByTestId('users-count')).toHaveText('6 usuarios');
  });

  test('búsqueda sin coincidencias muestra el estado vacío', async ({ page }) => {
    await page.getByTestId('users-search').fill('zzzzz-no-existe');
    await expect(page.getByTestId('users-empty')).toBeVisible();
    await expect(page.getByTestId('users-count')).toHaveText('0 usuarios');
  });
});
