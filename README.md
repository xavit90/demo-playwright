# 🎭 Playwright Demo App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Playwright](https://img.shields.io/badge/tested%20with-Playwright-2EAD33.svg)](https://playwright.dev)
![No build](https://img.shields.io/badge/build-none-lightgrey.svg)

Aplicación web de demostración **100% front-end** (HTML + CSS + JavaScript puro, sin
dependencias ni build) diseñada como campo de práctica para automatización con
**Playwright**. No hay backend ni persistencia real: los datos viven en memoria y se
reinician al recargar la página.

> Todos los elementos interactivos exponen atributos `data-testid` estables, pensados
> para escribir tests end-to-end reproducibles y deterministas.

## ✨ Características

- **Login simulado** con validación y credenciales demo.
- **Dashboard** con tarjetas de estadísticas, gráfico de barras y actividad reciente.
- **Formularios** con todos los tipos de campo (texto, email, número, fecha, select,
  multiselección, radio, checkbox, switch, range, color, archivo, textarea) y
  validaciones en vivo y al enviar.
- **CRUD de usuarios** con tabla, búsqueda, filtros, paginación y modales de crear/editar/eliminar.
- **Componentes**: botones (estados, loading, contador, doble clic), notificaciones
  (toasts), alertas, modales, diálogos de confirmación, pestañas, acordeón, barra de
  progreso, spinner y tooltip.
- **Asistente multi-paso** (wizard) con navegación por etapas y validación.
- **Configuración** con modo oscuro, switches y zona de peligro.
- **Navegación** con barra lateral colapsable, submenús, topbar con búsqueda,
  dropdown de notificaciones y menú de usuario.
- **Tema claro/oscuro** y diseño **responsive**.

Todos los elementos interactivos exponen atributos **`data-testid`** para selectores estables.

## 🚀 Cómo ejecutar

Al usar módulos ES, la app debe servirse por HTTP (no `file://`). Elige una opción:

```bash
python -m http.server 5511
```

```bash
npx serve -l 5511
```

Luego abre <http://localhost:5511>.

### Credenciales demo

| Campo      | Valor        |
| ---------- | ------------ |
| Usuario    | `admin`      |
| Contraseña | `playwright` |

## 🧪 Ejecutar la suite de tests

El repo incluye una suite de Playwright en `tests/`. Requiere Node.js 18+.

```bash
npm install
npx playwright install chromium
npm test
```

Playwright arranca la app automáticamente (ver `webServer` en `playwright.config.js`),
así que no hace falta levantar el servidor a mano. Otros comandos útiles:

| Comando               | Descripción                                        |
| --------------------- | -------------------------------------------------- |
| `npm test`            | Ejecuta toda la suite (headless).                  |
| `npm run test:ui`     | Abre el runner interactivo de Playwright.          |
| `npm run test:headed` | Ejecuta los tests con navegador visible.           |
| `npm run report`      | Abre el último reporte HTML.                        |
| `npm run browser:open`| Lanza un navegador persistente que la suite reutiliza. |

## 🧪 Ejemplo con Playwright

```js
import { test, expect } from '@playwright/test';

test('login y creación de usuario', async ({ page }) => {
  await page.goto('http://localhost:5511');

  // Login
  await page.getByTestId('login-username').fill('admin');
  await page.getByTestId('login-password').fill('playwright');
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('dashboard-page')).toBeVisible();

  // Ir a Usuarios y crear uno
  await page.goto('http://localhost:5511/#/users');
  await page.getByTestId('btn-new-user').click();
  await page.getByTestId('user-name-input').fill('Nuevo Tester');
  await page.getByTestId('user-email-input').fill('tester@demo.com');
  await page.getByTestId('user-save').click();
  await expect(page.getByTestId('toast-success')).toBeVisible();
});
```

## 🗺️ Rutas

| Ruta           | Descripción                         |
| -------------- | ----------------------------------- |
| `#/login`      | Inicio de sesión                    |
| `#/dashboard`  | Panel principal                     |
| `#/forms`      | Formularios y validaciones          |
| `#/users`      | CRUD de usuarios                    |
| `#/components` | Catálogo de componentes             |
| `#/wizard`     | Asistente multi-paso                |
| `#/settings`   | Configuración                       |

## 🔖 Selectores `data-testid` destacados

**Login:** `login-form`, `login-username`, `login-password`, `login-submit`, `toggle-password`, `login-remember`.

**Shell:** `sidebar`, `nav-dashboard`, `nav-forms`, `nav-users`, `nav-components`, `nav-wizard`,
`nav-settings`, `sidebar-toggle`, `theme-toggle`, `notifications-btn`, `user-menu-btn`, `nav-logout`.

**Formularios:** `demo-form`, `input-fullname`, `input-email`, `input-phone`, `input-age`,
`input-password`, `select-country`, `select-skills`, `radio-plan-*`, `input-range`, `input-color`,
`input-file`, `input-bio`, `switch-notifications`, `checkbox-terms`, `form-submit`, `form-reset`,
`form-output`, `form-success`, `error-*`.

**Usuarios (CRUD):** `users-table`, `users-search`, `filter-role`, `filter-status`, `btn-new-user`,
`user-row-{id}`, `btn-edit-{id}`, `btn-delete-{id}`, `user-modal`, `user-name-input`,
`user-email-input`, `user-save`, `confirm-modal`, `confirm-accept`, `users-pagination`, `page-{n}`.

**Componentes:** `btn-primary`/`btn-success`/`btn-warning`/`btn-danger`, `btn-loading`, `btn-counter`,
`btn-double`, `toast-success-btn`, `open-modal-btn`, `open-confirm-btn`, `tab-{n}`, `accordion-head-{n}`,
`progress-bar`, `progress-inc`, `progress-dec`, `spinner`, `tooltip`.

**Toasts:** `toast-container`, `toast-success`, `toast-warning`, `toast-error`, `toast-info`,
`toast-title`, `toast-message`, `toast-close`.

## 📁 Estructura

```
demo-playwright/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js          # router + shell (sidebar/topbar) — entry point
│   ├── core/           # núcleo transversal (usado por todas las vistas)
│   │   ├── store.js    # estado en memoria
│   │   └── ui.js       # toasts, modales, helpers
│   └── views/
│       ├── login.js
│       ├── dashboard.js
│       ├── forms.js
│       ├── users.js
│       ├── components.js
│       ├── wizard.js
│       └── settings.js
├── tests/              # specs de Playwright + helpers
├── scripts/
│   └── app/            # tooling de la app (browser-server.js)
├── playwright.config.js
├── LICENSE
└── README.md
```

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.
